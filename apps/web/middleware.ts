import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/pages/profile', '/pages/example'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const sessionCookie = request.cookies.get('better-auth.session_token');

    if (!sessionCookie) {
      return NextResponse.next();
    }

    //FIXME: verify the session with your backend here
    // For now, just check if the cookie exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/pages/profile/:path*', '/pages/example/:path*']
};