'use client';
import * as ArticleService from './Article.service';
import type { Article, ArticleSummary } from './Article.model';

interface ArticleControllerProps {
    id?: string;
    slug?: string;
    categoryId?: string;
    tagId?: string;
    data?: Omit<Article, '_id' | 'deleted'>;
    updates?: Partial<Article>;
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
    return ArticleService.getAllArticles();
}

export async function getArticleById({ id }: ArticleControllerProps): Promise<Article | null> {
    return ArticleService.getArticleById({ id });
}

export async function getArticleBySlug({ slug }: ArticleControllerProps): Promise<Article | null> {
    return ArticleService.getArticleBySlug({ slug });
}

export async function createArticle({ data }: ArticleControllerProps): Promise<Article> {
    return ArticleService.createArticle({ data });
}

export async function updateArticle({ id, updates }: ArticleControllerProps): Promise<Article | null> {
    return ArticleService.updateArticle({ id, updates });
}

export async function deleteArticle({ id }: ArticleControllerProps): Promise<boolean> {
    return ArticleService.deleteArticle({ id });
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getRecentArticles(limit: number = 5): Promise<ArticleSummary[]> {
    return ArticleService.getRecentArticles(limit);
}

export async function getRecentPublishedArticles(limit: number = 5): Promise<ArticleSummary[]> {
    return ArticleService.getRecentPublishedArticles(limit);
}

export async function getPublishedArticles(): Promise<Article[]> {
    return ArticleService.getPublishedArticles();
}

export async function getFeaturedArticles(): Promise<Article[]> {
    return ArticleService.getFeaturedArticles();
}

export async function getArticlesByCategory({ categoryId }: ArticleControllerProps): Promise<Article[]> {
    return ArticleService.getArticlesByCategory({ categoryId });
}

export async function getArticlesByTag({ tagId }: ArticleControllerProps): Promise<Article[]> {
    return ArticleService.getArticlesByTag({ tagId });
}

// ─── STATUS ──────────────────────────────────────────────────────────────────

export async function publishArticle({ id }: ArticleControllerProps): Promise<Article | null> {
    return ArticleService.publishArticle({ id });
}

export async function unpublishArticle({ id }: ArticleControllerProps): Promise<Article | null> {
    return ArticleService.unpublishArticle({ id });
}

export async function toggleFeatured({ id }: ArticleControllerProps): Promise<Article | null> {
    return ArticleService.toggleFeatured({ id });
}

// ─── SCHEDULING ──────────────────────────────────────────────────────────────

export async function getScheduledToPublish(now: Date): Promise<Article[]> {
    return ArticleService.getScheduledToPublish(now);
}

export async function publishScheduledArticles(now: Date): Promise<Article[]> {
    return ArticleService.publishScheduledArticles(now);
}

// ─── STATS ───────────────────────────────────────────────────────────────────

export type { ArticleStats } from './Article.service';

export async function getArticleStats() {
    return ArticleService.getArticleStats();
}

// ─── COUNTS (deprecated - use getArticleStats) ───────────────────────────────

export async function countArticles(): Promise<number> {
    return ArticleService.countArticles();
}

export async function countPublishedArticles(): Promise<number> {
    return ArticleService.countPublishedArticles();
}

export async function countDraftArticles(): Promise<number> {
    return ArticleService.countDraftArticles();
}

export async function countFeaturedArticles(): Promise<number> {
    return ArticleService.countFeaturedArticles();
}
