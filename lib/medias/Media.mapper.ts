import { Media } from './Media.model';
import { toCamelCaseKeys } from '../utils';

export function mediaFromDocument(doc: any): Media {
    // Converte todas as chaves de snake_case para camelCase recursivamente
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        fileName: data.fileName ?? '',
        title: data.title ?? data.originalName ?? '',
        altText: data.altText ?? data.originalName ?? '',
        deleted: data.deleted ?? false,
        createdAt: data.createdAt ?? '',
    };
}
