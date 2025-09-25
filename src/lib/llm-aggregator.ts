/**
 * Multi-LLM Aggregation Service
 * Integrates multiple LLM providers for enhanced AI capabilities
 */

import OpenAI from 'openai';

// LLM Provider Types
export type LLMProvider = 
  | 'openai-gpt4' 
  | 'openai-gpt3.5' 
  | 'anthropic-claude' 
  | 'google-gemini' 
  | 'cohere-command' 
  | 'huggingface' 
  | 'replicate' 
  | 'together-ai'
  | 'groq'
  | 'perplexity';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
  maxTokens: number;
  temperature: number;
  specialties: string[];
  costPerToken: number;
  speed: 'fast' | 'medium' | 'slow';
  capabilities: string[];
}

export interface LLMRequest {
  message: string;
  context?: string;
  preferredProvider?: LLMProvider;
  taskType?: 'general' | 'code' | 'creative' | 'analysis' | 'math' | 'research';
  maxTokens?: number;
  temperature?: number;
}

export interface LLMResponse {
  response: string;
  provider: LLMProvider;
  model: string;
  tokensUsed: number;
  responseTime: number;
  confidence: number;
  safetyScore: number;
}

// LLM Configurations
const LLM_CONFIGS: Record<LLMProvider, LLMConfig> = {
  'openai-gpt4': {
    provider: 'openai-gpt4',
    model: 'gpt-4-turbo-preview',
    maxTokens: 4096,
    temperature: 0.7,
    specialties: ['general', 'reasoning', 'analysis', 'creative'],
    costPerToken: 0.00003,
    speed: 'medium',
    capabilities: ['text', 'reasoning', 'code', 'analysis']
  },
  'openai-gpt3.5': {
    provider: 'openai-gpt3.5',
    model: 'gpt-3.5-turbo',
    maxTokens: 4096,
    temperature: 0.7,
    specialties: ['general', 'fast-response', 'code'],
    costPerToken: 0.000002,
    speed: 'fast',
    capabilities: ['text', 'code', 'general']
  },
  'anthropic-claude': {
    provider: 'anthropic-claude',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4096,
    temperature: 0.7,
    specialties: ['analysis', 'reasoning', 'safety', 'research'],
    costPerToken: 0.000015,
    speed: 'medium',
    capabilities: ['text', 'analysis', 'reasoning', 'safety']
  },
  'google-gemini': {
    provider: 'google-gemini',
    model: 'gemini-pro',
    maxTokens: 2048,
    temperature: 0.7,
    specialties: ['general', 'multimodal', 'research'],
    costPerToken: 0.000001,
    speed: 'fast',
    capabilities: ['text', 'multimodal', 'reasoning']
  },
  'cohere-command': {
    provider: 'cohere-command',
    model: 'command-r-plus',
    maxTokens: 4096,
    temperature: 0.7,
    specialties: ['business', 'analysis', 'summarization'],
    costPerToken: 0.000003,
    speed: 'fast',
    capabilities: ['text', 'business', 'analysis']
  },
  'huggingface': {
    provider: 'huggingface',
    model: 'meta-llama/Llama-2-70b-chat-hf',
    maxTokens: 2048,
    temperature: 0.7,
    specialties: ['open-source', 'general', 'code'],
    costPerToken: 0.0000007,
    speed: 'medium',
    capabilities: ['text', 'code', 'open-source']
  },
  'replicate': {
    provider: 'replicate',
    model: 'meta/llama-2-70b-chat',
    maxTokens: 2048,
    temperature: 0.7,
    specialties: ['open-source', 'creative', 'general'],
    costPerToken: 0.00000065,
    speed: 'slow',
    capabilities: ['text', 'creative', 'general']
  },
  'together-ai': {
    provider: 'together-ai',
    model: 'togethercomputer/llama-2-70b-chat',
    maxTokens: 4096,
    temperature: 0.7,
    specialties: ['fast-inference', 'cost-effective', 'general'],
    costPerToken: 0.0000009,
    speed: 'fast',
    capabilities: ['text', 'fast-inference', 'cost-effective']
  },
  'groq': {
    provider: 'groq',
    model: 'llama2-70b-4096',
    maxTokens: 4096,
    temperature: 0.7,
    specialties: ['ultra-fast', 'real-time', 'general'],
    costPerToken: 0.0000007,
    speed: 'fast',
    capabilities: ['text', 'ultra-fast', 'real-time']
  },
  'perplexity': {
    provider: 'perplexity',
    model: 'llama-2-70b-chat',
    maxTokens: 2048,
    temperature: 0.7,
    specialties: ['research', 'web-search', 'factual'],
    costPerToken: 0.000001,
    speed: 'medium',
    capabilities: ['text', 'research', 'web-search', 'factual']
  }
};

