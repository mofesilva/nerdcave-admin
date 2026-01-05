import * as CategoryService from './Category.service';
import type { Category, CategoryType } from './Category.model';

interface CategoryControllerProps {
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

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
    return CategoryService.getAllCategories();
}

export async function getCategoryById({ id }: CategoryControllerProps): Promise<Category | null> {
    return CategoryService.getCategoryById({ id });
}

export async function getCategoryBySlug({ slug }: CategoryControllerProps): Promise<Category | null> {
    return CategoryService.getCategoryBySlug({ slug });
}

export async function createCategory({ data }: CategoryControllerProps): Promise<Category> {
    return CategoryService.createCategory({ data });
}

export async function updateCategory({ id, updates }: CategoryControllerProps): Promise<Category | null> {
    return CategoryService.updateCategory({ id, updates });
}

export async function deleteCategory({ id }: CategoryControllerProps): Promise<boolean> {
    return CategoryService.deleteCategory({ id });
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getCategoriesByType({ type }: CategoryControllerProps): Promise<Category[]> {
    return CategoryService.getCategoriesByType({ type });
}

export async function getCategoriesForArticles(): Promise<Category[]> {
    return CategoryService.getCategoriesForArticles();
}

export async function getCategoriesForAlbums(): Promise<Category[]> {
    return CategoryService.getCategoriesForAlbums();
}

export async function getCategoriesByParent({ parentId }: CategoryControllerProps): Promise<Category[]> {
    return CategoryService.getCategoriesByParent({ parentId });
}

// ─── ORDER ───────────────────────────────────────────────────────────────────

export async function updateCategoryOrder({ id, order }: CategoryControllerProps): Promise<boolean> {
    return CategoryService.updateCategoryOrder({ id, order });
}

export async function reorderCategories({ categoryIds }: CategoryControllerProps): Promise<boolean> {
    return CategoryService.reorderCategories({ categoryIds });
}
