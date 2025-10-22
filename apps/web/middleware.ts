import { NextRequest, NextResponse } from 'next/server';
import { authClientSession } from './lib/auth-client';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/pages/profile'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {

    // const { session } = useAuth(); FIXME: testar isso.
    const session = await authClientSession.getSession({
      fetchOptions: {
        headers: request.headers
      }
    });

    if (session?.data) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

}

export const config = {
  matcher: ['/pages/profile/:path*']
};