"use client";

import { useState, useEffect } from "react";
import { X, Search, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import * as MediaController from "@/lib/medias/Media.controller";
import type { Media } from "@/lib/medias/Media.model";

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: Media) => void;
    multiple?: boolean;
    onSelectMultiple?: (media: Media[]) => void;
}

export default function MediaPicker({
    isOpen,
    onClose,
    onSelect,
    multiple = false,
    onSelectMultiple,
}: MediaPickerProps) {
    const [media, setMedia] = useState<Media[]>([]);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const getMediaUrl = (fileName: string) => imageUrls[fileName] || '';

    // Carregar URLs das imagens
    useEffect(() => {
        async function loadImageUrls() {
            for (const item of media) {
                if (item.fileName && !imageUrls[item.fileName]) {
                    try {
                        const response = await MediaController.downloadFile({ fileName: item.fileName });
                        if (response) {
                            const blob = await response.blob();
                            const url = URL.createObjectURL(blob);
                            setImageUrls(prev => ({ ...prev, [item.fileName]: url }));
                        }
                    } catch (err) {
                        console.error('Erro ao baixar imagem:', item.fileName, err);
                    }
                }
            }
        }
        if (media.length > 0) loadImageUrls();
    }, [media]);

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setSelectedItems(new Set());
        }
    }, [isOpen]);

    async function fetchMedia() {
        try {
            setLoading(true);
            const items = await MediaController.getAllMedias();
            setMedia(items);
        } catch (err) {
            console.error('Failed to load media:', err);
        } finally {
            setLoading(false);
        }
    }

    const toggleSelection = (item: Media) => {
        if (multiple) {
            const newSelected = new Set(selectedItems);
            if (newSelected.has(item._id)) {
                newSelected.delete(item._id);
            } else {
                newSelected.add(item._id);
            }
            setSelectedItems(newSelected);
        } else {
            onSelect(item);
            onClose();
        }
    };

    const handleConfirmMultiple = () => {
        if (onSelectMultiple) {
            const selected = media.filter(m => selectedItems.has(m._id));
            onSelectMultiple(selected);
        }
        onClose();
    };

    const filteredMedia = searchQuery
        ? media.filter(m =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.fileName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : media;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-md w-full max-w-4xl max-h-[80vh] flex flex-col border border-border shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Selecionar Mídia</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3 bg-secondary rounded-md px-4 py-3">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar arquivos..."
                            className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground flex-1"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery ? 'Nenhuma mídia encontrada' : 'Biblioteca vazia'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {filteredMedia.map((item) => (
                                <button
                                    key={item._id}
                                    onClick={() => toggleSelection(item)}
                                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedItems.has(item._id)
                                        ? 'border-primary ring-2 ring-primary/20'
                                        : 'border-transparent hover:border-primary/30'
                                        }`}
                                >
                                    <Image
                                        src={getMediaUrl(item.fileName)}
                                        alt={item.altText || item.title}
                                        fill
                                        className="object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
                                    />

                                    {selectedItems.has(item._id) && (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <div className="bg-primary rounded-full p-1">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {multiple && (
                    <div className="p-4 border-t border-border flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {selectedItems.size} item(s) selecionado(s)
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-md bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmMultiple}
                                disabled={selectedItems.size === 0}
                                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors disabled:opacity-50"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
