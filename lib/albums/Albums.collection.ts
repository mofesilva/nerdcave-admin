"use client"; import { createCollection } from "@/lib/cappuccino/client";
import type { Album } from "./Album.model";

export function getAlbumsCollection() {
    return createCollection<Album>("albums");
}
