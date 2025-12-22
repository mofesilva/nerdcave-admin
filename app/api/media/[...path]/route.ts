import { NextRequest, NextResponse } from 'next/server';

const CAPPUCCINO_BASE = 'https://cappuccino.devel.dzign-e.app';
const APP_NAME = 'nerdcave-link-tree';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const fileName = path.join('/');

    const imageUrl = `${CAPPUCCINO_BASE}/mediastorage/${APP_NAME}/${fileName}`;

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error('Media proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}
