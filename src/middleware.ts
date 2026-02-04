import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware de protección de rutas admin.
 * - /admin/login: accesible sin sesión; si hay sesión admin → redirige a /admin/dashboard
 * - /admin: redirige a /admin/dashboard
 * - /admin/* (resto): requieren sesión admin; si no hay → redirige a /admin/login
 */
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdmin = !!token && token.role === 'admin';

  if (path === '/admin/login') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (path === '/admin' || path === '/admin/') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (!isAdmin) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
