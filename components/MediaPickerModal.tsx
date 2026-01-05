"use client";

import { useState, useRef, useCallback, memo } from "react";
import { X, Search, Image as ImageIcon, Check, Loader2, Upload, Link as LinkIcon, Images } from "lucide-react";
import Image from "next/image";
import type { Media } from "@/lib/medias/Media.model";
import * as MediaController from "@/lib/medias/Media.controller";
import Button from "@/components/Button";
import useSWR from "swr";

type TabType = "gallery" | "upload" | "url";

interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: Media) => void;
    multiple?: boolean;
    onSelectMultiple?: (media: Media[]) => void;
}

// Fetcher para SWR
async function fetchMedias() {
    return MediaController.getMediasPaginated({ page: 1, pageSize: 100 });
}

// Thumbnail memoizado - usa URL do SDK igual Flutter
const Thumb = memo(function Thumb({ fileName, alt }: { fileName: string; alt: string }) {
    return (
        <Image
            src={MediaController.getMediaUrl({ fileName })}
            alt={alt}
            fill
            sizes="160px"
            className="object-cover"
            loading="lazy"
            unoptimized
        />
    );
});

export default function MediaPickerModal({
    isOpen,
    onClose,
    onSelect,
    multiple = false,
    onSelectMultiple,
}: MediaPickerModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("gallery");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [urlLoading, setUrlLoading] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);
    const [urlPreview, setUrlPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // SWR para buscar mídias - só busca quando modal está aberto
    const { data, isLoading, mutate } = useSWR(
        isOpen ? "media-picker" : null,
        fetchMedias,
        { revalidateOnFocus: false }
    );

    const media = data?.items ?? [];

    const filteredMedia = searchQuery
        ? media.filter(m =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.fileName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : media;

    // Upload
    const handleUpload = useCallback(async (files: FileList) => {
        setUploading(true);
        setUploadError(null);
        try {
            for (const file of Array.from(files)) {
                if (!file.type.startsWith("image/")) continue;
                await MediaController.uploadFile({ file, fileName: file.name.replace(/\.[^/.]+$/, "") });
            }
            mutate();
            setActiveTab("gallery");
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Erro ao fazer upload");
        } finally {
            setUploading(false);
        }
    }, [mutate]);

    // Seleção
    const toggleSelection = useCallback((item: Media) => {
        if (multiple) {
            setSelectedItems(prev => {
                const next = new Set(prev);
                next.has(item._id) ? next.delete(item._id) : next.add(item._id);
                return next;
            });
        } else {
            onSelect(item);
            onClose();
        }
    }, [multiple, onSelect, onClose]);

    const handleConfirmMultiple = useCallback(() => {
        if (onSelectMultiple) {
            onSelectMultiple(media.filter(m => selectedItems.has(m._id)));
        }
        onClose();
    }, [media, selectedItems, onSelectMultiple, onClose]);

    // URL Import
    const handleUrlPreview = useCallback(() => {
        if (!urlInput.trim()) {
            setUrlError("Digite uma URL válida");
            return;
        }
        try {
            new URL(urlInput);
            setUrlPreview(urlInput);
            setUrlError(null);
        } catch {
            setUrlError("URL inválida");
        }
    }, [urlInput]);

    const handleUrlImport = useCallback(async () => {
        if (!urlPreview) return;
        setUrlLoading(true);
        setUrlError(null);
        try {
            const response = await fetch(urlPreview);
            if (!response.ok) throw new Error("Falha ao baixar imagem");
            const blob = await response.blob();
            const fileName = `url-${Date.now()}.${blob.type.split("/")[1] || "jpg"}`;
            const file = new File([blob], fileName, { type: blob.type });
            const created = await MediaController.createMedia({
                data: { title: "Imagem importada", fileName },
                file
            });
            if (created) {
                mutate();
                if (!multiple) {
                    onSelect(created);
                    onClose();
                } else {
                    setActiveTab("gallery");
                    setUrlInput("");
                    setUrlPreview(null);
                }
            }
        } catch (err) {
            setUrlError(err instanceof Error ? err.message : "Erro ao importar imagem");
        } finally {
            setUrlLoading(false);
        }
    }, [urlPreview, multiple, onSelect, onClose, mutate]);

    if (!isOpen) return null;

    const tabs = [
        { id: "gallery" as const, label: "Galeria", icon: Images },
        { id: "upload" as const, label: "Upload", icon: Upload },
        { id: "url" as const, label: "URL", icon: LinkIcon },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl w-[95vw] h-[95vh] max-w-[1400px] flex flex-col border border-border shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Selecionar Mídia</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                                    ? "text-primary border-b-2 border-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {activeTab === "gallery" && (
                        <>
                            <div className="p-4 border-b border-border">
                                <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3">
                                    <Search className="w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar arquivos..."
                                        className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground flex-1"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : filteredMedia.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">
                                            {searchQuery ? "Nenhuma mídia encontrada" : "Biblioteca vazia"}
                                        </p>
                                        <button onClick={() => setActiveTab("upload")} className="mt-4 text-primary hover:underline">
                                            Fazer upload
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                        {filteredMedia.map((item) => (
                                            <button
                                                key={item._id}
                                                onClick={() => toggleSelection(item)}
                                                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-muted ${selectedItems.has(item._id)
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "border-transparent hover:border-primary/30"
                                                    }`}
                                            >
                                                {item.fileName && <Thumb fileName={item.fileName} alt={item.title} />}
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
                        </>
                    )}

                    {activeTab === "upload" && (
                        <div className="flex-1 p-6 flex flex-col items-center justify-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => e.target.files?.length && handleUpload(e.target.files)}
                                className="hidden"
                            />
                            <div
                                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files); }}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={`w-full max-w-md border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"} ${uploading ? "opacity-50 cursor-wait" : ""}`}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                                        <p className="text-foreground font-medium">Enviando...</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-foreground font-medium mb-2">Arraste arquivos aqui</p>
                                        <p className="text-muted-foreground text-sm">ou clique para selecionar</p>
                                    </>
                                )}
                            </div>
                            {uploadError && (
                                <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm">
                                    {uploadError}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "url" && (
                        <div className="flex-1 p-6 flex items-center justify-center">
                            <div className="max-w-xl w-full space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">URL da imagem</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            placeholder="https://exemplo.com/imagem.jpg"
                                            className="flex-1 bg-secondary rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none"
                                        />
                                        <Button onClick={handleUrlPreview} disabled={!urlInput.trim()} variant="secondary">
                                            Visualizar
                                        </Button>
                                    </div>
                                </div>
                                {urlError && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm">
                                        {urlError}
                                    </div>
                                )}
                                {urlPreview && (
                                    <div className="space-y-4">
                                        <div className="aspect-video relative rounded-xl overflow-hidden bg-muted border border-border">
                                            <Image src={urlPreview} alt="Preview" fill className="object-contain" unoptimized onError={() => setUrlError("Não foi possível carregar")} />
                                        </div>
                                        <Button onClick={handleUrlImport} loading={urlLoading} disabled={urlLoading} className="w-full" size="lg">
                                            {urlLoading ? "Importando..." : "Importar imagem"}
                                        </Button>
                                    </div>
                                )}
                                {!urlPreview && (
                                    <div className="text-center py-8">
                                        <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">Cole a URL de uma imagem para importar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {multiple && activeTab === "gallery" && (
                    <div className="p-4 border-t border-border flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{selectedItems.size} item(s) selecionado(s)</p>
                        <div className="flex gap-3">
                            <Button onClick={onClose} variant="secondary">Cancelar</Button>
                            <Button onClick={handleConfirmMultiple} disabled={selectedItems.size === 0}>Confirmar</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
