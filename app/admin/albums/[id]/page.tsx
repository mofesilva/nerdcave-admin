"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Trash2, Star, Image as ImageIcon, X, Check } from "lucide-react";
import Link from "next/link";
import { AlbumModel } from "@/lib/models/Album.model";
import { MediaModel } from "@/lib/models/Media.model";
import { AlbumsController, MediaController } from "@/lib/controllers";
import { useCappuccino } from "@/lib/contexts/CappuccinoContext";
import { mediastorage } from "cappuccino-web-sdk";

export default function AlbumDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { app } = useCappuccino();
    const albumId = params.id as string;

    const [album, setAlbum] = useState<AlbumModel | null>(null);
    const [mediaItems, setMediaItems] = useState<MediaModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);

    const getMediaUrl = (fileName: string): string => {
        if (!app) return '';
        return mediastorage.getPublicUrl(app, fileName);
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const albumData = await AlbumsController.getById(albumId);

            if (!albumData) {
                router.push('/admin/albums');
                return;
            }

            setAlbum(albumData);

            if (albumData.mediaIds.length > 0) {
                const media = await MediaController.getByIds(albumData.mediaIds);
                const ordered = albumData.mediaIds
                    .map(id => media.find(m => m._id === id))
                    .filter((m): m is MediaModel => m !== undefined);
                setMediaItems(ordered);
            } else {
                setMediaItems([]);
            }

            setError(null);
        } catch (err) {
            setError("Falha ao carregar álbum");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [albumId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !app || !album) return;

        setUploading(true);
        setUploadProgress(0);

        const totalFiles = files.length;
        let completed = 0;

        try {
            for (const file of Array.from(files)) {
                if (!file.type.startsWith('image/')) continue;

                const timestamp = Date.now();
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const fileName = `albums/${albumId}/${timestamp}-${cleanName}`;

                const result = await mediastorage.upload({
                    file,
                    app,
                    fileName,
                    fileType: file.type,
                });

                const media = await MediaController.create({
                    fileName: result.fileName,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    altText: file.name.replace(/\.[^/.]+$/, ''),
                });

                await AlbumsController.addMedia(album._id, media._id);

                if (mediaItems.length === 0 && completed === 0) {
                    await AlbumsController.setCover(album._id, media._id);
                }

                completed++;
                setUploadProgress(Math.round((completed / totalFiles) * 100));
            }

            await fetchData();
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Falha ao fazer upload');
        } finally {
            setUploading(false);
            setUploadProgress(0);
            e.target.value = '';
        }
    };

    const handleSetCover = async (mediaId: string) => {
        if (!album) return;

        try {
            await AlbumsController.setCover(album._id, mediaId);
            await fetchData();
        } catch (err) {
            setError('Erro ao definir capa');
        }
    };

    const handleRemoveMedia = async (mediaId: string) => {
        if (!album || !confirm('Remover esta imagem do álbum?')) return;

        try {
            await AlbumsController.removeMedia(album._id, mediaId);
            await fetchData();
        } catch (err) {
            setError('Erro ao remover imagem');
        }
    };

    const handleRemoveSelected = async () => {
        if (!album || selectedMedia.size === 0) return;
        if (!confirm(`Remover ${selectedMedia.size} imagem(ns)?`)) return;

        try {
            for (const mediaId of selectedMedia) {
                await AlbumsController.removeMedia(album._id, mediaId);
            }
            setSelectedMedia(new Set());
            setSelectionMode(false);
            await fetchData();
        } catch (err) {
            setError('Erro ao remover imagens');
        }
    };

    const toggleSelection = (mediaId: string) => {
        const newSelection = new Set(selectedMedia);
        if (newSelection.has(mediaId)) {
            newSelection.delete(mediaId);
        } else {
            newSelection.add(mediaId);
        }
        setSelectedMedia(newSelection);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
            </div>
        );
    }

    if (!album) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Álbum não encontrado</p>
                <Link href="/admin/albums" className="text-primary hover:underline mt-4 block">
                    Voltar
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/albums" className="p-2 rounded-lg bg-secondary hover:bg-secondary/80">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground">{album.title}</h1>
                    <p className="text-muted-foreground mt-1">
                        {mediaItems.length} imagem(ns) • {album.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </p>
                </div>

                <label className={`bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-50' : 'hover:opacity-90'}`}>
                    <Upload className="w-5 h-5" />
                    {uploading ? `${uploadProgress}%` : 'Upload'}
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
                </div>
            )}

            {selectionMode && (
                <div className="bg-card rounded-xl border border-border p-4 flex justify-between">
                    <div className="flex items-center gap-4">
                        <span>{selectedMedia.size} selecionada(s)</span>
                        <button onClick={() => setSelectedMedia(new Set(mediaItems.map(m => m._id)))} className="text-sm text-primary hover:underline">Todas</button>
                        <button onClick={() => setSelectedMedia(new Set())} className="text-sm text-muted-foreground hover:underline">Limpar</button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleRemoveSelected} disabled={selectedMedia.size === 0} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 disabled:opacity-50">
                            <Trash2 className="w-4 h-4 inline mr-2" />Remover
                        </button>
                        <button onClick={() => { setSelectionMode(false); setSelectedMedia(new Set()); }} className="px-4 py-2 rounded-lg bg-secondary">Cancelar</button>
                    </div>
                </div>
            )}

            {mediaItems.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Nenhuma imagem</p>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl cursor-pointer">
                        <Upload className="w-5 h-5" />Upload
                        <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
            ) : (
                <>
                    {!selectionMode && (
                        <button onClick={() => setSelectionMode(true)} className="text-sm text-muted-foreground hover:text-foreground">Selecionar</button>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {mediaItems.map((media) => (
                            <div
                                key={media._id}
                                className={`relative group aspect-square rounded-xl overflow-hidden bg-secondary cursor-pointer ${selectedMedia.has(media._id) ? 'ring-2 ring-primary' : ''
                                    }`}
                                onClick={() => selectionMode && toggleSelection(media._id)}
                            >
                                <img
                                    src={getMediaUrl(media.fileName)}
                                    alt={media.altText || media.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
                                />

                                {album.coverMediaId === media._id && (
                                    <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />Capa
                                    </div>
                                )}

                                {selectionMode && (
                                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMedia.has(media._id) ? 'bg-primary border-primary' : 'bg-black/50 border-white'
                                        }`}>
                                        {selectedMedia.has(media._id) && <Check className="w-4 h-4 text-primary-foreground" />}
                                    </div>
                                )}

                                {!selectionMode && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        {album.coverMediaId !== media._id && (
                                            <button onClick={(e) => { e.stopPropagation(); handleSetCover(media._id); }} className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                                                <Star className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation(); handleRemoveMedia(media._id); }} className="p-2 rounded-lg bg-red-500/20 text-red-400">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100">
                                    <p className="text-white text-sm truncate">{media.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {uploading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-2xl p-8 text-center border border-border">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
                        <p className="text-2xl font-bold text-primary">{uploadProgress}%</p>
                    </div>
                </div>
            )}
        </div>
    );
}
