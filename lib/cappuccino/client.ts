"use client";
import {
    BrowserTokenStorage,
    Collection,
    type CappuccinoClient,
    createCappuccinoClient,
} from "@cappuccino/web-sdk";

// ============ CONFIGURAÇÃO ============

export const APP_NAME = "nerdcave-link-tree";

function getConfig() {
    const baseUrl = process.env.NEXT_PUBLIC_CAPPUCCINO_API_URL?.trim()?.replace(/\/$/, "") || "";
    const apiKey = process.env.NEXT_PUBLIC_CAPPUCCINO_API_KEY?.trim() || "";

    if (!baseUrl) throw new Error("NEXT_PUBLIC_CAPPUCCINO_API_URL is missing");
    if (!apiKey) throw new Error("NEXT_PUBLIC_CAPPUCCINO_API_KEY is missing");

    return { baseUrl, apiKey };
}

// ============ CLIENTE SINGLETON ============

let cachedClient: CappuccinoClient | null = null;

export function getCappuccinoClient(): CappuccinoClient {
    if (!cachedClient) {
        const { baseUrl, apiKey } = getConfig();
        cachedClient = createCappuccinoClient({
            baseUrl,
            apiKey,
            storage: new BrowserTokenStorage({ prefix: "nerdcave" }),
        });
    }
    return cachedClient;
}

// ============ COLLECTION FACTORY ============

export function createCollection<T>(collectionName: string): Collection<T> {
    const client = getCappuccinoClient();
    return new Collection<T>({
        apiClient: client.apiClient,
        name: collectionName,
    });
}

