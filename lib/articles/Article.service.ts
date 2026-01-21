"use client";
import { getArticlesCollection } from './Articles.collection';
import { Article, ArticleSummary } from './Article.model';
import { articleFromDocument, articleSummaryFromDocument } from './Article.mapper';
import { TiptapContent, extractTextFromTiptap } from '@/types/TiptapContent.types';

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

function calculateReadingTime(content: TiptapContent | null): number {
    const wordsPerMinute = 200;
    const text = extractTextFromTiptap(content);
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

    // Incrementar contagem de uso das tags
    if (data?.tags && data.tags.length > 0) {
        for (const tagId of data.tags) {
            await updateTagUsageCount(tagId, 1);
        }
    }

    return articleFromDocument(result.document);
}

export async function updateArticle({ id, updates }: ArticleParametersProps): Promise<Article | null> {
    if (!updates) return null;

    // Busca o artigo atual para comparar tags
    const currentArticle = await getArticleById({ id });
    if (!currentArticle) return null;

    const articles = getArticlesCollection();
    const updateData: Partial<Article> = { ...updates };

    if (updates.content) {
        updateData.readingTime = calculateReadingTime(updates.content);
    }

    if (updates.title && !updates.slug) {
        updateData.slug = generateSlug(updates.title);
    }

    // Atualizar contagem de tags se as tags mudaram
    if (updates.tags !== undefined) {
        const oldTags = currentArticle.tags || [];
        const newTags = updates.tags || [];

        // Tags removidas: decrementar
        const removedTags = oldTags.filter(tagId => !newTags.includes(tagId));
        for (const tagId of removedTags) {
            await updateTagUsageCount(tagId, -1);
        }

        // Tags adicionadas: incrementar
        const addedTags = newTags.filter(tagId => !oldTags.includes(tagId));
        for (const tagId of addedTags) {
            await updateTagUsageCount(tagId, 1);
        }
    }

    const result = await articles.updateOne(id!, updateData);
    if (result.error) return null;
    return getArticleById({ id });
}

async function updateTagUsageCount(tagId: string, delta: number): Promise<void> {
    const { getTagsCollection } = await import('../tags/Tags.collection');
    const { getTagById } = await import('../tags/Tag.service');

    const tag = await getTagById({ id: tagId });
    if (!tag) return;

    const newCount = Math.max(0, tag.usageCount + delta);
    const tags = getTagsCollection();
    await tags.updateOne(tagId, { usageCount: newCount });
}

export async function deleteArticle({ id }: ArticleParametersProps): Promise<boolean> {
    // Busca o artigo antes de deletar para decrementar contagem de tags
    const article = await getArticleById({ id });
    if (!article) return false;

    const articles = getArticlesCollection();
    const result = await articles.updateOne(id!, { deleted: true });

    if (!result.error && article.tags && article.tags.length > 0) {
        // Decrementar contagem de uso das tags
        for (const tagId of article.tags) {
            await updateTagUsageCount(tagId, -1);
        }
    }

    return !result.error;
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

/** Busca posts recentes retornando apenas campos necessários do banco */
export async function getRecentArticles(limit: number = 5): Promise<ArticleSummary[]> {
    const articles = getArticlesCollection();
    const result = await articles.find({
        query: { deleted: false },
        sort: { publishedAt: -1 },
        limit,
        projection: { _id: 1, title: 1, slug: 1, status: 1, publishedAt: 1, coverMedia: 1, categoryId: 1 }
    });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => articleSummaryFromDocument(doc));
}

/** Busca posts publicados recentes retornando apenas campos necessários do banco */
export async function getRecentPublishedArticles(limit: number = 5): Promise<ArticleSummary[]> {
    const articles = getArticlesCollection();
    const result = await articles.find({
        query: { deleted: false, status: 'published' },
        sort: { publishedAt: -1 },
        limit,
        projection: { _id: 1, title: 1, slug: 1, status: 1, publishedAt: 1, coverMedia: 1, categoryId: 1 }
    });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => articleSummaryFromDocument(doc));
}

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

// ─── STATS ───────────────────────────────────────────────────────────────────

export interface ArticleStats {
    total: number;
    published: number;
    draft: number;
    featured: number;
}

export async function getArticleStats(): Promise<ArticleStats> {
    const articles = getArticlesCollection();
    const result = await articles.aggregate([
        { $match: { deleted: false } },
        {
            $facet: {
                total: [{ $count: 'count' }],
                published: [{ $match: { status: 'published' } }, { $count: 'count' }],
                draft: [{ $match: { status: 'draft' } }, { $count: 'count' }],
                featured: [{ $match: { isFeatured: true } }, { $count: 'count' }],
            }
        }
    ]);

    const doc = result.documents?.[0] as {
        total?: { count: number }[];
        published?: { count: number }[];
        draft?: { count: number }[];
        featured?: { count: number }[];
    };

    return {
        total: doc?.total?.[0]?.count ?? 0,
        published: doc?.published?.[0]?.count ?? 0,
        draft: doc?.draft?.[0]?.count ?? 0,
        featured: doc?.featured?.[0]?.count ?? 0,
    };
}

// ─── COUNTS (deprecated - use getArticleStats) ───────────────────────────────

export async function countArticles(): Promise<number> {
    const articles = getArticlesCollection();
    const result = await articles.aggregate([
        { $match: { deleted: false } },
        { $count: 'total' }
    ]);
    return (result.documents?.[0] as { total?: number })?.total ?? 0;
}

export async function countPublishedArticles(): Promise<number> {
    const articles = getArticlesCollection();
    const result = await articles.aggregate([
        { $match: { deleted: false, status: 'published' } },
        { $count: 'total' }
    ]);
    return (result.documents?.[0] as { total?: number })?.total ?? 0;
}

export async function countDraftArticles(): Promise<number> {
    const articles = getArticlesCollection();
    const result = await articles.aggregate([
        { $match: { deleted: false, status: 'draft' } },
        { $count: 'total' }
    ]);
    return (result.documents?.[0] as { total?: number })?.total ?? 0;
}

export async function countFeaturedArticles(): Promise<number> {
    const articles = getArticlesCollection();
    const result = await articles.aggregate([
        { $match: { deleted: false, isFeatured: true } },
        { $count: 'total' }
    ]);
    return (result.documents?.[0] as { total?: number })?.total ?? 0;
}
