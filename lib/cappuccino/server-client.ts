"use client";
import {
    BrowserTokenStorage,
    type CappuccinoClient,
    createCappuccinoClient,
} from "@cappuccino/web-sdk";

let cachedClient: CappuccinoClient | null = null;

export function getCappuccinoClient(): CappuccinoClient {
    if (!cachedClient) {
        const baseUrl = process.env.NEXT_PUBLIC_CAPPUCCINO_API_URL;
        const apiKey = process.env.NEXT_PUBLIC_CAPPUCCINO_API_KEY;

        if (!baseUrl || !apiKey) {
            throw new Error('Missing NEXT_PUBLIC_CAPPUCCINO_API_URL or NEXT_PUBLIC_CAPPUCCINO_API_KEY');
        }

        cachedClient = createCappuccinoClient({
            baseUrl,
            apiKey,
            storage: new BrowserTokenStorage({ prefix: 'nerdcave' }),
        });
    }

    return cachedClient;
}
