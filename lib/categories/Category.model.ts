export type CategoryType = 'article' | 'album' | 'both';

export type Category = {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    type: CategoryType;
    color?: string;
    icon?: string;
    parentId?: string;
    order: number;
    deleted: boolean;
};
