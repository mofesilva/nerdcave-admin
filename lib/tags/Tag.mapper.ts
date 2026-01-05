import { Tag } from './Tag.model';

export function tagFromDocument(doc: any): Tag {
    return {
        _id: doc._id ?? '',
        name: doc.name ?? '',
        slug: doc.slug ?? '',
        usageCount: doc.usageCount ?? 0,
        deleted: doc.deleted ?? false,
    };
}
