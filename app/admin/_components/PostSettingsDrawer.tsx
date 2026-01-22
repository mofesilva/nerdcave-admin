"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, FolderTree, Tag, Search, Calendar, Star, Eye, EyeOff, FileEdit, Clock } from "lucide-react";
import Image from "next/image";
import type { Category } from "@/lib/categories/Category.model";
import type { Tag as TagType } from "@/lib/tags/Tag.model";
import type { Media } from "@/lib/medias/Media.model";
import type { PostStatus } from "@/types";
import Select from "@/_components/Select";
import Button from "@/_components/Button";
import DateTimePicker from "@/_components/DateTimePicker";
import SegmentedControl from "@/_components/SegmentedControl";
import TagInput from "./TagInput";
import MediaPickerModal from "@/_components/MediaPickerModal";

interface PostSettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // Cover
    coverUrl: string | null;
    onSelectCover: () => void;
    onRemoveCover: () => void;
    // Category
    categoryId: string | null;
    onCategoryChange: (id: string | null) => void;
    categories: Category[];
    // Tags
    selectedTags: TagType[];
    onTagsChange: (tags: TagType[]) => void;
    // Status
    status: PostStatus;
    onStatusChange: (status: PostStatus) => void;
    // Featured
    isFeatured: boolean;
    onFeaturedChange: (featured: boolean) => void;
    // Schedule
    scheduledAt: string;
    onScheduledAtChange: (date: string) => void;
    // SEO
    seoTitle: string;
    onSeoTitleChange: (title: string) => void;
    seoDescription: string;
    onSeoDescriptionChange: (desc: string) => void;
    title: string; // for placeholder
}

export default function PostSettingsDrawer({
    isOpen,
    onClose,
    coverUrl,
    onSelectCover,
    onRemoveCover,
    categoryId,
    onCategoryChange,
    categories,
    selectedTags,
    onTagsChange,
    status,
    onStatusChange,
    isFeatured,
    onFeaturedChange,
    scheduledAt,
    onScheduledAtChange,
    seoTitle,
    onSeoTitleChange,
    seoDescription,
    onSeoDescriptionChange,
    title,
}: PostSettingsDrawerProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'seo'>('general');
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    // Controla renderização com animação
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
        } else if (shouldRender) {
            setIsClosing(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!shouldRender) return null;

    return (
        <>

            <div
                className={`fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in-0'
                    }`}
                onClick={onClose}
            />
            <div className={`fixed inset-y-0 right-0 z-50 h-full w-full max-w-md border-l bg-background shadow-lg transition-transform duration-300 flex flex-col ${isClosing ? 'translate-x-full' : 'translate-x-0 animate-in slide-in-from-right'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-semibold">Configurações do Post</h2>
                    <button
                        onClick={onClose}
                        className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Fechar</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4">
                    <SegmentedControl
                        options={[
                            { value: 'general', label: 'Geral' },
                            { value: 'seo', label: 'SEO' },
                        ]}
                        value={activeTab}
                        onChange={setActiveTab}
                        className="w-full"
                        height="h-10"
                        fullWidth
                    />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeTab === 'general' && (
                        <>
                            {/* Cover Image */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Imagem de Capa
                                </label>
                                {coverUrl ? (
                                    <div className="space-y-3">
                                        <div className="relative aspect-video rounded-md overflow-hidden border">
                                            <Image
                                                src={coverUrl}
                                                alt="Capa"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={onSelectCover}
                                                variant="secondary"
                                                size="md"
                                                className="flex-1 h-10"
                                            >
                                                Trocar
                                            </Button>
                                            <Button
                                                onClick={onRemoveCover}
                                                variant="danger"
                                                size="md"
                                                className="h-10"
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={onSelectCover}
                                        className="w-full aspect-video border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors"
                                    >
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Adicionar imagem de capa</span>
                                    </button>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Status
                                </label>
                                <Select
                                    value={status}
                                    onChange={(value) => onStatusChange(value as PostStatus)}
                                    options={[
                                        { value: 'draft', label: 'Rascunho', icon: FileEdit },
                                        { value: 'published', label: 'Publicado', icon: Eye },
                                        { value: 'scheduled', label: 'Agendado', icon: Clock },
                                    ]}
                                    label="Status"
                                    className="w-full h-10"
                                />
                            </div>

                            {/* Schedule Date */}
                            {status === 'scheduled' && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">
                                        Data de Publicação
                                    </label>
                                    <DateTimePicker
                                        value={scheduledAt}
                                        onChange={onScheduledAtChange}
                                        placeholder="Selecione data e hora"
                                    />
                                </div>
                            )}

                            {/* Category */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Categoria
                                </label>
                                <Select
                                    value={categoryId || ''}
                                    onChange={(value) => onCategoryChange(value || null)}
                                    placeholder="Selecione uma categoria"
                                    options={[
                                        { value: '', label: 'Sem categoria' },
                                        ...categories.map(cat => ({ value: cat._id, label: cat.name }))
                                    ]}
                                    label="Categoria"
                                    className="w-full h-10"
                                />
                            </div>

                            {/* Tags */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Tags
                                </label>
                                <TagInput
                                    selectedTags={selectedTags}
                                    onTagsChange={onTagsChange}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'seo' && (
                        <>
                            {/* SEO Title */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Título SEO
                                </label>
                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={(e) => onSeoTitleChange(e.target.value)}
                                    placeholder={title || 'Título para mecanismos de busca'}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {(seoTitle || title).length}/60 caracteres
                                </p>
                            </div>

                            {/* SEO Description */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Descrição SEO
                                </label>
                                <textarea
                                    value={seoDescription}
                                    onChange={(e) => onSeoDescriptionChange(e.target.value)}
                                    placeholder="Descrição para mecanismos de busca (recomendado: 150-160 caracteres)"
                                    rows={4}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {seoDescription.length}/160 caracteres
                                </p>
                            </div>

                            {/* Preview */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Prévia do Google
                                </label>
                                <div className="rounded-md border p-4 bg-card">
                                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                                        seusite.com › blog › post
                                    </div>
                                    <div className="text-lg text-blue-700 dark:text-blue-300 font-medium mb-1 line-clamp-1">
                                        {seoTitle || title || 'Título do post'}
                                    </div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                        {seoDescription || 'Adicione uma descrição para melhorar o SEO do seu post...'}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
