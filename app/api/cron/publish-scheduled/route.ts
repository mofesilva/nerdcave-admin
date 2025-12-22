import { NextRequest, NextResponse } from 'next/server';
import { ArticlesController } from '@/lib/controllers/Articles.controller';

// Esta rota será chamada pelo Vercel Cron a cada 5 minutos
// para verificar e publicar posts agendados

export async function GET(request: NextRequest) {
    // Verificar se a requisição vem do Vercel Cron (em produção)
    // ou permitir em desenvolvimento
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Em produção, verificar o secret
    if (process.env.NODE_ENV === 'production' && cronSecret) {
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
    }

    try {
        const now = new Date();
        const publishedArticles = await ArticlesController.publishScheduledArticles(now);

        return NextResponse.json({
            success: true,
            message: `${publishedArticles.length} artigo(s) publicado(s)`,
            publishedAt: now.toISOString(),
            articles: publishedArticles.map(a => ({
                id: a._id,
                title: a.title,
                scheduledAt: a.scheduledAt,
            })),
        });
    } catch (error) {
        console.error('Erro ao publicar artigos agendados:', error);
        return NextResponse.json(
            { error: 'Erro interno ao processar artigos agendados' },
            { status: 500 }
        );
    }
}
