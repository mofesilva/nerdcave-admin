export interface Link {
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
}
