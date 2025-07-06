import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Get the host from headers instead of request.url
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';

    if (error) {
      // Handle OAuth error
      return NextResponse.redirect(`${protocol}://${host}/auth/error?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return NextResponse.redirect(`${protocol}://${host}/auth/error?error=no_code`);
    }

    // In a real implementation, you would:
    // 1. Exchange the authorization code for an access token
    // 2. Fetch user information from Google
    // 3. Create or update user in your database
    // 4. Set session/token
    // 5. Redirect to dashboard

    console.log('Google OAuth code received:', code);

    // For now, redirect to home page with success message
    return NextResponse.redirect(`${protocol}://${host}/?auth=success&method=google`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    return NextResponse.redirect(`${protocol}://${host}/auth/error?error=callback_failed`);
  }
} 