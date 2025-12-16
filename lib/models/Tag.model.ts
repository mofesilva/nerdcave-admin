import { Tag } from '@/types';

export class TagModel {
    _id: string;
    name: string;
    slug: string;
    usageCount: number;

    constructor(data: Tag) {
        this._id = data._id;
        this.name = data.name;
        this.slug = data.slug;
        this.usageCount = data.usageCount;
    }

    static fromDocument(doc: any): TagModel {
        return new TagModel({
            _id: doc._id as string,
            name: doc.name as string,
            slug: doc.slug as string,
            usageCount: (doc.usageCount as number) ?? 0,
        });
    }

    static generateSlug(name: string): string {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    toJSON(): Tag {
        return {
            _id: this._id,
            name: this.name,
            slug: this.slug,
            usageCount: this.usageCount,
        };
    }
}
