import { getTagsCollection } from './Tags.collection';
import { tagFromDocument } from './Tag.mapper';
import type { Tag } from './Tag.model';

interface TagParametersProps {
    id?: string;
    name?: string;
    slug?: string;
    names?: string[];
    limit?: number;
    data?: Omit<Tag, '_id' | 'deleted'>;
    updates?: Partial<Tag>;
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllTags(): Promise<Tag[]> {
    const tags = getTagsCollection();
    const result = await tags.find({ query: { deleted: false } });
    if (result.error || !result.documents) return [];
    return result.documents
        .map(doc => tagFromDocument(doc))
        .sort((a, b) => b.usageCount - a.usageCount);
}

export async function getTagById({ id }: TagParametersProps): Promise<Tag | null> {
    const tags = getTagsCollection();
    const result = await tags.findById(id!);
    if (result.error || !result.document) return null;
    return tagFromDocument(result.document);
}

export async function getTagBySlug({ slug }: TagParametersProps): Promise<Tag | null> {
    const tags = getTagsCollection();
    const result = await tags.findOne({ query: { slug, deleted: false } });
    if (result.error || !result.document) return null;
    return tagFromDocument(result.document);
}

export async function getTagByName({ name }: TagParametersProps): Promise<Tag | null> {
    const tags = getTagsCollection();
    const result = await tags.findOne({ query: { name, deleted: false } });
    if (result.error || !result.document) return null;
    return tagFromDocument(result.document);
}

export async function createTag({ data }: TagParametersProps): Promise<Tag> {
    const tags = getTagsCollection();
    const payload = {
        name: data!.name,
        slug: data!.slug || generateSlug(data!.name),
        usageCount: data!.usageCount ?? 0,
        deleted: false,
    };

    const result = await tags.insertOne(payload);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create tag');
    }
    return tagFromDocument(result.document);
}

export async function updateTag({ id, updates }: TagParametersProps): Promise<Tag | null> {
    if (!updates) return null;
    const tags = getTagsCollection();
    const payload = updates.name && !updates.slug
        ? { ...updates, slug: generateSlug(updates.name) }
        : updates;

    const result = await tags.updateOne(id!, payload);
    if (result.error) return null;
    return getTagById({ id });
}

export async function deleteTag({ id }: TagParametersProps): Promise<boolean> {
    const tags = getTagsCollection();
    const result = await tags.updateOne(id!, { deleted: true });
    return !result.error;
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getPopularTags({ limit = 10 }: TagParametersProps): Promise<Tag[]> {
    const all = await getAllTags();
    return all.slice(0, limit);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export async function getOrCreateTag({ name }: TagParametersProps): Promise<Tag> {
    const existing = await getTagByName({ name });
    if (existing) return existing;
    return createTag({ data: { name: name!, slug: generateSlug(name!), usageCount: 0 } });
}

export async function getOrCreateManyTags({ names }: TagParametersProps): Promise<Tag[]> {
    if (!names) return [];
    const tags: Tag[] = [];
    for (const name of names) {
        const tag = await getOrCreateTag({ name });
        tags.push(tag);
    }
    return tags;
}

export async function incrementUsageCount({ id }: TagParametersProps): Promise<boolean> {
    const tag = await getTagById({ id });
    if (!tag) return false;

    const tags = getTagsCollection();
    const result = await tags.updateOne(id!, { usageCount: tag.usageCount + 1 });
    return !result.error;
}

export async function decrementUsageCount({ id }: TagParametersProps): Promise<boolean> {
    const tag = await getTagById({ id });
    if (!tag) return false;

    const tags = getTagsCollection();
    const result = await tags.updateOne(id!, { usageCount: Math.max(0, tag.usageCount - 1) });
    return !result.error;
}
