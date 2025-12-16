import { getLinksCollection } from '@/lib/collections/links.collection';
import { LinkModel } from '@/lib/models/Link.model';
import type { Link } from '@/types';

export class LinksController {
    private static collection = getLinksCollection();

    static async getAll(): Promise<LinkModel[]> {
        const result = await this.collection.find();
        if (result.error || !result.documents) return [];
        return result.documents.map(doc => LinkModel.fromDocument(doc));
    }

    static async getById(id: string): Promise<LinkModel | null> {
        const result = await this.collection.findById(id);
        if (result.error || !result.document) return null;
        return LinkModel.fromDocument(result.document);
    }

    static async create(data: Omit<Link, '_id' | 'createdAt' | 'updatedAt'>): Promise<LinkModel> {
        const now = new Date();
        const newLink = { ...data, createdAt: now, updatedAt: now };

        const result = await this.collection.insertOne(newLink as any);

        if (result.error || !result.document) {
            console.error('Create link error:', result);
            throw new Error(result.errorMsg || 'Failed to create link');
        }

        return LinkModel.fromDocument(result.document);
    }

    static async update(id: string, updates: Partial<Link>): Promise<LinkModel | null> {
        const result = await this.collection.updateOne(id, {
            ...updates,
            updatedAt: new Date()
        } as any);

        if (result.error) return null;
        return this.getById(id);
    }

    static async delete(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne(id);
        return !result.error;
    }

    static async incrementClicks(id: string): Promise<boolean> {
        const link = await this.getById(id);
        if (!link) return false;

        const result = await this.collection.updateOne(id, {
            clicks: link.clicks + 1,
            updatedAt: new Date()
        } as any);

        return !result.error;
    }
}
