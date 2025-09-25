import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This would trigger the backend news ingestion service
    const response = await fetch('http://localhost:8000/api/v1/blog/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sources: ['newsapi', 'devto', 'hackernews'],
        max_articles: 50
      })
    });

    if (!response.ok) {
      throw new Error('Failed to trigger news ingestion');
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'News ingestion triggered successfully',
      data
    });

  } catch (error) {
    console.error('Error triggering news ingestion:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'News ingestion endpoint',
    usage: 'POST to trigger news ingestion from external sources'
  });
}
