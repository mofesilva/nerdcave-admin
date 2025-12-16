import { Category } from '@/types';

export class CategoryModel {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    type: 'article' | 'album' | 'both';
    color?: string;
    icon?: string;
    parentId?: string;
    order: number;

    constructor(data: Category) {
        this._id = data._id;
        this.name = data.name;
        this.slug = data.slug;
        this.description = data.description;
        this.type = data.type;
        this.color = data.color;
        this.icon = data.icon;
        this.parentId = data.parentId;
        this.order = data.order;
    }

    static fromDocument(doc: any): CategoryModel {
        return new CategoryModel({
            _id: doc._id as string,
            name: doc.name as string,
            slug: doc.slug as string,
            description: doc.description as string | undefined,
            type: (doc.type as 'article' | 'album' | 'both') ?? 'both',
            color: doc.color as string | undefined,
            icon: doc.icon as string | undefined,
            parentId: doc.parentId as string | undefined,
            order: (doc.order as number) ?? 0,
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

    get isSubcategory(): boolean {
        return !!this.parentId;
    }

    toJSON(): Category {
        return {
            _id: this._id,
            name: this.name,
            slug: this.slug,
            description: this.description,
            type: this.type,
            color: this.color,
            icon: this.icon,
            parentId: this.parentId,
            order: this.order,
        };
    }
}
