"use client";

import { useMemo } from 'react';
import { TiptapContent, isEmptyTiptapContent } from '@/types/TiptapContent.types';
import { tiptapToHtml } from '@/lib/utils/tiptap.utils';

interface TiptapRendererProps {
    /** Conteúdo estruturado JSON do Tiptap */
    content: TiptapContent | null;
    /** Classes CSS adicionais para o container */
    className?: string;
    /** Mensagem quando o conteúdo está vazio */
    emptyMessage?: string;
}

/**
 * Componente para renderizar conteúdo Tiptap JSON como HTML.
 * 
 * Uso:
 * ```tsx
 * <TiptapRenderer content={article.content} className="prose" />
 * ```
 */
export default function TiptapRenderer({
    content,
    className = '',
    emptyMessage = 'Sem conteúdo'
}: TiptapRendererProps) {
    // Memoriza a conversão para evitar recálculos
    const htmlContent = useMemo(() => {
        if (!content || isEmptyTiptapContent(content)) {
            return null;
        }
        return tiptapToHtml(content);
    }, [content]);

    if (!htmlContent) {
        return (
            <div className={`text-muted-foreground italic ${className}`}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div
            className={`prose prose-invert max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
