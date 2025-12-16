import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Limpar TODOS os cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    allCookies.forEach(cookie => {
      cookieStore.delete(cookie.name);
    });

    const response = NextResponse.json({ success: true });

    // Garantir que os cookies sejam deletados no response também
    allCookies.forEach(cookie => {
      response.cookies.delete(cookie.name);
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar logout' },
      { status: 500 }
    );
  }
}
