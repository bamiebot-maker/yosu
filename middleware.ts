import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'yosu-enterprise-super-secret-key-2026-fud-chapter'
);

// Routes requiring specific Super Admin role
const SUPER_ADMIN_ONLY_ROUTES = ['/admin/audit', '/admin/feature-flags'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow unauthenticated access to /admin/unauthorized itself if needed
  if (pathname === '/admin/unauthorized') {
    return NextResponse.next();
  }

  const token = request.cookies.get('yosu_session')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    const roleCodes = (payload.roleCodes as string[]) || [];

    // Check Super Admin route protection
    const requiresSuperAdmin = SUPER_ADMIN_ONLY_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (requiresSuperAdmin && !roleCodes.includes('SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }

    // Attach user context headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-user-roles', JSON.stringify(roleCodes));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    // Expired or invalid token
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('yosu_session', '', { maxAge: 0, path: '/' });
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
