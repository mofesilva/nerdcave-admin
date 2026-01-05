import * as TagService from './Tag.service';
import type { Tag } from './Tag.model';

interface TagControllerProps {
    id?: string;
    name?: string;
    slug?: string;
    names?: string[];
    limit?: number;
    data?: Omit<Tag, '_id' | 'deleted'>;
    updates?: Partial<Tag>;
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllTags(): Promise<Tag[]> {
    return TagService.getAllTags();
}

export async function getTagById({ id }: TagControllerProps): Promise<Tag | null> {
    return TagService.getTagById({ id });
}

export async function getTagBySlug({ slug }: TagControllerProps): Promise<Tag | null> {
    return TagService.getTagBySlug({ slug });
}

export async function getTagByName({ name }: TagControllerProps): Promise<Tag | null> {
    return TagService.getTagByName({ name });
}

export async function createTag({ data }: TagControllerProps): Promise<Tag> {
    return TagService.createTag({ data });
}

export async function updateTag({ id, updates }: TagControllerProps): Promise<Tag | null> {
    return TagService.updateTag({ id, updates });
}

export async function deleteTag({ id }: TagControllerProps): Promise<boolean> {
    return TagService.deleteTag({ id });
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getPopularTags({ limit }: TagControllerProps): Promise<Tag[]> {
    return TagService.getPopularTags({ limit });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export async function getOrCreateTag({ name }: TagControllerProps): Promise<Tag> {
    return TagService.getOrCreateTag({ name });
}

export async function getOrCreateManyTags({ names }: TagControllerProps): Promise<Tag[]> {
    return TagService.getOrCreateManyTags({ names });
}

export async function incrementUsageCount({ id }: TagControllerProps): Promise<boolean> {
    return TagService.incrementUsageCount({ id });
}

export async function decrementUsageCount({ id }: TagControllerProps): Promise<boolean> {
    return TagService.decrementUsageCount({ id });
}
