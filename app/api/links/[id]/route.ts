import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data/store';

// GET - Buscar um link específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const link = await dataStore.getLink(id);

    if (!link) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar link' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedLink = await dataStore.updateLink(id, body);

    if (!updatedLink) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, link: updatedLink });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar link' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await dataStore.deleteLink(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar link' },
      { status: 500 }
    );
  }
}
