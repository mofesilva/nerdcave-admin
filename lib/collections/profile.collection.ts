import { Collection } from "@cappuccino/web-sdk";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { Profile } from "@/types";

export function getProfileCollection() {
    const client = getCappuccinoClient();
    return new Collection<Profile>({
        apiClient: client.apiClient,
        name: "profile"
    });
}
