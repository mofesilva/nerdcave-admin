/**
 * API Route: GET /api/auth/me
 * 
 * Retorna o usuário atual autenticado.
 */

import { NextResponse } from 'next/server';
import * as AuthService from '@/lib/auth/Auth.server.service';

export async function GET() {
  try {
    const result = await AuthService.getCurrentUser();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error('Get user route error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}
