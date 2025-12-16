import { Collection } from "@cappuccino/web-sdk";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { SocialLink } from "@/types";

export function getSocialLinksCollection() {
    const client = getCappuccinoClient();
    return new Collection<SocialLink>({
        apiClient: client.apiClient,
        name: "social_links"
    });
}
