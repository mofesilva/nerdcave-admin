"use client";

import { getMediasCollection } from './Medias.collection';
import { mediaFromDocument } from './Media.mapper';
import type { Media } from './Media.model';
import { getCappuccinoClient, APP_NAME } from '@/lib/cappuccino/client';

const DEFAULT_PAGE_SIZE = 12;

interface MediaParametersProps {
    id?: string;
    ids?: string[];
    query?: string;
    fileName?: string;
    file?: File;
    data?: Omit<Media, '_id' | 'deleted'>;
    updates?: Partial<Media>;
    page?: number;
    pageSize?: number;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllMedias(): Promise<Media[]> {
    const medias = getMediasCollection();
    const result = await medias.find({ query: { deleted: { $ne: true } } });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => mediaFromDocument(doc));
}

export async function getRecentMedias(limit: number = 5): Promise<Media[]> {
    const medias = getMediasCollection();
    const result = await medias.aggregate([
        { $match: { deleted: { $ne: true } } },
        { $sort: { created_at: -1 } },
        { $limit: limit }
    ]);
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => mediaFromDocument(doc));
}

export async function getMediasPaginated({ page = 1, pageSize = DEFAULT_PAGE_SIZE, query }: MediaParametersProps): Promise<PaginatedResult<Media>> {
    const medias = getMediasCollection();
    const skip = (page - 1) * pageSize;

    const filter: Record<string, unknown> = { deleted: { $ne: true } };
    if (query) {
        filter.title = { $regex: query, $options: 'i' };
    }

    // Busca os itens da página
    const result = await medias.find({
        query: filter,
        limit: pageSize,
        skip
    });

    if (result.error || !result.documents) {
        return { items: [], total: 0, page, pageSize, totalPages: 0 };
    }

    const items = result.documents.map(doc => mediaFromDocument(doc));

    // Conta o total usando aggregation
    const countResult = await medias.aggregate([
        { $match: filter },
        { $count: 'total' }
    ]);

    const total = (countResult.documents?.[0] as { total?: number })?.total ?? items.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        items,
        total,
        page,
        pageSize,
        totalPages
    };
}

export async function getMediaById({ id }: MediaParametersProps): Promise<Media | null> {
    const medias = getMediasCollection();
    const result = await medias.findById(id!);
    if (result.error || !result.document) return null;
    return mediaFromDocument(result.document);
}

export async function createMedia({ data, file }: MediaParametersProps): Promise<Media> {
    if (!file) throw new Error('File is required');

    const uploadResult = await uploadFile({ file, fileName: data?.title });
    if (uploadResult.error) throw new Error('Failed to upload media file');

    const medias = getMediasCollection();
    const payload = {
        ...data,
        fileName: uploadResult.document?.fileName || '',
        deleted: false,
    };

    const result = await medias.insertOne(payload);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create media');
    }
    return mediaFromDocument(result.document);
}

export async function updateMedia({ id, updates }: MediaParametersProps): Promise<Media | null> {
    if (!updates) return null;
    const medias = getMediasCollection();
    const result = await medias.updateOne(id!, updates);
    if (result.error) return null;
    return getMediaById({ id });
}

export async function deleteMedia({ id }: MediaParametersProps): Promise<boolean> {
    // Busca a mídia antes de deletar para pegar o fileName
    const media = await getMediaById({ id });
    if (!media) return false;

    // Deleta o arquivo físico do storage
    if (media.fileName) {
        try {
            const client = getCappuccinoClient();
            await client.modules.mediastorage.delete(APP_NAME, media.fileName);
        } catch (error) {
            console.error('Error deleting file from storage:', error);
            // Continua mesmo se falhar, para marcar como deleted no DB
        }
    }

    // Marca como deleted no banco
    const medias = getMediasCollection();
    const result = await medias.updateOne(id!, { deleted: true });
    return !result.error;
}

// ─── STORAGE ─────────────────────────────────────────────────────────────────

export async function uploadFile({ file, fileName }: { file: File; fileName?: string }) {
    const client = getCappuccinoClient();
    return client.modules.mediastorage.upload({
        file,
        app: APP_NAME,
        fileName: fileName || file.name,
        fileType: file.type,
    });
}

export async function downloadFile({ fileName }: MediaParametersProps): Promise<Response> {
    const client = getCappuccinoClient();
    return client.modules.mediastorage.download(APP_NAME, fileName!);
}

/**
 * Returns the public URL for a media file.
 * Uses local proxy to avoid CORS issues.
 */
export function getMediaUrl({ fileName }: MediaParametersProps): string {
    if (!fileName) return '';
    return `/api/media/${fileName}`;
}

// ─── COUNTS ──────────────────────────────────────────────────────────────────

export async function countMedias(): Promise<number> {
    const medias = getMediasCollection();
    const result = await medias.aggregate([
        { $match: { deleted: { $ne: true } } },
        { $count: 'total' }
    ]);
    return (result.documents?.[0] as { total?: number })?.total ?? 0;
}
