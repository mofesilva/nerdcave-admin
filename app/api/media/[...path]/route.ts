/**
 * API Route: GET /api/media/[...path]
 * 
 * Proxy para servir arquivos de mídia do Cappuccino com cache otimizado.
 * Permite que o Next.js Image otimize imagens passando pelo nosso domínio.
 */

import { NextRequest, NextResponse } from 'next/server';

function getMediaConfig() {
    const baseUrl = process.env.NEXT_PUBLIC_CAPPUCCINO_API_URL?.trim()?.replace(/\/$/, '') || '';
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'nerdcave-link-tree';

    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_CAPPUCCINO_API_URL is missing');
    }

    return { baseUrl, appName };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { baseUrl, appName } = getMediaConfig();
        const { path } = await params;
        const fileName = path.join('/');
        const imageUrl = `${baseUrl}/mediastorage/${appName}/${fileName}`;

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
