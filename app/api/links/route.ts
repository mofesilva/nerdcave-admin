import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data/store';

// GET - Buscar todos os links
export async function GET() {
  try {
    const links = await dataStore.getLinks();
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
    const allLinks = await dataStore.getLinks();
    const maxOrder = allLinks.length > 0
      ? Math.max(...allLinks.map(l => l.order || 0))
      : 0;

    const newLink = await dataStore.createLink({
      title: body.title,
      description: body.description || '',
      url: body.url,
      gradient: body.gradient || 'from-purple-500 to-pink-500',
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: maxOrder + 1,
      clicks: 0,
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
