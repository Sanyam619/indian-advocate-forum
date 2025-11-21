import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  '/',
  '/home',
  '/landing',
  '/auth',
  '/news',
  '/judges',
  '/supreme-court',
  '/high-court',
  '/district-court',
  '/disclaimer',
  '/privacy',
  '/terms',
  '/search-advocates',
  '/podcasts',
  '/article',
  '/podcast',
  '/payment',
  '/video-conference',
  '/profile',  // Allow profile page
  '/profile-setup',  // Allow profile setup page
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/callback',
  '/api/auth/me',  
  '/api/auth/signup',
  '/api/public',
  '/_next',
  '/locales'
];

// Paths that should NOT redirect to home on refresh
const noRedirectPaths = [
  '/',
  '/home',
  '/landing',
  '/auth',
  '/judges',
  '/supreme-court',
  '/high-court',
  '/news',
  '/podcasts',
  '/article',
  '/api',
  '/_next',
  '/favicon.ico',
  '/locales'
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early return for static files and API routes to reduce processing
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/locales/') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  // Allow public paths without authentication
  if (publicPaths.some(path => pathname.startsWith(path))) {
    const response = NextResponse.next();
    // Add caching headers for public pages
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    return response;
  }
  
  // Allow all high court pages (25 high courts)
  if (pathname.startsWith('/high-court/')) {
    const response = NextResponse.next();
    // Add caching headers for high court pages
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    return response;
  }

  // For protected routes, check authentication
  if (!pathname.startsWith('/api/')) {
    const sessionCookie = request.cookies.get('appSession');
    if (!sessionCookie) {
      // Only redirect to auth if it's not already an auth route
      if (!pathname.startsWith('/auth')) {
        const authUrl = new URL('/auth', request.url);
        authUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(authUrl);
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
