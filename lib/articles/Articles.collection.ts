"use client"; import { createCollection } from "@/lib/cappuccino/client";
import type { Article } from "@/types";

export function getArticlesCollection() {
    return createCollection<Article>("articles");
}