// Content Safety Filter
class ContentSafetyFilter {
  private static readonly UNSAFE_PATTERNS = [
    /\b(hack|crack|pirate|illegal|drugs|violence|harm|suicide|bomb|weapon)\b/i,
    /\b(adult content|nsfw|explicit|sexual)\b/i,
    /\b(scam|fraud|money laundering|tax evasion)\b/i,
    /\b(hate speech|discrimination|racism|terrorism)\b/i
  ];

  private static readonly UNSAFE_TOPICS = [
    'illegal activities',
    'harmful content',
    'adult content',
    'violence',
    'self-harm',
    'hate speech',
    'fraud',
    'malware',
    'hacking',
    'drug manufacturing'
  ];

  static isContentSafe(content: string): { safe: boolean; reason?: string; score: number } {
    const lowerContent = content.toLowerCase();
    
    // Check for unsafe patterns
    for (const pattern of this.UNSAFE_PATTERNS) {
      if (pattern.test(content)) {
        return {
          safe: false,
          reason: 'Content contains potentially unsafe patterns',
          score: 0.1
        };
      }
    }

    // Check for unsafe topics
    for (const topic of this.UNSAFE_TOPICS) {
      if (lowerContent.includes(topic)) {
        return {
          safe: false,
          reason: `Content relates to unsafe topic: ${topic}`,
          score: 0.2
        };
      }
    }

    // Calculate safety score based on content analysis
    let safetyScore = 1.0;
    
    // Reduce score for potentially sensitive content
    if (lowerContent.includes('how to') && (
      lowerContent.includes('break') || 
      lowerContent.includes('bypass') ||
      lowerContent.includes('exploit')
    )) {
      safetyScore -= 0.3;
    }

    return {
      safe: safetyScore > 0.5,
      score: safetyScore
    };
  }

