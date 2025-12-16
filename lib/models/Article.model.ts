import { Article } from '@/types';

export class ArticleModel {
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

    constructor(data: Article) {
        this._id = data._id;
        this.title = data.title;
        this.slug = data.slug;
        this.excerpt = data.excerpt;
        this.content = data.content;
        this.coverImage = data.coverImage;
        this.categoryId = data.categoryId;
        this.tags = data.tags;
        this.authorId = data.authorId;
        this.status = data.status;
        this.publishedAt = data.publishedAt;
        this.scheduledAt = data.scheduledAt;
        this.views = data.views;
        this.readingTime = data.readingTime;
        this.isFeatured = data.isFeatured;
        this.seoTitle = data.seoTitle;
        this.seoDescription = data.seoDescription;
    }

    static fromDocument(doc: any): ArticleModel {
        return new ArticleModel({
            _id: doc._id as string,
            title: doc.title as string,
            slug: doc.slug as string,
            excerpt: doc.excerpt as string,
            content: doc.content as string,
            coverImage: doc.coverImage as string | undefined,
            categoryId: doc.categoryId as string,
            tags: (doc.tags as string[]) ?? [],
            authorId: doc.authorId as string,
            status: (doc.status as 'draft' | 'published' | 'scheduled') ?? 'draft',
            publishedAt: doc.publishedAt ? new Date(doc.publishedAt as string) : undefined,
            scheduledAt: doc.scheduledAt ? new Date(doc.scheduledAt as string) : undefined,
            views: (doc.views as number) ?? 0,
            readingTime: (doc.readingTime as number) ?? 0,
            isFeatured: (doc.isFeatured as boolean) ?? false,
            seoTitle: doc.seoTitle as string | undefined,
            seoDescription: doc.seoDescription as string | undefined,
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

    static calculateReadingTime(content: string): number {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    toJSON(): Article {
        return {
            _id: this._id,
            title: this.title,
            slug: this.slug,
            excerpt: this.excerpt,
            content: this.content,
            coverImage: this.coverImage,
            categoryId: this.categoryId,
            tags: this.tags,
            authorId: this.authorId,
            status: this.status,
            publishedAt: this.publishedAt,
            scheduledAt: this.scheduledAt,
            views: this.views,
            readingTime: this.readingTime,
            isFeatured: this.isFeatured,
            seoTitle: this.seoTitle,
            seoDescription: this.seoDescription,
        };
    }
}
