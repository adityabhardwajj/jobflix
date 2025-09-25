import { NextResponse } from 'next/server';
import { llmAggregator, LLMRequest } from '@/lib/llm-aggregator';

// Enhanced rate limiting
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT = 20; // requests per minute (increased for enhanced capabilities)
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Request logging for analytics
const requestLog: Array<{
  timestamp: number;
  ip: string;
  message: string;
  provider: string;
  responseTime: number;
  tokensUsed: number;
}> = [];

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestTimestamps.get(ip) || [];
  
  // Remove timestamps older than the rate window
  const recentTimestamps = timestamps.filter(time => now - time < RATE_WINDOW);
  
  if (recentTimestamps.length >= RATE_LIMIT) {
    return true;
  }
  
  recentTimestamps.push(now);
  requestTimestamps.set(ip, recentTimestamps);
  return false;
}

function detectTaskType(message: string): LLMRequest['taskType'] {
  const lowerMessage = message.toLowerCase();
  
  // Code-related keywords
  if (lowerMessage.includes('code') || 
      lowerMessage.includes('program') || 
      lowerMessage.includes('function') ||
      lowerMessage.includes('algorithm') ||
      lowerMessage.includes('debug') ||
      lowerMessage.includes('javascript') ||
      lowerMessage.includes('python') ||
      lowerMessage.includes('react') ||
      lowerMessage.includes('typescript')) {
    return 'code';
  }
  
  // Creative keywords
  if (lowerMessage.includes('write') || 
      lowerMessage.includes('story') || 
      lowerMessage.includes('creative') ||
      lowerMessage.includes('poem') ||
      lowerMessage.includes('blog') ||
      lowerMessage.includes('article')) {
    return 'creative';
  }
  
  // Analysis keywords
  if (lowerMessage.includes('analyze') || 
      lowerMessage.includes('compare') || 
      lowerMessage.includes('evaluate') ||
      lowerMessage.includes('pros and cons') ||
      lowerMessage.includes('advantages') ||
      lowerMessage.includes('disadvantages')) {
    return 'analysis';
  }
  
  // Math keywords
  if (lowerMessage.includes('calculate') || 
      lowerMessage.includes('solve') || 
      lowerMessage.includes('equation') ||
      lowerMessage.includes('mathematics') ||
      lowerMessage.includes('formula') ||
      /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
    return 'math';
  }
  
  // Research keywords
  if (lowerMessage.includes('research') || 
      lowerMessage.includes('explain') || 
      lowerMessage.includes('what is') ||
      lowerMessage.includes('how does') ||
      lowerMessage.includes('tell me about') ||
      lowerMessage.includes('information about')) {
    return 'research';
  }
  
  return 'general';
}

function buildEnhancedContext(message: string, taskType: string): string {
  const contexts = {
    code: "You have access to the latest programming knowledge and best practices. Provide working code examples with explanations.",
    creative: "You can help with creative writing, content creation, and artistic projects. Be imaginative and original.",
    analysis: "You excel at breaking down complex topics, comparing options, and providing structured analysis.",
    math: "You can solve mathematical problems step-by-step with clear explanations and verification.",
    research: "You have access to comprehensive knowledge and can provide detailed, well-researched information.",
    general: "You can help with a wide variety of topics and questions with accurate, helpful responses."
  };
  
  return contexts[taskType as keyof typeof contexts] || contexts.general;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again in a minute.',
          retryAfter: 60
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, preferredProvider, taskType: userTaskType, maxTokens, temperature } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long. Maximum length is 2000 characters.' },
        { status: 400 }
      );
    }

    // Detect task type if not provided
    const detectedTaskType = userTaskType || detectTaskType(message);
    
    // Build enhanced context
    const context = buildEnhancedContext(message, detectedTaskType);

    // Create LLM request
    const llmRequest: LLMRequest = {
      message,
      context,
      preferredProvider,
      taskType: detectedTaskType,
      maxTokens: maxTokens || 1000,
      temperature: temperature || 0.7
    };

    // Generate response using LLM aggregator
    const llmResponse = await llmAggregator.generateResponse(llmRequest);

    // Log request for analytics
    requestLog.push({
      timestamp: Date.now(),
      ip,
      message: message.substring(0, 100), // First 100 chars for privacy
      provider: llmResponse.provider,
      responseTime: llmResponse.responseTime,
      tokensUsed: llmResponse.tokensUsed
    });

    // Keep only last 1000 logs
    if (requestLog.length > 1000) {
      requestLog.splice(0, requestLog.length - 1000);
    }

    const totalResponseTime = Date.now() - startTime;

    return NextResponse.json({
      response: llmResponse.response,
      metadata: {
        provider: llmResponse.provider,
        model: llmResponse.model,
        taskType: detectedTaskType,
        tokensUsed: llmResponse.tokensUsed,
        responseTime: totalResponseTime,
        confidence: llmResponse.confidence,
        safetyScore: llmResponse.safetyScore,
        availableProviders: llmAggregator.getAvailableProviders(),
        capabilities: llmAggregator.getProviderCapabilities(llmResponse.provider)
      }
    });

  } catch (error) {
    console.error('Error in enhanced-assistant:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Content safety violation')) {
        return NextResponse.json(
          { 
            error: 'I cannot help with that request as it violates content safety guidelines.',
            safetyViolation: true
          },
          { status: 400 }
        );
      }
      
      if (error.message.includes('Rate limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { 
            error: 'AI service is temporarily unavailable due to high demand. Please try again later.',
            serviceUnavailable: true
          },
          { status: 503 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'I encountered an error while processing your request. Please try again.',
        fallbackAvailable: true
      },
      { status: 500 }
    );
  }
}

// GET endpoint for analytics and status
export async function GET() {
  try {
    const availableProviders = llmAggregator.getAvailableProviders();
    
    // Calculate analytics from recent logs
    const recentLogs = requestLog.filter(log => Date.now() - log.timestamp < 3600000); // Last hour
    const avgResponseTime = recentLogs.length > 0 
      ? recentLogs.reduce((sum, log) => sum + log.responseTime, 0) / recentLogs.length 
      : 0;
    
    const providerUsage = recentLogs.reduce((acc, log) => {
      acc[log.provider] = (acc[log.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      status: 'operational',
      availableProviders,
      analytics: {
        requestsLastHour: recentLogs.length,
        averageResponseTime: Math.round(avgResponseTime),
        providerUsage,
        totalRequests: requestLog.length
      },
      capabilities: {
        taskTypes: ['general', 'code', 'creative', 'analysis', 'math', 'research'],
        features: [
          'Multi-LLM routing',
          'Content safety filtering',
          'Intelligent task detection',
          'Fallback providers',
          'Real-time analytics'
        ],
        safetyFeatures: [
          'Content filtering',
          'Response sanitization',
          'Rate limiting',
          'Request logging'
        ]
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get service status' },
      { status: 500 }
    );
  }
}
