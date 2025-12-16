"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Search, X, Trash2, Image as ImageIcon, Loader2, Grid, List } from "lucide-react";
import { MediaController } from "@/lib/controllers";
import { MediaModel } from "@/lib/models/Media.model";
import { useCappuccino } from "@/lib/contexts/CappuccinoContext";
import { mediastorage } from "cappuccino-web-sdk";

export default function MediaPage() {
    const { app } = useCappuccino();
    const [media, setMedia] = useState<MediaModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getMediaUrl = (fileName: string): string => {
        if (!app) return '';
        return mediastorage.getPublicUrl(app, fileName);
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    async function fetchMedia() {
        try {
            setLoading(true);
            const models = await MediaController.getAll();
            setMedia(models);
            setError(null);
        } catch (err) {
            setError("Falha ao carregar mídia");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleUpload = async (files: FileList) => {
        if (!app) return;
        setUploading(true);
        setError(null);

        try {
            for (const file of Array.from(files)) {
                if (!file.type.startsWith('image/')) continue;

                const timestamp = Date.now();
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const fileName = `media/${timestamp}-${cleanName}`;

                const result = await mediastorage.upload({
                    file,
                    app,
                    fileName,
                    fileType: file.type,
                });

                await MediaController.create({
                    fileName: result.fileName,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    altText: file.name.replace(/\.[^/.]+$/, ''),
                });
            }

            await fetchMedia();
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Erro ao fazer upload');
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedItems(newSelected);
    };

    const handleDeleteSelected = async () => {
        if (!confirm(`Deletar ${selectedItems.size} item(s)?`)) return;

        try {
            for (const id of selectedItems) {
                await MediaController.delete(id);
            }
            setSelectedItems(new Set());
            await fetchMedia();
        } catch (err) {
            console.error('Delete error:', err);
            setError('Erro ao deletar mídia');
        }
    };

    const filteredMedia = media.filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.fileName.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Biblioteca de Mídia</h1>
                    <p className="text-muted-foreground mt-2">Gerencie suas imagens</p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedItems.size > 0 && (
                        <button onClick={handleDeleteSelected} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />Deletar ({selectedItems.size})
                        </button>
                    )}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
                    >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        {uploading ? 'Enviando...' : 'Upload'}
                    </button>
                    <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 flex-1 max-w-md border border-border">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar arquivos..."
                        className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground flex-1"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-muted-foreground" /></button>
                    )}
                </div>

                <div className="flex items-center bg-card rounded-xl border border-border overflow-hidden">
                    <button onClick={() => setViewMode('grid')} className={`p-3 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>
                        <Grid className="w-5 h-5" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-3 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">{error}</div>
            )}

            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors"
            >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                    Arraste arquivos aqui ou{' '}
                    <button onClick={() => fileInputRef.current?.click()} className="text-primary hover:underline">clique para selecionar</button>
                </p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{searchQuery ? 'Nenhum arquivo encontrado' : 'Nenhum arquivo'}</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => toggleSelection(item._id)}
                            className={`group relative bg-card rounded-xl overflow-hidden border cursor-pointer ${
                                selectedItems.has(item._id) ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/30'
                            }`}
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={getMediaUrl(item.fileName)}
                                    alt={item.altText || item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
                                />
                                {selectedItems.has(item._id) && (
                                    <div className="absolute top-2 right-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredMedia.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => toggleSelection(item._id)}
                            className={`flex items-center gap-4 bg-card rounded-xl p-4 border cursor-pointer ${
                                selectedItems.has(item._id) ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/30'
                            }`}
                        >
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                <img
                                    src={getMediaUrl(item.fileName)}
                                    alt={item.altText || item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">{item.title}</p>
                                <p className="text-sm text-muted-foreground truncate">{item.fileName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
