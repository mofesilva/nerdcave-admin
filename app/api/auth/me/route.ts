import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/cappuccino/server-client';

export async function GET(request: NextRequest) {
  try {
    const { apiClient } = getServerClient();

    // Buscar o usuário atual usando o token dos cookies
    const result = await apiClient.get('/dbauth/me');

    if (!result || result.error) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.document,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}
