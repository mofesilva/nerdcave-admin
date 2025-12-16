import { Collection } from "@cappuccino/web-sdk";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { Tag } from "@/types";

export function getTagsCollection() {
    const client = getCappuccinoClient();
    return new Collection<Tag>({
        apiClient: client.apiClient,
        name: "tags"
    });
}
