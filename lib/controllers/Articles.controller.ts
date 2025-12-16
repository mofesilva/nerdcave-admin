import { getArticlesCollection } from '@/lib/collections/articles.collection';
import { ArticleModel } from '@/lib/models/Article.model';
import type { Article } from '@/types';

export class ArticlesController {
    private static collection = getArticlesCollection();

    static async getAll(): Promise<ArticleModel[]> {
        const result = await this.collection.find();
        if (result.error || !result.documents) return [];
        return result.documents.map(doc => ArticleModel.fromDocument(doc));
    }

    static async getPublished(): Promise<ArticleModel[]> {
        const all = await this.getAll();
        return all
            .filter(article => article.status === 'published')
            .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
    }

    static async getFeatured(): Promise<ArticleModel[]> {
        const all = await this.getAll();
        return all.filter(article => article.status === 'published' && article.isFeatured);
    }

    static async getById(id: string): Promise<ArticleModel | null> {
        const result = await this.collection.findById(id);
        if (result.error || !result.document) return null;
        return ArticleModel.fromDocument(result.document);
    }

    static async getBySlug(slug: string): Promise<ArticleModel | null> {
        const all = await this.getAll();
        return all.find(article => article.slug === slug) ?? null;
    }

    static async getByCategory(categoryId: string): Promise<ArticleModel[]> {
        const all = await this.getPublished();
        return all.filter(article => article.categoryId === categoryId);
    }

    static async getByTag(tagId: string): Promise<ArticleModel[]> {
        const all = await this.getPublished();
        return all.filter(article => article.tags.includes(tagId));
    }

    static async create(data: Omit<Article, '_id' | 'views'>): Promise<ArticleModel> {
        const slug = data.slug || ArticleModel.generateSlug(data.title);
        const readingTime = ArticleModel.calculateReadingTime(data.content);

        const newArticle = {
            ...data,
            slug,
            readingTime,
            views: 0,
        };

        const result = await this.collection.insertOne(newArticle as any);

        if (result.error || !result.document) {
            throw new Error(result.errorMsg || 'Failed to create article');
        }

        return ArticleModel.fromDocument(result.document);
    }

    static async update(id: string, updates: Partial<Article>): Promise<ArticleModel | null> {
        const updateData: Partial<Article> = {
            ...updates,
        };

        if (updates.content) {
            updateData.readingTime = ArticleModel.calculateReadingTime(updates.content);
        }

        if (updates.title && !updates.slug) {
            updateData.slug = ArticleModel.generateSlug(updates.title);
        }

        const result = await this.collection.updateOne(id, updateData as any);
        if (result.error) return null;
        return this.getById(id);
    }

    static async publish(id: string): Promise<ArticleModel | null> {
        return this.update(id, {
            status: 'published',
            publishedAt: new Date(),
        });
    }

    static async unpublish(id: string): Promise<ArticleModel | null> {
        return this.update(id, {
            status: 'draft',
            publishedAt: undefined,
        });
    }

    static async delete(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne(id);
        return !result.error;
    }

    static async incrementViews(id: string): Promise<boolean> {
        const article = await this.getById(id);
        if (!article) return false;

        const result = await this.collection.updateOne(id, {
            views: article.views + 1,
        } as any);

        return !result.error;
    }
}
