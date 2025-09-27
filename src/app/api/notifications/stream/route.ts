import { NextRequest } from 'next/server';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = JSON.stringify({
        type: 'connected',
        message: 'Connected to notification stream',
        timestamp: new Date().toISOString(),
      });
      
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));

      // Keep connection alive with periodic pings
      const pingInterval = setInterval(() => {
        try {
          const ping = JSON.stringify({
            type: 'ping',
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${ping}\n\n`));
        } catch (error) {
          clearInterval(pingInterval);
        }
      }, 30000); // Ping every 30 seconds

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
