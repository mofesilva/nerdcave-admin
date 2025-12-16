import { getMediaCollection } from '@/lib/collections/media.collection';
import { MediaModel } from '@/lib/models/Media.model';
import type { Media } from '@/types';

export class MediaController {
    private static collection = getMediaCollection();

    static async getAll(): Promise<MediaModel[]> {
        const result = await this.collection.find();
        if (result.error || !result.documents) return [];
        return result.documents.map(doc => MediaModel.fromDocument(doc));
    }

    static async getById(id: string): Promise<MediaModel | null> {
        const result = await this.collection.findById(id);
        if (result.error || !result.document) return null;
        return MediaModel.fromDocument(result.document);
    }

    static async getByIds(ids: string[]): Promise<MediaModel[]> {
        const all = await this.getAll();
        return all.filter(m => ids.includes(m._id));
    }

    static async create(data: Omit<Media, '_id'>): Promise<MediaModel> {
        const result = await this.collection.insertOne(data as any);

        if (result.error || !result.document) {
            throw new Error(result.errorMsg || 'Failed to create media');
        }

        return MediaModel.fromDocument(result.document);
    }

    static async update(id: string, updates: Partial<Media>): Promise<MediaModel | null> {
        const result = await this.collection.updateOne(id, updates as any);
        if (result.error) return null;
        return this.getById(id);
    }

    static async delete(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne(id);
        return !result.error;
    }

    static async search(query: string): Promise<MediaModel[]> {
        const all = await this.getAll();
        const q = query.toLowerCase();
        return all.filter(
            media =>
                media.title.toLowerCase().includes(q) ||
                media.fileName.toLowerCase().includes(q)
        );
    }
}
