import { getTagsCollection } from '@/lib/collections/tags.collection';
import { TagModel } from '@/lib/models/Tag.model';
import type { Tag } from '@/types';

export class TagsController {
    private static collection = getTagsCollection();

    static async getAll(): Promise<TagModel[]> {
        const result = await this.collection.find();
        if (result.error || !result.documents) return [];
        return result.documents
            .map(doc => TagModel.fromDocument(doc))
            .sort((a, b) => b.usageCount - a.usageCount);
    }

    static async getPopular(limit: number = 10): Promise<TagModel[]> {
        const all = await this.getAll();
        return all.slice(0, limit);
    }

    static async getById(id: string): Promise<TagModel | null> {
        const result = await this.collection.findById(id);
        if (result.error || !result.document) return null;
        return TagModel.fromDocument(result.document);
    }

    static async getBySlug(slug: string): Promise<TagModel | null> {
        const all = await this.getAll();
        return all.find(tag => tag.slug === slug) ?? null;
    }

    static async getByName(name: string): Promise<TagModel | null> {
        const all = await this.getAll();
        return all.find(tag => tag.name === name) ?? null;
    }

    static async getOrCreate(name: string): Promise<TagModel> {
        const existing = await this.getByName(name);
        if (existing) return existing;
        return this.create({ name });
    }

    static async getOrCreateMany(names: string[]): Promise<TagModel[]> {
        const tags: TagModel[] = [];
        for (const name of names) {
            const tag = await this.getOrCreate(name);
            tags.push(tag);
        }
        return tags;
    }

    static async create(data: { name: string }): Promise<TagModel> {
        const slug = TagModel.generateSlug(data.name);

        const newTag = {
            name: data.name,
            slug,
            usageCount: 0,
        };

        const result = await this.collection.insertOne(newTag as any);

        if (result.error || !result.document) {
            throw new Error(result.errorMsg || 'Failed to create tag');
        }

        return TagModel.fromDocument(result.document);
    }

    static async update(id: string, updates: { name?: string }): Promise<TagModel | null> {
        const updateData: Partial<Tag> = {};

        if (updates.name) {
            updateData.name = updates.name;
            updateData.slug = TagModel.generateSlug(updates.name);
        }

        const result = await this.collection.updateOne(id, updateData as any);
        if (result.error) return null;
        return this.getById(id);
    }

    static async incrementUsage(id: string): Promise<boolean> {
        const tag = await this.getById(id);
        if (!tag) return false;

        const result = await this.collection.updateOne(id, {
            usageCount: tag.usageCount + 1,
        } as any);

        return !result.error;
    }

    static async decrementUsage(id: string): Promise<boolean> {
        const tag = await this.getById(id);
        if (!tag) return false;

        const result = await this.collection.updateOne(id, {
            usageCount: Math.max(0, tag.usageCount - 1),
        } as any);

        return !result.error;
    }

    static async delete(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne(id);
        return !result.error;
    }

    static async search(query: string): Promise<TagModel[]> {
        const all = await this.getAll();
        const lowerQuery = query.toLowerCase();
        return all.filter(tag => tag.name.toLowerCase().includes(lowerQuery));
    }
}
