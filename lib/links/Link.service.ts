import { getLinksCollection } from './Links.collection';
import { linkFromDocument } from './Link.mapper';
import type { Link, LinkType } from './Link.model';

interface LinkParametersProps {
    id?: string;
    type?: LinkType;
    data?: Omit<Link, '_id' | 'deleted'>;
    updates?: Partial<Link>;
    order?: number;
    linkIds?: string[];
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllLinks(): Promise<Link[]> {
    const links = getLinksCollection();
    const result = await links.find({ query: { deleted: false } });
    console.log('[Links] getAllLinks result:', result);
    if (result.error || !result.documents) return [];
    return result.documents
        .map(doc => linkFromDocument(doc))
        .sort((a, b) => a.order - b.order);
}

export async function getActiveLinks(): Promise<Link[]> {
    const links = getLinksCollection();
    const result = await links.find({ query: { isActive: true, deleted: false } });
    if (result.error || !result.documents) return [];
    return result.documents
        .map(doc => linkFromDocument(doc))
        .sort((a, b) => a.order - b.order);
}

export async function getLinkById({ id }: LinkParametersProps): Promise<Link | null> {
    const links = getLinksCollection();
    const result = await links.findById(id!);
    if (result.error || !result.document) return null;
    return linkFromDocument(result.document);
}

export async function createLink({ data }: LinkParametersProps): Promise<Link> {
    const links = getLinksCollection();
    const payload = {
        ...data,
        isActive: data!.isActive ?? true,
        order: data!.order ?? 0,
        deleted: false,
    };

    const result = await links.insertOne(payload);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create link');
    }
    return linkFromDocument(result.document);
}

export async function updateLink({ id, updates }: LinkParametersProps): Promise<Link | null> {
    if (!updates) return null;
    const links = getLinksCollection();
    const result = await links.updateOne(id!, updates);
    if (result.error) return null;
    return getLinkById({ id });
}

export async function deleteLink({ id }: LinkParametersProps): Promise<boolean> {
    const links = getLinksCollection();
    const result = await links.updateOne(id!, { deleted: true });
    return !result.error;
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getLinksByType({ type }: LinkParametersProps): Promise<Link[]> {
    const all = await getAllLinks();
    return all.filter(link => link.type === type);
}

export async function getMainLinks(): Promise<Link[]> {
    return getLinksByType({ type: 'main' });
}

export async function getSocialLinks(): Promise<Link[]> {
    return getLinksByType({ type: 'social' });
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────

export async function toggleLinkActive({ id }: LinkParametersProps): Promise<Link | null> {
    const link = await getLinkById({ id });
    if (!link) return null;
    return updateLink({ id, updates: { isActive: !link.isActive } });
}

// ─── ORDER ───────────────────────────────────────────────────────────────────

export async function updateLinkOrder({ id, order }: LinkParametersProps): Promise<boolean> {
    const links = getLinksCollection();
    const result = await links.updateOne(id!, { order });
    return !result.error;
}

export async function reorderLinks({ linkIds }: LinkParametersProps): Promise<boolean> {
    if (!linkIds) return false;
    try {
        for (let i = 0; i < linkIds.length; i++) {
            await updateLinkOrder({ id: linkIds[i], order: i });
        }
        return true;
    } catch {
        return false;
    }
}

// ─── STATS ───────────────────────────────────────────────────────────────────

export interface LinkStats {
    total: number;
    active: number;
}

export async function getLinkStats(): Promise<LinkStats> {
    const links = getLinksCollection();
    const result = await links.aggregate([
        { $match: { deleted: false } },
        {
            $facet: {
                total: [{ $count: 'count' }],
                active: [{ $match: { isActive: true } }, { $count: 'count' }],
            }
        }
    ]);

    const doc = result.documents?.[0] as {
        total?: { count: number }[];
        active?: { count: number }[];
    };

    return {
        total: doc?.total?.[0]?.count ?? 0,
        active: doc?.active?.[0]?.count ?? 0,
    };
}

// ─── COUNTS (deprecated - use getLinkStats) ──────────────────────────────────

export async function countLinks(): Promise<number> {
    const links = getLinksCollection();
    const result = await links.aggregate([
        { $match: { deleted: false } },
        { $count: 'total' }
    ]);
    return (result.documents?.[0] as { total?: number })?.total ?? 0;
}

export async function countActiveLinks(): Promise<number> {
    const links = getLinksCollection();
    const result = await links.aggregate([
        { $match: { deleted: false, isActive: true } },
        { $count: 'total' }
    ]);
    return (result.documents?.[0] as { total?: number })?.total ?? 0;
}
