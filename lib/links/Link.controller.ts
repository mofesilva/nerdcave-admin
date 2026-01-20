import * as LinkService from './Link.service';
import type { Link, LinkType } from './Link.model';

interface LinkControllerProps {
    id?: string;
    type?: LinkType;
    data?: Omit<Link, '_id' | 'createdAt' | 'updatedAt' | 'deleted'>;
    updates?: Partial<Link>;
    order?: number;
    linkIds?: string[];
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllLinks(): Promise<Link[]> {
    return LinkService.getAllLinks();
}

export async function getActiveLinks(): Promise<Link[]> {
    return LinkService.getActiveLinks();
}

export async function getLinkById({ id }: LinkControllerProps): Promise<Link | null> {
    return LinkService.getLinkById({ id });
}

export async function createLink({ data }: LinkControllerProps): Promise<Link> {
    return LinkService.createLink({ data });
}

export async function updateLink({ id, updates }: LinkControllerProps): Promise<Link | null> {
    return LinkService.updateLink({ id, updates });
}

export async function deleteLink({ id }: LinkControllerProps): Promise<boolean> {
    return LinkService.deleteLink({ id });
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getLinksByType({ type }: LinkControllerProps): Promise<Link[]> {
    return LinkService.getLinksByType({ type });
}

export async function getMainLinks(): Promise<Link[]> {
    return LinkService.getMainLinks();
}

export async function getSocialLinks(): Promise<Link[]> {
    return LinkService.getSocialLinks();
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────

export async function toggleLinkActive({ id }: LinkControllerProps): Promise<Link | null> {
    return LinkService.toggleLinkActive({ id });
}

// ─── ORDER ───────────────────────────────────────────────────────────────────

export async function updateLinkOrder({ id, order }: LinkControllerProps): Promise<boolean> {
    return LinkService.updateLinkOrder({ id, order });
}

export async function reorderLinks({ linkIds }: LinkControllerProps): Promise<boolean> {
    return LinkService.reorderLinks({ linkIds });
}

// ─── STATS ───────────────────────────────────────────────────────────────────

export type { LinkStats } from './Link.service';

export async function getLinkStats() {
    return LinkService.getLinkStats();
}

// ─── COUNTS (deprecated - use getLinkStats) ──────────────────────────────────

export async function countLinks(): Promise<number> {
    return LinkService.countLinks();
}

export async function countActiveLinks(): Promise<number> {
    return LinkService.countActiveLinks();
}
