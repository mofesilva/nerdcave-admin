import { Article, ArticleSummary } from './Article.model';
import { toCamelCaseKeys } from '../utils';

export function articleFromDocument(doc: any): Article {
    // Converte todas as chaves de snake_case para camelCase recursivamente
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        title: data.title ?? '',
        slug: data.slug ?? '',
        content: data.content ?? '',
        coverMedia: data.coverMedia,
        category: data.categoryId ?? data.category,
        tags: data.tagIds ?? data.tags ?? [],
        author: data.updatedBy ?? data.author,
        status: data.status ?? 'draft',
        publishedAt: data.publishedAt,
        scheduledAt: data.scheduledAt,
        readingTime: data.readingTime ?? 0,
        isFeatured: data.isFeatured ?? false,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        deleted: data.deleted ?? false,
    }
}

export function articleSummaryFromDocument(doc: any): ArticleSummary {
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        title: data.title ?? '',
        slug: data.slug ?? '',
        status: data.status ?? 'draft',
        publishedAt: data.publishedAt,
        coverMedia: data.coverMedia,
        category: data.categoryId ?? data.category,
    }
}