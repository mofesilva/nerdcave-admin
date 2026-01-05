import { Album } from './Album.model';
import { toCamelCaseKeys } from '../utils';

export function albumFromDocument(doc: any): Album {
    // Converte todas as chaves de snake_case para camelCase recursivamente
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        title: data.title ?? '',
        slug: data.slug ?? '',
        description: data.description ?? '',
        coverMedia: data.coverMedia,
        medias: data.media ?? data.medias ?? [],
        categoryId: data.categoryId ?? '',
        tags: data.tagIds ?? data.tags ?? [],
        status: data.status ?? 'draft',
        deleted: data.deleted ?? false,
    }
}