  static sanitizeResponse(response: string): string {
    // Remove potentially harmful instructions
    const sanitized = response
      .replace(/\b(here's how to hack|step-by-step guide to illegal|how to break into)\b/gi, '[CONTENT FILTERED]')
      .replace(/\b(download from illegal sites|pirate software|crack passwords)\b/gi, '[CONTENT FILTERED]');

    return sanitized;
  }
}

// Intelligent LLM Router
class LLMRouter {
  static selectBestProvider(request: LLMRequest): LLMProvider {
    const { taskType, preferredProvider } = request;

    // Use preferred provider if specified and valid
    if (preferredProvider && LLM_CONFIGS[preferredProvider]) {
      return preferredProvider;
    }

    // Route based on task type
    switch (taskType) {
      case 'code':
        return 'openai-gpt4'; // Best for code
      case 'creative':
        return 'anthropic-claude'; // Great for creative tasks
      case 'analysis':
        return 'anthropic-claude'; // Excellent analytical capabilities
      case 'math':
        return 'openai-gpt4'; // Strong mathematical reasoning
      case 'research':
        return 'perplexity'; // Has web search capabilities
      case 'general':
      default:
        return 'openai-gpt3.5'; // Fast and cost-effective for general queries
    }
  }

  static getFallbackProviders(primary: LLMProvider): LLMProvider[] {
    const fallbacks: Record<LLMProvider, LLMProvider[]> = {
      'openai-gpt4': ['openai-gpt3.5', 'anthropic-claude', 'google-gemini'],
      'openai-gpt3.5': ['google-gemini', 'cohere-command', 'groq'],
      'anthropic-claude': ['openai-gpt4', 'google-gemini', 'cohere-command'],
      'google-gemini': ['openai-gpt3.5', 'cohere-command', 'groq'],
      'cohere-command': ['google-gemini', 'openai-gpt3.5', 'together-ai'],
      'huggingface': ['replicate', 'together-ai', 'groq'],
      'replicate': ['huggingface', 'together-ai', 'openai-gpt3.5'],
      'together-ai': ['groq', 'huggingface', 'google-gemini'],
      'groq': ['together-ai', 'google-gemini', 'openai-gpt3.5'],
      'perplexity': ['google-gemini', 'anthropic-claude', 'openai-gpt4']
    };

    return fallbacks[primary] || ['openai-gpt3.5', 'google-gemini'];
  }
}

// Main LLM Aggregator Class
export class LLMAggregator {
  private openai?: OpenAI;
  private anthropic?: any;
  private gemini?: any;
  private cohere?: any;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize other providers (when API keys are available)
    // Note: These would need their respective SDK installations
    /*
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    if (process.env.GOOGLE_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }

    if (process.env.COHERE_API_KEY) {
      this.cohere = new CohereClient({
        token: process.env.COHERE_API_KEY,
      });
    }
    */
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();

    // Safety check
    const safetyCheck = ContentSafetyFilter.isContentSafe(request.message);
    if (!safetyCheck.safe) {
      throw new Error(`Content safety violation: ${safetyCheck.reason}`);
    }

    // Select best provider
    const selectedProvider = LLMRouter.selectBestProvider(request);
    const config = LLM_CONFIGS[selectedProvider];

    try {
      const response = await this.callProvider(selectedProvider, request, config);
      const responseTime = Date.now() - startTime;

      // Sanitize response
      const sanitizedResponse = ContentSafetyFilter.sanitizeResponse(response);
      const responseSafety = ContentSafetyFilter.isContentSafe(sanitizedResponse);

      return {
        response: sanitizedResponse,
        provider: selectedProvider,
        model: config.model,
        tokensUsed: this.estimateTokens(request.message + sanitizedResponse),
        responseTime,
        confidence: 0.9, // Would be calculated based on provider response
        safetyScore: responseSafety.score
      };

    } catch (error) {
      // Try fallback providers
      const fallbacks = LLMRouter.getFallbackProviders(selectedProvider);
      
      for (const fallbackProvider of fallbacks) {
        try {
          const fallbackConfig = LLM_CONFIGS[fallbackProvider];
          const response = await this.callProvider(fallbackProvider, request, fallbackConfig);
          const responseTime = Date.now() - startTime;

          const sanitizedResponse = ContentSafetyFilter.sanitizeResponse(response);
          const responseSafety = ContentSafetyFilter.isContentSafe(sanitizedResponse);

          return {
            response: sanitizedResponse,
            provider: fallbackProvider,
            model: fallbackConfig.model,
            tokensUsed: this.estimateTokens(request.message + sanitizedResponse),
            responseTime,
            confidence: 0.8, // Lower confidence for fallback
            safetyScore: responseSafety.score
          };
        } catch (fallbackError) {
          console.warn(`Fallback provider ${fallbackProvider} failed:`, fallbackError);
          continue;
        }
      }

      throw new Error(`All providers failed. Last error: ${error}`);
    }
  }

  private async callProvider(provider: LLMProvider, request: LLMRequest, config: LLMConfig): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(request.taskType);
    const maxTokens = request.maxTokens || config.maxTokens;
    const temperature = request.temperature || config.temperature;

    switch (provider) {
      case 'openai-gpt4':
      case 'openai-gpt3.5':
        if (!this.openai) throw new Error('OpenAI not initialized');
        
        const completion = await this.openai.chat.completions.create({
          model: config.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: request.message }
          ],
          max_tokens: maxTokens,
          temperature: temperature,
        });

