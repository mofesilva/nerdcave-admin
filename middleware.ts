import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rotas /admin (exceto /admin/login que não existe mais)
  if (pathname.startsWith('/admin')) {
    // Verificar se tem token de acesso nos cookies (com prefixo nerdcave)
    const accessToken = request.cookies.get('nerdcave_access');

    if (!accessToken) {
      // Redirecionar para login se não estiver autenticado
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
