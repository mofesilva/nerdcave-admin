import { Collection } from "@cappuccino/web-sdk";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { Album } from "@/types";

export function getAlbumsCollection() {
    const client = getCappuccinoClient();
    return new Collection<Album>({
        apiClient: client.apiClient,
        name: "albums"
    });
}
