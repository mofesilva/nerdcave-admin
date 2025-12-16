import { Album } from '@/types';

export class AlbumModel {
    _id: string;
    title: string;
    slug: string;
    description: string;
    coverMediaId?: string;
    mediaIds: string[];
    categoryId: string;
    tags: string[];
    status: 'draft' | 'published';
    views: number;
    isPublic: boolean;

    constructor(data: Album) {
        this._id = data._id;
        this.title = data.title;
        this.slug = data.slug;
        this.description = data.description;
        this.coverMediaId = data.coverMediaId;
        this.mediaIds = data.mediaIds;
        this.categoryId = data.categoryId;
        this.tags = data.tags;
        this.status = data.status;
        this.views = data.views;
        this.isPublic = data.isPublic;
    }

    get mediaCount(): number {
        return this.mediaIds.length;
    }

    static fromDocument(doc: any): AlbumModel {
        return new AlbumModel({
            _id: doc._id as string,
            title: doc.title as string,
            slug: doc.slug as string,
            description: (doc.description as string) ?? '',
            coverMediaId: doc.coverMediaId as string | undefined,
            mediaIds: (doc.mediaIds as string[]) ?? [],
            categoryId: doc.categoryId as string,
            tags: (doc.tags as string[]) ?? [],
            status: (doc.status as 'draft' | 'published') ?? 'draft',
            views: (doc.views as number) ?? 0,
            isPublic: (doc.isPublic as boolean) ?? true,
        });
    }

    static generateSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    toJSON(): Album {
        return {
            _id: this._id,
            title: this.title,
            slug: this.slug,
            description: this.description,
            coverMediaId: this.coverMediaId,
            mediaIds: this.mediaIds,
            categoryId: this.categoryId,
            tags: this.tags,
            status: this.status,
            views: this.views,
            isPublic: this.isPublic,
        };
    }
}
