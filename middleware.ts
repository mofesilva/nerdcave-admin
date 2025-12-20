import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware desabilitado - autenticação gerenciada pelo SDK no client
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
