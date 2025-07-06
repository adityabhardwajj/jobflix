import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For now, redirect to a Google OAuth URL
    // In a real implementation, you would use NextAuth.js or a similar library
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID || 'your-client-id'}&` +
      `redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback')}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `access_type=offline&` +
      `prompt=consent`;

    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=oauth_failed', request.url));
  }
} 