import { Link } from './Link.model';
import { toCamelCaseKeys } from '../utils';

export function linkFromDocument(doc: any): Link {
    // Converte todas as chaves de snake_case para camelCase recursivamente
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        url: data.url ?? '',
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
        type: data.type ?? 'main',
        platform: data.platform,
        deleted: data.deleted ?? false,
    };
}