        return completion.choices[0]?.message?.content || 'No response generated';

      case 'anthropic-claude':
        // Placeholder for Anthropic API call
        if (!this.anthropic) {
          // Fallback to OpenAI if Anthropic not available
          return this.callProvider('openai-gpt3.5', request, LLM_CONFIGS['openai-gpt3.5']);
        }
        // Would implement Anthropic API call here
        break;

      case 'google-gemini':
        // Placeholder for Google Gemini API call
        if (!this.gemini) {
          return this.callProvider('openai-gpt3.5', request, LLM_CONFIGS['openai-gpt3.5']);
        }
        // Would implement Gemini API call here
        break;

      case 'cohere-command':
        // Placeholder for Cohere API call
        if (!this.cohere) {
          return this.callProvider('openai-gpt3.5', request, LLM_CONFIGS['openai-gpt3.5']);
        }
        // Would implement Cohere API call here
        break;

      default:
        // For other providers, fallback to OpenAI for now
        return this.callProvider('openai-gpt3.5', request, LLM_CONFIGS['openai-gpt3.5']);
    }

    throw new Error(`Provider ${provider} not implemented`);
  }

  private buildSystemPrompt(taskType?: string): string {
    const basePrompt = `You are an advanced AI assistant integrated into JobFlix, a comprehensive career platform. You have access to multiple AI models and can help with a wide variety of tasks including career advice, technical questions, creative projects, analysis, and general inquiries.

Key guidelines:
- Provide helpful, accurate, and detailed responses
- Maintain a professional yet friendly tone
- Refuse to help with illegal, harmful, or unethical requests
- If you're unsure about something, acknowledge the uncertainty
- For career-related questions, leverage JobFlix's focus on tech careers
- Keep responses informative but concise unless detailed explanation is needed`;

    const taskSpecificPrompts = {
      code: "Focus on providing clean, well-commented code with explanations. Include best practices and security considerations.",
      creative: "Embrace creativity while maintaining quality. Provide original, engaging content that meets the user's creative needs.",
      analysis: "Provide thorough, structured analysis with clear reasoning. Break down complex topics into understandable components.",
      math: "Show step-by-step mathematical reasoning. Verify calculations and explain the methodology used.",
      research: "Provide well-researched, factual information with context. Acknowledge sources when possible and highlight key findings.",
      general: "Provide comprehensive yet accessible answers. Adapt your communication style to match the complexity of the question."
    };

    const taskPrompt = taskSpecificPrompts[taskType as keyof typeof taskSpecificPrompts] || taskSpecificPrompts.general;

    return `${basePrompt}\n\nTask-specific guidance: ${taskPrompt}`;
  }

  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  // Utility methods
  getAvailableProviders(): LLMProvider[] {
    const available: LLMProvider[] = [];
    
    if (process.env.OPENAI_API_KEY) {
      available.push('openai-gpt4', 'openai-gpt3.5');
    }
    if (process.env.ANTHROPIC_API_KEY) {
      available.push('anthropic-claude');
    }
    if (process.env.GOOGLE_API_KEY) {
      available.push('google-gemini');
    }
    if (process.env.COHERE_API_KEY) {
      available.push('cohere-command');
    }
    
    // Always available (free/open-source options)
    available.push('huggingface', 'together-ai', 'groq');
    
    return available;
  }

  getProviderCapabilities(provider: LLMProvider): string[] {
    return LLM_CONFIGS[provider]?.capabilities || [];
  }

  estimateCost(provider: LLMProvider, tokens: number): number {
    const config = LLM_CONFIGS[provider];
    return config ? config.costPerToken * tokens : 0;
  }
}

// Export singleton instance
export const llmAggregator = new LLMAggregator();
