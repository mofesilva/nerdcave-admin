import { NextRequest, NextResponse } from 'next/server';
import * as LinksController from '@/lib/links/Link.controller';

// GET - Buscar todos os links
export async function GET() {
  try {
    const links = await LinksController.getAllLinks();
    return NextResponse.json({ success: true, links });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar links' },
      { status: 500 }
    );
  }
}

// POST - Criar novo link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.title || !body.url) {
      return NextResponse.json(
        { error: 'Título e URL são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar todos os links para determinar a ordem
    const allLinks = await LinksController.getAllLinks();
    const maxOrder = allLinks.length > 0
      ? Math.max(...allLinks.map((l) => l.order || 0))
      : 0;

    const newLink = await LinksController.createLink({
      data: {
        title: body.title,
        description: body.description || '',
        url: body.url,
        gradient: body.gradient || 'from-purple-500 to-pink-500',
        isActive: body.isActive !== undefined ? body.isActive : true,
        order: maxOrder + 1,
        clicks: 0,
        type: body.type || 'main',
      }
    });

    return NextResponse.json({ success: true, link: newLink }, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Erro ao criar link' },
      { status: 500 }
    );
  }
}
