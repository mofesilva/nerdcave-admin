/**
 * Tipos para conteúdo estruturado do Tiptap Editor.
 * 
 * O Tiptap usa ProseMirror internamente, e o JSON segue o formato de documento ProseMirror.
 * Isso permite armazenar rich text de forma estruturada e flexível.
 */

/** Marca aplicada a um texto (bold, italic, link, etc.) */
export type TiptapMark = {
    type: string;
    attrs?: Record<string, unknown>;
};

/** Nó do documento Tiptap (paragraph, heading, image, etc.) */
export type TiptapNode = {
    type: string;
    attrs?: Record<string, unknown>;
    content?: TiptapNode[];
    marks?: TiptapMark[];
    text?: string;
};

/** Documento JSON completo do Tiptap */
export type TiptapContent = {
    type: 'doc';
    content: TiptapNode[];
};

/** Tipo helper para conteúdo vazio */
export const EMPTY_TIPTAP_CONTENT: TiptapContent = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
};

/**
 * Verifica se um valor é um TiptapContent válido.
 * Útil para validação durante migração.
 */
export function isTiptapContent(value: unknown): value is TiptapContent {
    if (!value || typeof value !== 'object') return false;
    const doc = value as Record<string, unknown>;
    return doc.type === 'doc' && Array.isArray(doc.content);
}

/**
 * Extrai texto puro de um TiptapContent para cálculo de reading time, SEO, etc.
 */
export function extractTextFromTiptap(content: TiptapContent | null): string {
    if (!content || !content.content) return '';

    function extractFromNodes(nodes: TiptapNode[]): string {
        return nodes.map(node => {
            if (node.text) return node.text;
            if (node.content) return extractFromNodes(node.content);
            return '';
        }).join(' ');
    }

    return extractFromNodes(content.content).trim();
}

/**
 * Verifica se o conteúdo está vazio (apenas um parágrafo vazio ou sem conteúdo).
 */
export function isEmptyTiptapContent(content: TiptapContent | null): boolean {
    if (!content || !content.content || content.content.length === 0) return true;

    // Considera vazio se tem apenas um parágrafo sem conteúdo
    if (content.content.length === 1) {
        const firstNode = content.content[0];
        if (firstNode.type === 'paragraph' && (!firstNode.content || firstNode.content.length === 0)) {
            return true;
        }
    }

    return false;
}
