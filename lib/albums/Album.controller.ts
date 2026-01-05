import {
    getAllAlbums,
    getPublishedAlbums,
    getAlbumsByCategory,
    getAlbumById,
    getAlbumBySlug,
    createAlbum,
    updateAlbum,
    addMediaToAlbum,
    removeMediaFromAlbum,
    setAlbumCover,
    reorderAlbumMedias,
    publishAlbum,
    unpublishAlbum,
    deleteAlbum,
    type CreateAlbumInput,
} from './Album.service';
import type { Album } from './Album.model';
import type { Media } from '@/lib/medias/Media.model';

// Read
export const getAllAlbumsController = () => getAllAlbums();
export const getPublishedAlbumsController = () => getPublishedAlbums();
export const getAlbumByIdController = ({ id }: { id: string }) => getAlbumById({ id });
export const getAlbumBySlugController = ({ slug }: { slug: string }) => getAlbumBySlug({ slug });
export const getAlbumsByCategoryController = ({ categoryId }: { categoryId: string }) => getAlbumsByCategory({ categoryId });

// Create / Update
export const createAlbumController = ({ data }: { data: CreateAlbumInput }) => createAlbum({ data });
export const updateAlbumController = ({ id, updates }: { id: string; updates: Partial<Album> }) => updateAlbum({ id, updates });

// Media
export const addMediaToAlbumController = ({ albumId, media }: { albumId: string; media: Media }) => addMediaToAlbum({ albumId, media });
export const removeMediaFromAlbumController = ({ albumId, mediaId }: { albumId: string; mediaId: string }) => removeMediaFromAlbum({ albumId, mediaId });
export const setAlbumCoverController = ({ albumId, media }: { albumId: string; media: Media }) => setAlbumCover({ albumId, media });
export const reorderAlbumMediasController = ({ albumId, medias }: { albumId: string; medias: Media[] }) => reorderAlbumMedias({ albumId, medias });

// Status
export const publishAlbumController = ({ id }: { id: string }) => publishAlbum({ id });
export const unpublishAlbumController = ({ id }: { id: string }) => unpublishAlbum({ id });

// Delete
export const deleteAlbumController = ({ id }: { id: string }) => deleteAlbum({ id });