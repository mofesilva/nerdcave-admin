import { Collection } from "@cappuccino/web-sdk";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { Media } from "@/types";

export function getMediaCollection() {
    const client = getCappuccinoClient();
    return new Collection<Media>({
        apiClient: client.apiClient,
        name: "media"
    });
}
