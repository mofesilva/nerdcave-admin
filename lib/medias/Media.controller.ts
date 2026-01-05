"use client";
import * as MediaService from './Media.service';
import type { Media } from './Media.model';
import type { PaginatedResult } from './Media.service';

interface MediaControllerProps {
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

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllMedias(): Promise<Media[]> {
    return MediaService.getAllMedias();
}

export async function getMediasPaginated({ page, pageSize, query }: MediaControllerProps): Promise<PaginatedResult<Media>> {
    return MediaService.getMediasPaginated({ page, pageSize, query });
}

export async function getMediaById({ id }: MediaControllerProps): Promise<Media | null> {
    return MediaService.getMediaById({ id });
}

export async function createMedia({ data, file }: MediaControllerProps): Promise<Media> {
    return MediaService.createMedia({ data, file });
}

export async function updateMedia({ id, updates }: MediaControllerProps): Promise<Media | null> {
    return MediaService.updateMedia({ id, updates });
}

export async function deleteMedia({ id }: MediaControllerProps): Promise<boolean> {
    return MediaService.deleteMedia({ id });
}
// ─── STORAGE ─────────────────────────────────────────────────────────────────

export async function downloadFile({ fileName }: MediaControllerProps): Promise<Response> {
    return MediaService.downloadFile({ fileName });
}

export async function uploadFile({ file, fileName }: { file: File; fileName?: string }) {
    return MediaService.uploadFile({ file, fileName });
}

/**
 * Returns the public URL for a media file
 */
export function getMediaUrl({ fileName }: MediaControllerProps): string {
    return MediaService.getMediaUrl({ fileName });
}
