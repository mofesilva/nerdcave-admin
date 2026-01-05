"use client"; import { createCollection } from "@/lib/cappuccino/client";
import type { Analytic } from "./Analytic.model";


export function getAnalyticsCollection() {
    return createCollection<Analytic>("analytics");
}