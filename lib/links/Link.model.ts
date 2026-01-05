export type LinkType = 'main' | 'social';

export type Link = {
    _id: string;
    title: string;
    description: string;
    url: string;
    isActive: boolean;
    order: number;
    type: LinkType;
    platform?: string;
    deleted: boolean;
};
