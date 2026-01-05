/**
 * Utilitários para manipulação de conteúdo de artigos
 */

/**
 * Extrai um excerpt (resumo) do conteúdo HTML de um artigo.
 * Remove tags HTML e retorna os primeiros N caracteres.
 * 
 * @param htmlContent - O conteúdo HTML do artigo
 * @param maxLength - Tamanho máximo do excerpt (padrão: 160 caracteres)
 * @returns O texto resumido
 */
export function extractExcerpt(htmlContent: string, maxLength: number = 160): string {
    if (!htmlContent) return "";

    // Primeiro converte entidades HTML para os caracteres reais
    let textContent = htmlContent
        .replace(/&lt;/g, "<") // Converte &lt;
        .replace(/&gt;/g, ">") // Converte &gt;
        .replace(/&amp;/g, "&") // Converte &amp;
        .replace(/&quot;/g, '"') // Converte &quot;
        .replace(/&#39;/g, "'") // Converte &#39;
        .replace(/&nbsp;/g, " "); // Remove &nbsp;

    // Agora remove todas as tags HTML
    textContent = textContent
        .replace(/<[^>]*>/g, " ") // Remove tags
        .replace(/\s+/g, " ") // Normaliza espaços
        .trim();

    if (textContent.length <= maxLength) {
        return textContent;
    }

    // Corta no último espaço antes do limite para não cortar palavras
    const truncated = textContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace > maxLength * 0.7) {
        return truncated.substring(0, lastSpace) + "...";
    }

    return truncated + "...";
}

/**
 * Calcula o tempo de leitura estimado baseado no conteúdo.
 * Usa uma média de 200 palavras por minuto.
 * 
 * @param htmlContent - O conteúdo HTML do artigo
 * @param wordsPerMinute - Velocidade de leitura (padrão: 200 wpm)
 * @returns Tempo de leitura em minutos (mínimo 1)
 */
export function calculateReadingTime(htmlContent: string, wordsPerMinute: number = 200): number {
    if (!htmlContent) return 1;

    // Remove tags HTML e conta palavras
    const textContent = htmlContent.replace(/<[^>]*>/g, " ").trim();
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, minutes);
}

/**
 * Gera um slug a partir do título.
 * 
 * @param title - O título do artigo
 * @returns Slug URL-friendly
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
        .replace(/\s+/g, "-") // Substitui espaços por hífens
        .replace(/-+/g, "-") // Remove hífens duplicados
        .replace(/^-|-$/g, ""); // Remove hífens no início e fim
}
