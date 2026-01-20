"use client";

import { getCategoriesCollection } from './Categories.collection';
import { categoryFromDocument } from './Category.mapper';
import type { Category, CategoryType } from './Category.model';

interface CategoryParametersProps {
    id?: string;
    slug?: string;
    name?: string;
    parentId?: string;
    type?: CategoryType;
    data?: Omit<Category, '_id' | 'deleted'>;
    updates?: Partial<Category>;
    order?: number;
    categoryIds?: string[];
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
    console.log("[DEBUG] getAllCategories chamado");
    const categories = getCategoriesCollection();
    console.log("[DEBUG] Collection criada:", categories);
    const result = await categories.find();
    console.log("[DEBUG] Resultado find:", result);
    if (result.error || !result.documents) return [];
    return result.documents
        .filter(doc => !doc.deleted)
        .map(doc => categoryFromDocument(doc))
        .sort((a, b) => a.order - b.order);
}

export async function getCategoryById({ id }: CategoryParametersProps): Promise<Category | null> {
    const categories = getCategoriesCollection();
    const result = await categories.findById(id!);
    if (result.error || !result.document) return null;
    return categoryFromDocument(result.document);
}

export async function getCategoryBySlug({ slug }: CategoryParametersProps): Promise<Category | null> {
    const categories = getCategoriesCollection();
    const result = await categories.findOne({ query: { slug, deleted: false } });
    if (result.error || !result.document) return null;
    return categoryFromDocument(result.document);
}

export async function createCategory({ data }: CategoryParametersProps): Promise<Category> {
    const categories = getCategoriesCollection();
    const payload = {
        ...data,
        slug: data!.slug || generateSlug(data!.name),
        order: data!.order ?? 0,
        deleted: false,
    };

    const result = await categories.insertOne(payload);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create category');
    }
    return categoryFromDocument(result.document);
}

export async function updateCategory({ id, updates }: CategoryParametersProps): Promise<Category | null> {
    if (!updates) return null;
    const categories = getCategoriesCollection();
    const payload = updates.name && !updates.slug
        ? { ...updates, slug: generateSlug(updates.name) }
        : updates;

    const result = await categories.updateOne(id!, payload);
    if (result.error) return null;
    return getCategoryById({ id });
}

export async function deleteCategory({ id }: CategoryParametersProps): Promise<boolean> {
    const children = await getCategoriesByParent({ parentId: id });
    if (children.length > 0) {
        throw new Error('Cannot delete category with subcategories');
    }

    const categories = getCategoriesCollection();
    const result = await categories.updateOne(id!, { deleted: true });
    return !result.error;
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getCategoriesByType({ type }: CategoryParametersProps): Promise<Category[]> {
    const all = await getAllCategories();
    return all.filter(cat => cat.type === type || cat.type === 'both');
}

export async function getCategoriesForArticles(): Promise<Category[]> {
    return getCategoriesByType({ type: 'article' });
}

export async function getCategoriesForAlbums(): Promise<Category[]> {
    return getCategoriesByType({ type: 'album' });
}

export async function getCategoriesByParent({ parentId }: CategoryParametersProps): Promise<Category[]> {
    const all = await getAllCategories();
    return all.filter(cat => cat.parentId === parentId);
}

// ─── ORDER ───────────────────────────────────────────────────────────────────

export async function updateCategoryOrder({ id, order }: CategoryParametersProps): Promise<boolean> {
    const categories = getCategoriesCollection();
    const result = await categories.updateOne(id!, { order });
    return !result.error;
}

export async function reorderCategories({ categoryIds }: CategoryParametersProps): Promise<boolean> {
    if (!categoryIds) return false;
    try {
        for (let i = 0; i < categoryIds.length; i++) {
            await updateCategoryOrder({ id: categoryIds[i], order: i });
        }
        return true;
    } catch {
        return false;
    }
}

// ─── COUNTS ──────────────────────────────────────────────────────────────────

export async function countCategories(): Promise<number> {
    const categories = getCategoriesCollection();
    const result = await categories.aggregate([
        { $match: { deleted: false } },
        { $count: 'total' }
    ]);
    return (result.documents?.[0] as { total?: number })?.total ?? 0;
}
