"use client";
import { createCollection } from '@/lib/cappuccino/client';
import type { Media } from './Media.model';

export function getMediasCollection() {
    return createCollection<Media>('medias');
}
