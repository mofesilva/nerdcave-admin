import { getCategoriesCollection } from '@/lib/collections/categories.collection';
import { CategoryModel } from '@/lib/models/Category.model';
import type { Category } from '@/types';

export class CategoriesController {
    private static collection = getCategoriesCollection();

    static async getAll(): Promise<CategoryModel[]> {
        const result = await this.collection.find();
        if (result.error || !result.documents) return [];
        return result.documents
            .map(doc => CategoryModel.fromDocument(doc))
            .sort((a, b) => a.order - b.order);
    }

    static async getByType(type: 'article' | 'album' | 'both'): Promise<CategoryModel[]> {
        const all = await this.getAll();
        return all.filter(cat => cat.type === type || cat.type === 'both');
    }

    static async getForArticles(): Promise<CategoryModel[]> {
        const all = await this.getAll();
        return all.filter(cat => cat.type === 'article' || cat.type === 'both');
    }

    static async getForAlbums(): Promise<CategoryModel[]> {
        const all = await this.getAll();
        return all.filter(cat => cat.type === 'album' || cat.type === 'both');
    }

    static async getById(id: string): Promise<CategoryModel | null> {
        const result = await this.collection.findById(id);
        if (result.error || !result.document) return null;
        return CategoryModel.fromDocument(result.document);
    }

    static async getBySlug(slug: string): Promise<CategoryModel | null> {
        const all = await this.getAll();
        return all.find(cat => cat.slug === slug) ?? null;
    }

    static async getChildren(parentId: string): Promise<CategoryModel[]> {
        const all = await this.getAll();
        return all.filter(cat => cat.parentId === parentId);
    }

    static async create(data: Omit<Category, '_id'>): Promise<CategoryModel> {
        const slug = data.slug || CategoryModel.generateSlug(data.name);

        const newCategory = {
            ...data,
            slug,
        };

        const result = await this.collection.insertOne(newCategory as any);

        if (result.error || !result.document) {
            throw new Error(result.errorMsg || 'Failed to create category');
        }

        return CategoryModel.fromDocument(result.document);
    }

    static async update(id: string, updates: Partial<Category>): Promise<CategoryModel | null> {
        const updateData: Partial<Category> = {
            ...updates,
        };

        if (updates.name && !updates.slug) {
            updateData.slug = CategoryModel.generateSlug(updates.name);
        }

        const result = await this.collection.updateOne(id, updateData as any);
        if (result.error) return null;
        return this.getById(id);
    }

    static async updateOrder(id: string, order: number): Promise<boolean> {
        const result = await this.collection.updateOne(id, {
            order,
        } as any);
        return !result.error;
    }

    static async reorder(categoryIds: string[]): Promise<boolean> {
        try {
            for (let i = 0; i < categoryIds.length; i++) {
                await this.updateOrder(categoryIds[i], i);
            }
            return true;
        } catch {
            return false;
        }
    }

    static async delete(id: string): Promise<boolean> {
        // Check for children first
        const children = await this.getChildren(id);
        if (children.length > 0) {
            throw new Error('Cannot delete category with subcategories');
        }

        const result = await this.collection.deleteOne(id);
        return !result.error;
    }
}
