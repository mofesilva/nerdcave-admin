"use client";
import { createCollection } from '@/lib/cappuccino/client';
import type { Category } from './Category.model';

export function getCategoriesCollection() {
    return createCollection<Category>('categories');
}
