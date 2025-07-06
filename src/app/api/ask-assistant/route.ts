import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple rate limiting
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

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

export async function POST(request: Request) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { message } = await request.json();

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message is too long. Maximum length is 500 characters.' },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Aditya, a helpful assistant for Jobflix. You provide clear, concise, and friendly responses about job searching, career advice, and the Jobflix platform. Keep your responses under 200 words and maintain a professional yet approachable tone."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in ask-assistant:', error);
    
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 