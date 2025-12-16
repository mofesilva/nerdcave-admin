import { Collection } from "@cappuccino/web-sdk";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { Article } from "@/types";

export function getArticlesCollection() {
    const client = getCappuccinoClient();
    return new Collection<Article>({
        apiClient: client.apiClient,
        name: "articles"
    });
}
