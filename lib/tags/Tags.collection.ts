"use client";
import { createCollection } from '@/lib/cappuccino/client';
import type { Tag } from './Tag.model';

export function getTagsCollection() {
    return createCollection<Tag>('tags');
}
