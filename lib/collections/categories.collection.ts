import { Collection } from "@cappuccino/web-sdk";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { Category } from "@/types";

export function getCategoriesCollection() {
    const client = getCappuccinoClient();
    return new Collection<Category>({
        apiClient: client.apiClient,
        name: "categories"
    });
}
