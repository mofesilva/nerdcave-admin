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
            return new NextResponse(null, { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // Stream direto sem carregar em memória
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Cross-Origin-Resource-Policy': 'cross-origin',
            },
        });
    } catch (error) {
        console.error('Media proxy error:', error);
        return new NextResponse(null, { status: 500 });
    }
}
