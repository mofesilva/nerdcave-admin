import { Link } from '@/types';

export class LinkModel {
    _id: string;
    title: string;
    description: string;
    url: string;
    isActive: boolean;
    order: number;
    clicks: number;
    gradient: string;
    type: 'main' | 'social';
    platform?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Link) {
        this._id = data._id;
        this.title = data.title;
        this.description = data.description;
        this.url = data.url;
        this.isActive = data.isActive;
        this.order = data.order;
        this.clicks = data.clicks;
        this.gradient = data.gradient;
        this.type = data.type;
        this.platform = data.platform;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static fromDocument(doc: any): LinkModel {
        return new LinkModel({
            _id: doc._id,
            title: doc.title,
            description: doc.description,
            url: doc.url,
            isActive: doc.isActive ?? true,
            order: doc.order ?? 0,
            clicks: doc.clicks ?? 0,
            gradient: doc.gradient,
            type: doc.type ?? 'main',
            platform: doc.platform,
            createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
            updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
        });
    }

    toJSON(): Link {
        return {
            _id: this._id,
            title: this.title,
            description: this.description,
            url: this.url,
            isActive: this.isActive,
            order: this.order,
            clicks: this.clicks,
            gradient: this.gradient,
            type: this.type,
            platform: this.platform,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
