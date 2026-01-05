"use client";
import { getArticlesCollection } from './Articles.collection';
import { Article } from './Article.model';
import { articleFromDocument } from './Article.mapper';

interface ArticleParametersProps {
    id?: string;
    slug?: string;
    categoryId?: string;
    tagId?: string;
    data?: Omit<Article, '_id' | 'deleted'>;
    updates?: Partial<Article>;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
    const articles = getArticlesCollection();
    const result = await articles.find({ query: { deleted: false } });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => articleFromDocument(doc));
}

export async function getArticleById({ id }: ArticleParametersProps): Promise<Article | null> {
    const articles = getArticlesCollection();
    const result = await articles.findById(id!);
    if (result.error || !result.document) return null;
    return articleFromDocument(result.document);
}

export async function getArticleBySlug({ slug }: ArticleParametersProps): Promise<Article | null> {
    const all = await getAllArticles();
    return all.find(article => article.slug === slug) ?? null;
}

export async function createArticle({ data }: ArticleParametersProps): Promise<Article> {
    const articles = getArticlesCollection();
    const slug = data?.slug || generateSlug(data?.title || '');
    const readingTime = calculateReadingTime(data?.content || '');

    const payload = {
        ...data,
        slug,
        readingTime,
        deleted: false,
    };

    const result = await articles.insertOne(payload);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create article');
    }
    return articleFromDocument(result.document);
}

export async function updateArticle({ id, updates }: ArticleParametersProps): Promise<Article | null> {
    if (!updates) return null;
    const articles = getArticlesCollection();

    const updateData: Partial<Article> = { ...updates };

    if (updates.content) {
        updateData.readingTime = calculateReadingTime(updates.content);
    }

    if (updates.title && !updates.slug) {
        updateData.slug = generateSlug(updates.title);
    }

    const result = await articles.updateOne(id!, updateData);
    if (result.error) return null;
    return getArticleById({ id });
}

export async function deleteArticle({ id }: ArticleParametersProps): Promise<boolean> {
    const articles = getArticlesCollection();
    const result = await articles.updateOne(id!, { deleted: true });
    return !result.error;
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getPublishedArticles(): Promise<Article[]> {
    const all = await getAllArticles();
    return all
        .filter(article => article.status === 'published')
        .sort((a, b) => {
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            return dateB - dateA;
        });
}

export async function getFeaturedArticles(): Promise<Article[]> {
    const all = await getAllArticles();
    return all.filter(article => article.status === 'published' && article.isFeatured);
}

export async function getArticlesByCategory({ categoryId }: ArticleParametersProps): Promise<Article[]> {
    const published = await getPublishedArticles();
    return published.filter(article => article.category === categoryId);
}

export async function getArticlesByTag({ tagId }: ArticleParametersProps): Promise<Article[]> {
    const published = await getPublishedArticles();
    return published.filter(article => article.tags.includes(tagId!));
}

// ─── STATUS ──────────────────────────────────────────────────────────────────

export async function publishArticle({ id }: ArticleParametersProps): Promise<Article | null> {
    return updateArticle({
        id,
        updates: {
            status: 'published',
            publishedAt: new Date().toISOString(),
        },
    });
}

export async function unpublishArticle({ id }: ArticleParametersProps): Promise<Article | null> {
    return updateArticle({
        id,
        updates: {
            status: 'draft',
            publishedAt: undefined,
        },
    });
}

export async function toggleFeatured({ id }: ArticleParametersProps): Promise<Article | null> {
    const article = await getArticleById({ id });
    if (!article) return null;
    return updateArticle({
        id,
        updates: { isFeatured: !article.isFeatured },
    });
}

// ─── SCHEDULING ──────────────────────────────────────────────────────────────

export async function getScheduledToPublish(now: Date): Promise<Article[]> {
    const all = await getAllArticles();
    return all.filter(article => {
        if (article.status !== 'scheduled' || !article.scheduledAt) return false;
        const scheduledDate = new Date(article.scheduledAt);
        return scheduledDate <= now;
    });
}

export async function publishScheduledArticles(now: Date): Promise<Article[]> {
    const toPublish = await getScheduledToPublish(now);
    const published: Article[] = [];

    for (const article of toPublish) {
        const result = await updateArticle({
            id: article._id,
            updates: {
                status: 'published',
                publishedAt: new Date().toISOString(),
                scheduledAt: undefined,
            },
        });
        if (result) published.push(result);
    }

    return published;
}
