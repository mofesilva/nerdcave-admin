import { Category } from './Category.model';

export function categoryFromDocument(doc: any): Category {
    return {
        _id: doc._id ?? '',
        name: doc.name ?? '',
        slug: doc.slug ?? '',
        description: doc.description,
        type: doc.type ?? 'both',
        color: doc.color,
        icon: doc.icon,
        parentId: doc.parentId,
        order: doc.order ?? 0,
        deleted: doc.deleted ?? false,
    };
}
