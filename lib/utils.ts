import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ============================================
// Case Conversion Utilities
// ============================================

/**
 * Converte string de camelCase para snake_case
 * Ex: "createdAt" → "created_at"
 */
export function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converte string de snake_case para camelCase
 * Ex: "created_at" → "createdAt"
 * Preserva keys que começam com underscore (como _id)
 */
export function toCamelCase(str: string): string {
    // Preservar keys que começam com _ (como _id)
    if (str.startsWith('_')) {
        return str;
    }
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converte todas as chaves de um objeto de camelCase para snake_case
 * Útil ao SALVAR no banco de dados
 */
export function toSnakeCaseKeys<T extends Record<string, unknown>>(
    obj: T
): Record<string, unknown> {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            typeof item === "object" && item !== null
                ? toSnakeCaseKeys(item as Record<string, unknown>)
                : item
        ) as unknown as Record<string, unknown>;
    }

    return Object.keys(obj).reduce(
        (acc, key) => {
            // Preservar keys que começam com _ (como _id)
            const snakeKey = key.startsWith('_') ? key : toSnakeCase(key);
            const value = obj[key];

            acc[snakeKey] =
                typeof value === "object" && value !== null
                    ? toSnakeCaseKeys(value as Record<string, unknown>)
                    : value;

            return acc;
        },
        {} as Record<string, unknown>
    );
}

/**
 * Converte todas as chaves de um objeto de snake_case para camelCase
 * Útil ao LER do banco de dados
 */
export function toCamelCaseKeys<T extends Record<string, unknown>>(
    obj: T
): Record<string, unknown> {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            typeof item === "object" && item !== null
                ? toCamelCaseKeys(item as Record<string, unknown>)
                : item
        ) as unknown as Record<string, unknown>;
    }

    return Object.keys(obj).reduce(
        (acc, key) => {
            const camelKey = toCamelCase(key);
            const value = obj[key];

            acc[camelKey] =
                typeof value === "object" && value !== null
                    ? toCamelCaseKeys(value as Record<string, unknown>)
                    : value;

            return acc;
        },
        {} as Record<string, unknown>
    );
}

// ============================================
// Text Utilities
// ============================================

/**
 * Extrai resumo de conteúdo removendo HTML e markdown
 */
export function getExcerpt(content: string, maxLength: number = 150): string {
    const plainText = content
        .replace(/#+\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\n+/g, ' ')
        .trim();

    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
}
