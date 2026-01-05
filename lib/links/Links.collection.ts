"use client";
import { createCollection } from '@/lib/cappuccino/client';
import type { Link } from './Link.model';

export function getLinksCollection() {
    return createCollection<Link>('links');
}
