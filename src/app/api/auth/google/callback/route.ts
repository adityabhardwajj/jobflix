import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      return NextResponse.redirect(new URL(`/auth/error?error=${encodeURIComponent(error)}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/auth/error?error=no_code', request.url));
    }

    // In a real implementation, you would:
    // 1. Exchange the authorization code for an access token
    // 2. Fetch user information from Google
    // 3. Create or update user in your database
    // 4. Set session/token
    // 5. Redirect to dashboard

    console.log('Google OAuth code received:', code);

    // For now, redirect to home page with success message
    return NextResponse.redirect(new URL('/?auth=success&method=google', request.url));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=callback_failed', request.url));
  }
} 