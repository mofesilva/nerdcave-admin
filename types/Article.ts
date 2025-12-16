export interface Article {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    categoryId: string;
    tags: string[];
    authorId: string;
    status: 'draft' | 'published' | 'scheduled';
    publishedAt?: Date;
    scheduledAt?: Date;
    views: number;
    readingTime: number;
    isFeatured: boolean;
    seoTitle?: string;
    seoDescription?: string;
}
