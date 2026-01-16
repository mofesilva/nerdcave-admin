/**
 * API Route: POST /api/auth/login
 * 
 * Autentica o usuário e configura cookies httpOnly para tokens.
 */

import { NextRequest, NextResponse } from 'next/server';
import * as AuthService from '@/lib/auth/Auth.server.service';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const result = await AuthService.signIn({ email, password });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    const { token, refresh_token: refreshToken } = result.user;

    const response = NextResponse.json({
      success: true,
      redirect: '/admin/dashboard',
      user: result.user,
    });

    // Setar cookies httpOnly para tokens
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
    console.error('Login route error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar login' },
      { status: 500 }
    );
  }
}
