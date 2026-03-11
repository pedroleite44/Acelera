import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // 1. Se tentar acessar admin sem ser admin, volta pro login ou dashboard
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Se tentar acessar diario-bordo sem estar logado
  if (pathname.startsWith('/diario-bordo') && !userRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/diario-bordo/:path*'],
};
