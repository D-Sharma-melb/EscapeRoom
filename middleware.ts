import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from '@/lib/logger';

export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const { method, url, nextUrl } = request;

  // Log the incoming request
  logger.http(`→ ${method} ${nextUrl.pathname}`, {
    method,
    path: nextUrl.pathname,
    query: Object.fromEntries(nextUrl.searchParams),
    userAgent: request.headers.get('user-agent') || 'unknown',
  });

  // Continue with the request
  const response = NextResponse.next();

  // Log the response 
  const duration = Date.now() - start;
  logger.http(`← ${method} ${nextUrl.pathname} ${response.status} - ${duration}ms`, {
    method,
    path: nextUrl.pathname,
    status: response.status,
    duration,
  });

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
