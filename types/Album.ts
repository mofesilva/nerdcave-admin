export interface Album {
    _id: string;
    title: string;
    slug: string;
    description: string;
    coverMediaId?: string;  // ID do Media que é a capa
    mediaIds: string[];     // IDs dos Media neste álbum (ordem)
    categoryId: string;
    tags: string[];
    status: 'draft' | 'published';
    views: number;
    isPublic: boolean;
}
