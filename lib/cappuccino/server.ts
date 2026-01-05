import { createCappuccinoServerClient } from "@cappuccino/web-sdk";
import { cookies } from "next/headers";

// ============ CONFIGURAÇÃO ============

function getConfig() {
    const baseUrl = process.env.NEXT_PUBLIC_CAPPUCCINO_API_URL?.trim()?.replace(/\/$/, "") || "";
    const apiKey = process.env.NEXT_PUBLIC_CAPPUCCINO_API_KEY?.trim() || "";

    if (!baseUrl) throw new Error("NEXT_PUBLIC_CAPPUCCINO_API_URL is missing");
    if (!apiKey) throw new Error("NEXT_PUBLIC_CAPPUCCINO_API_KEY is missing");

    return { baseUrl, apiKey };
}

// ============ SERVER CLIENT ============

/**
 * Cria um cliente Cappuccino para uso em Server Components/API Routes.
 * Usa cookies do Next.js para persistir tokens.
 */
export async function getServerClient() {
    const { baseUrl, apiKey } = getConfig();
    const cookieStore = await cookies();

    return createCappuccinoServerClient({
        baseUrl,
        apiKey,
        cookies: {
            get: (name: string) => cookieStore.get(name),
            set: (name: string, value: string, options?: Record<string, unknown>) => {
                try {
                    cookieStore.set(name, value, options);
                } catch {
                    // Server components não podem setar cookies
                }
            },
            delete: (name: string) => {
                try {
                    cookieStore.delete(name);
                } catch {
                    // Server components não podem deletar cookies
                }
            },
        },
    });
}