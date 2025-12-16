export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    type: 'article' | 'album' | 'both';
    color?: string;
    icon?: string;
    parentId?: string;
    order: number;
}
