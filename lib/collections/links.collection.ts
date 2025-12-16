import { Collection } from "@cappuccino/web-sdk";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { Link } from "@/types";

export function getLinksCollection() {
    const client = getCappuccinoClient();
    return new Collection<Link>({
        apiClient: client.apiClient,
        name: "links"
    });
}
