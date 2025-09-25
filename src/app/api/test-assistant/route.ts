import { NextResponse } from 'next/server';

// Simple test assistant that works without API keys
export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Simulate AI response based on message content
    let response = '';
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('code') || lowerMessage.includes('program')) {
      response = `Here's a simple example for your coding question:

\`\`\`javascript
function example() {
  console.log("This is a demo response!");
  return "Your multi-LLM assistant is working!";
}
\`\`\`

Note: This is a demo response. Configure your OpenAI API key to get real AI responses from GPT-4, Claude, Gemini, and other LLMs.`;
    } else if (lowerMessage.includes('creative') || lowerMessage.includes('story')) {
      response = `Here's a creative response for you:

Once upon a time, in a world where AI assistants could access multiple language models, there was a platform called JobFlix that could intelligently route queries to the best available AI...

Note: This is a demo response. Configure your API keys to unlock the full creative power of Claude, GPT-4, and other creative AI models.`;
    } else if (lowerMessage.includes('analyze') || lowerMessage.includes('compare')) {
      response = `Analysis of your query:

**Pros:**
- Multi-LLM system provides diverse perspectives
- Intelligent routing ensures best model for each task
- Fallback systems ensure reliability

**Cons:**
- Requires API key configuration
- Multiple providers mean multiple costs

Note: This is a demo response. Configure Anthropic Claude API key for advanced analysis capabilities.`;
    } else {
      response = `Hello! I'm your multi-LLM AI assistant. I can help with:

🤖 **Coding** - Programming, debugging, code review
🎨 **Creative** - Writing, stories, content creation  
📊 **Analysis** - Data analysis, comparisons, insights
🧮 **Math** - Calculations, problem solving
🔍 **Research** - Explanations, facts, summaries

Currently running in demo mode. To unlock full capabilities:
1. Add OPENAI_API_KEY to your .env.local file
2. Optionally add ANTHROPIC_API_KEY, GOOGLE_API_KEY, etc.
3. Restart your development server

Your message: "${message}"`;
    }

    // Simulate metadata
    const metadata = {
      provider: 'demo-mode',
      model: 'test-assistant',
      taskType: 'general',
      tokensUsed: Math.floor(Math.random() * 100) + 50,
      responseTime: Math.floor(Math.random() * 1000) + 500,
      confidence: 0.85,
      safetyScore: 1.0,
      availableProviders: ['demo-mode'],
      capabilities: ['demo', 'test', 'configuration-helper']
    };

    return NextResponse.json({ 
      response,
      metadata
    });

  } catch (error) {
    console.error('Error in test-assistant:', error);
    return NextResponse.json(
      { error: 'Test assistant error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint for status
export async function GET() {
  return NextResponse.json({
    status: 'demo-mode',
    message: 'Test assistant is running. Configure API keys for full functionality.',
    setup: {
      required: 'OPENAI_API_KEY',
      optional: ['ANTHROPIC_API_KEY', 'GOOGLE_API_KEY', 'COHERE_API_KEY'],
      instructions: [
        '1. Create .env.local file in project root',
        '2. Add OPENAI_API_KEY=sk-your-key-here',
        '3. Restart development server',
        '4. Test enhanced assistant functionality'
      ]
    }
  });
}
