"use client";
import { getAlbumsCollection } from './Albums.collection';
import { albumFromDocument } from './Album.mapper';
import { Album } from '@/lib/albums/Album.model';
import type { Media } from '@/lib/medias/Media.model';

interface AlbumParametersProps {
    id?: string;
    slug?: string;
    categoryId?: string;
    albumId?: string;
    mediaId?: string;
    media?: Media;
    medias?: Media[];
    data?: Omit<Album, '_id' | 'deleted'>;
    updates?: Partial<Album>;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export async function getAllAlbums(): Promise<Album[]> {
    const albums = getAlbumsCollection();
    const result = await albums.find({ query: { deleted: false } });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => albumFromDocument(doc));
}

export async function getPublishedAlbums(): Promise<Album[]> {
    const albums = getAlbumsCollection();
    const result = await albums.find({ query: { status: 'published', deleted: false } });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => albumFromDocument(doc));
}

export async function getAlbumById({ id }: AlbumParametersProps): Promise<Album> {
    const albums = getAlbumsCollection();
    try {
        const result = await albums.findById(id!);
        return albumFromDocument(result.document);
    } catch (error) {
        throw error;
    }
}

export async function getAlbumBySlug({ slug }: AlbumParametersProps): Promise<Album | null> {
    const albums = getAlbumsCollection();
    const result = await albums.findOne({ query: { slug, deleted: false } });
    if (result.error || !result.document) return null;
    return albumFromDocument(result.document);
}

export async function getAlbumsByCategory({ categoryId }: AlbumParametersProps): Promise<Album[]> {
    const albums = getAlbumsCollection();
    const result = await albums.find({ "query": { "categoryId": categoryId, "deleted": false } });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => albumFromDocument(doc));
}

export async function createAlbum({ data }: AlbumParametersProps): Promise<Album> {
    const albums = getAlbumsCollection();
    const payload = {
        ...data,
        slug: data!.slug || generateSlug(data!.title),
        medias: data!.medias ?? [],
        status: data!.status ?? 'draft',
        deleted: false,
    };

    const result = await albums.insertOne(payload);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create album');
    }
    return albumFromDocument(result.document);
}

export async function updateAlbum({ id, updates }: AlbumParametersProps): Promise<Album | null> {
    if (!updates) return null;
    const albums = getAlbumsCollection();
    const payload = updates.title && !updates.slug
        ? { ...updates, slug: generateSlug(updates.title) }
        : updates;

    const result = await albums.updateOne(id!, payload);
    if (result.error) return null;
    return getAlbumById({ id });
}

export async function addMediaToAlbum({ albumId, media }: AlbumParametersProps): Promise<Album | null> {
    const album = await getAlbumById({ id: albumId });
    if (!album) return null;
    if (album.medias.some(m => m._id === media!._id)) return album;

    return updateAlbum({ id: albumId, updates: { medias: [...album.medias, media!] } });
}

export async function removeMediaFromAlbum({ albumId, mediaId }: AlbumParametersProps): Promise<Album | null> {
    const album = await getAlbumById({ id: albumId });
    if (!album) return null;

    const newMedias = album.medias.filter(m => m._id !== mediaId);
    const updates: Partial<Album> = { medias: newMedias };
    if (album.coverMedia?._id === mediaId) updates.coverMedia = newMedias[0];

    return updateAlbum({ id: albumId, updates });
}

export async function setAlbumCover({ albumId, media }: AlbumParametersProps): Promise<Album | null> {
    return updateAlbum({ id: albumId, updates: { coverMedia: media } });
}

export async function reorderAlbumMedias({ albumId, medias }: AlbumParametersProps): Promise<Album | null> {
    return updateAlbum({ id: albumId, updates: { medias } });
}

export async function publishAlbum({ id }: AlbumParametersProps): Promise<Album | null> {
    return updateAlbum({ id, updates: { status: 'published' } });
}

export async function unpublishAlbum({ id }: AlbumParametersProps): Promise<Album | null> {
    return updateAlbum({ id, updates: { status: 'draft' } });
}

export async function deleteAlbum({ id }: AlbumParametersProps): Promise<boolean> {
    const albums = getAlbumsCollection();
    const result = await albums.updateOne(id!, { deleted: true });
    return !result.error;
}
