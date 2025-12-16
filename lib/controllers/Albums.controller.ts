import { getAlbumsCollection } from '@/lib/collections/albums.collection';
import { AlbumModel } from '@/lib/models/Album.model';
import type { Album } from '@/types';

export class AlbumsController {
    private static collection = getAlbumsCollection();

    static async getAll(): Promise<AlbumModel[]> {
        const result = await this.collection.find();
        if (result.error || !result.documents) return [];
        return result.documents.map(doc => AlbumModel.fromDocument(doc));
    }

    static async getPublished(): Promise<AlbumModel[]> {
        const all = await this.getAll();
        return all.filter(album => album.status === 'published' && album.isPublic);
    }

    static async getById(id: string): Promise<AlbumModel | null> {
        const result = await this.collection.findById(id);
        if (result.error || !result.document) return null;
        return AlbumModel.fromDocument(result.document);
    }

    static async getBySlug(slug: string): Promise<AlbumModel | null> {
        const all = await this.getAll();
        return all.find(album => album.slug === slug) ?? null;
    }

    static async getByCategory(categoryId: string): Promise<AlbumModel[]> {
        const all = await this.getPublished();
        return all.filter(album => album.categoryId === categoryId);
    }

    static async create(data: Omit<Album, '_id' | 'views' | 'mediaIds'>): Promise<AlbumModel> {
        const slug = data.slug || AlbumModel.generateSlug(data.title);

        const newAlbum = {
            ...data,
            slug,
            views: 0,
            mediaIds: [],
        };

        const result = await this.collection.insertOne(newAlbum as any);

        if (result.error || !result.document) {
            throw new Error(result.errorMsg || 'Failed to create album');
        }

        return AlbumModel.fromDocument(result.document);
    }

    static async update(id: string, updates: Partial<Album>): Promise<AlbumModel | null> {
        const updateData: Partial<Album> = { ...updates };

        if (updates.title && !updates.slug) {
            updateData.slug = AlbumModel.generateSlug(updates.title);
        }

        const result = await this.collection.updateOne(id, updateData as any);
        if (result.error) return null;
        return this.getById(id);
    }

    static async addMedia(albumId: string, mediaId: string): Promise<AlbumModel | null> {
        const album = await this.getById(albumId);
        if (!album) return null;

        if (album.mediaIds.includes(mediaId)) return album;

        const newMediaIds = [...album.mediaIds, mediaId];
        return this.update(albumId, { mediaIds: newMediaIds });
    }

    static async removeMedia(albumId: string, mediaId: string): Promise<AlbumModel | null> {
        const album = await this.getById(albumId);
        if (!album) return null;

        const newMediaIds = album.mediaIds.filter(id => id !== mediaId);
        const updates: Partial<Album> = { mediaIds: newMediaIds };

        // Se era a capa, limpar
        if (album.coverMediaId === mediaId) {
            updates.coverMediaId = newMediaIds[0] || undefined;
        }

        return this.update(albumId, updates);
    }

    static async setCover(albumId: string, mediaId: string): Promise<AlbumModel | null> {
        return this.update(albumId, { coverMediaId: mediaId });
    }

    static async reorderMedia(albumId: string, mediaIds: string[]): Promise<AlbumModel | null> {
        return this.update(albumId, { mediaIds });
    }

    static async publish(id: string): Promise<AlbumModel | null> {
        return this.update(id, { status: 'published' });
    }

    static async unpublish(id: string): Promise<AlbumModel | null> {
        return this.update(id, { status: 'draft' });
    }

    static async delete(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne(id);
        return !result.error;
    }

    static async incrementViews(id: string): Promise<boolean> {
        const album = await this.getById(id);
        if (!album) return false;

        const result = await this.collection.updateOne(id, {
            views: album.views + 1,
        } as any);

        return !result.error;
    }
}
