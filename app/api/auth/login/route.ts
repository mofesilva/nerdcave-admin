import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/cappuccino/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const { authManager } = await getServerClient();

    // Fazer login usando o Cappuccino AuthManager
    const result = await authManager.signIn({
      login: email,
      password,
    });

    console.log('Login result:', JSON.stringify(result, null, 2));

    if (!result || result.error) {
      console.error('Login failed:', result?.errorMsg);
      return NextResponse.json(
        { error: result?.errorMsg || 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Pegar os tokens da resposta e setar manualmente nos cookies
    const token = result.document?.token;
    const refreshToken = result.document?.refresh_token;

    const response = NextResponse.json({
      success: true,
      redirect: '/admin/dashboard',
      user: result.document,
    });

    // Setar os cookies manualmente
    if (token) {
      response.cookies.set('cappuccino_access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15, // 15 minutos
      });
    }

    if (refreshToken) {
      response.cookies.set('cappuccino_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar login' },
      { status: 500 }
    );
  }
}
