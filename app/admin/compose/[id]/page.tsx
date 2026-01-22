"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Settings, Image as ImageIcon, Loader2, X, Star, FileEdit, Eye, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@cappuccino/web-sdk";
import * as ArticlesController from "@/lib/articles/Article.controller";
import * as CategoriesController from "@/lib/categories/Category.controller";
import * as TagsController from "@/lib/tags/Tag.controller";
import * as MediaController from "@/lib/medias/Media.controller";
import type { Article } from "@/lib/articles/Article.model";
import type { Category } from "@/lib/categories/Category.model";
import type { Tag as TagType } from "@/lib/tags/Tag.model";
import type { Media } from "@/lib/medias/Media.model";
import type { PostStatus } from "@/types";
import { TiptapContent, EMPTY_TIPTAP_CONTENT, extractTextFromTiptap } from "@/types/TiptapContent.types";
import MediumStyleEditor from "@/app/admin/_components/MediumStyleEditor";
import PostSettingsDrawer from "@/app/admin/_components/PostSettingsDrawer";
import Toolbar from "@/_components/Toolbar";
import IconButton from "@/_components/IconButton";
import Button from "@/_components/Button";
import Select from "@/_components/Select";
import MediaPickerModal from "@/_components/MediaPickerModal";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

function calculateReadingTime(content: TiptapContent | null): number {
    const wordsPerMinute = 200;
    const text = extractTextFromTiptap(content);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default function PostComposePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const isNew = params.id === 'new';
    const postId = isNew ? null : params.id as string;
    const titleRef = useRef<HTMLTextAreaElement>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<TiptapContent | null>(EMPTY_TIPTAP_CONTENT);
    const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
    const [status, setStatus] = useState<PostStatus>('draft');
    const [isFeatured, setIsFeatured] = useState(false);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');

    // UI state
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
    const [showCoverPicker, setShowCoverPicker] = useState(false);
    const [showEditorMediaPicker, setShowEditorMediaPicker] = useState(false);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [editorImageCallback, setEditorImageCallback] = useState<((url: string, alt: string) => void) | null>(null);

    const loadImageUrl = useCallback(async (fileName: string, retries = 3): Promise<string | null> => {
        if (imageUrls[fileName]) return imageUrls[fileName];
        try {
            const response = await MediaController.downloadFile({ fileName });
            if (!response) return null;
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setImageUrls(prev => ({ ...prev, [fileName]: url }));
            return url;
        } catch (err) {
            console.error('Erro ao baixar imagem:', fileName, err);
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return loadImageUrl(fileName, retries - 1);
            }
            return null;
        }
    }, [imageUrls]);

    useEffect(() => {
        fetchMetadata();
        if (!isNew && postId) {
            fetchPost();
        }
    }, [postId, isNew]);

    // Auto-resize título quando carrega
    useEffect(() => {
        if (titleRef.current && title) {
            titleRef.current.style.height = '0';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [title]);

    async function fetchMetadata() {
        try {
            const cats = await CategoriesController.getAllCategories();
            setCategories(cats);
        } catch (err) {
            console.error('Erro ao carregar metadados:', err);
        }
    }

    async function fetchPost() {
        if (!postId) return;
        try {
            setLoading(true);
            const article = await ArticlesController.getArticleById({ id: postId });
            if (!article) {
                router.push('/admin/posts');
                return;
            }

            setTitle(article.title);
            setContent(article.content);
            setCoverMediaId(article.coverMedia?._id || null);
            setCategoryId(article.category || null);
            const postTags = await Promise.all(
                article.tags.map(tagId => TagsController.getTagById({ id: tagId }))
            );
            setSelectedTags(postTags.filter((tag): tag is TagType => tag !== null));
            setStatus(article.status);
            setIsFeatured(article.isFeatured);
            setSeoTitle(article.seoTitle || '');
            setSeoDescription(article.seoDescription || '');
            setScheduledAt(article.scheduledAt || '');

            if (article.coverMedia) {
                const url = await loadImageUrl(article.coverMedia.fileName);
                setCoverUrl(url);
            }
        } catch (err) {
            setError('Erro ao carregar post');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function selectCoverImage(media: Media) {
        setCoverMediaId(media._id);
        const url = await loadImageUrl(media.fileName);
        setCoverUrl(url);
        setShowCoverPicker(false);
    }

    function removeCover() {
        setCoverMediaId(null);
        setCoverUrl(null);
    }

    async function handleEditorInsertImage(callback: (url: string, alt: string) => void) {
        setEditorImageCallback(() => callback);
        setShowEditorMediaPicker(true);
    }

    async function selectEditorImage(media: Media) {
        if (editorImageCallback) {
            const url = await loadImageUrl(media.fileName);
            if (url) {
                editorImageCallback(url, media.title || media.fileName);
            }
        }
        setShowEditorMediaPicker(false);
        setEditorImageCallback(null);
    }

    async function handleSave() {
        if (!title.trim()) {
            setError('Título é obrigatório');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const autoSlug = generateSlug(title);
            const data = {
                title,
                slug: autoSlug,
                content,
                coverMediaId: coverMediaId || undefined,
                category: categoryId || undefined,
                tags: selectedTags.map(tag => tag._id),
                status,
                isFeatured,
                seoTitle: seoTitle || undefined,
                seoDescription: seoDescription || undefined,
                scheduledAt: scheduledAt || undefined,
                readingTime: calculateReadingTime(content),
                author: {
                    name: user?.name || user?.email || 'Anônimo',
                    photo: (user?.informations as Record<string, unknown>)?.photo as string || undefined,
                },
            };

            if (isNew) {
                await ArticlesController.createArticle({ data });
            } else if (postId) {
                await ArticlesController.updateArticle({ id: postId, updates: data });
            }

            router.push('/admin/posts');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar');
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [title, content, status, selectedTags, categoryId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/posts" className="p-2 rounded-md bg-card border border-border hover:bg-muted transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {isNew ? 'Novo Post' : 'Editar Post'}
                        </h1>
                    </div>
                </div>

                <Toolbar hideSearch>
                    <IconButton
                        icon={<Star className={isFeatured ? 'fill-yellow-400' : ''} />}
                        onClick={() => setIsFeatured(!isFeatured)}
                        colorClass={isFeatured ? 'text-yellow-400' : 'text-muted-foreground'}
                        hoverClass={isFeatured ? 'hover:bg-yellow-500/30' : 'hover:bg-muted'}
                        className={`h-full aspect-square rounded-md ${isFeatured ? 'bg-yellow-500/20' : 'bg-card border border-border'}`}
                        title={isFeatured ? 'Remover destaque' : 'Destacar'}
                    />

                    <Select
                        value={status}
                        onChange={(value) => setStatus(value as PostStatus)}
                        options={[
                            { value: 'draft', label: 'Rascunho', icon: FileEdit },
                            { value: 'published', label: 'Publicar', icon: Eye },
                            { value: 'scheduled', label: 'Agendar', icon: Clock },
                        ]}
                        label="Status"
                    />

                    <IconButton
                        icon={<Settings />}
                        onClick={() => setShowSettingsDrawer(true)}
                        title="Configurações"
                        className="bg-card border border-border h-full aspect-square"
                    />

                    <Button
                        onClick={handleSave}
                        icon={Save}
                        loading={saving}
                        size="auto"
                    >
                        {status === 'published' ? 'Publicar' : status === 'scheduled' ? 'Agendar' : 'Salvar'}
                    </Button>
                </Toolbar>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/20 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div>
                {/* Cover Image */}
                {coverUrl ? (
                    <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8 group">
                        <Image
                            src={coverUrl}
                            alt="Capa"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCoverPicker(true)}
                                    className="px-4 py-2 bg-white/90 text-black rounded-lg text-sm font-medium hover:bg-white transition"
                                >
                                    Trocar capa
                                </button>
                                <button
                                    onClick={removeCover}
                                    className="p-2 bg-white/90 text-black rounded-lg hover:bg-white transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowCoverPicker(true)}
                        className="w-full aspect-[21/9] rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition flex flex-col items-center justify-center gap-3 mb-8 group"
                    >
                        <ImageIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary/70 transition" />
                        <span className="text-muted-foreground group-hover:text-foreground transition">
                            Adicionar imagem de capa
                        </span>
                    </button>
                )}

                {/* Title & Editor - Centralized */}
                <div className="max-w-4xl mx-auto">
                    {/* Title */}
                    <textarea
                        ref={titleRef}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            // Auto-resize
                            if (titleRef.current) {
                                titleRef.current.style.height = '0';
                                titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
                            }
                        }}
                        placeholder="Título do seu post"
                        className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/50 mb-8 leading-tight"
                        style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: '1.2em', height: 'auto' }}
                    />

                    {/* Editor */}
                    <MediumStyleEditor
                        content={content}
                        onChange={setContent}
                        onInsertImage={handleEditorInsertImage}
                        placeholder="Conte sua história..."
                    />
                </div>
            </div>

            {/* Settings Drawer */}
            <PostSettingsDrawer
                isOpen={showSettingsDrawer}
                onClose={() => setShowSettingsDrawer(false)}
                coverUrl={coverUrl}
                onSelectCover={() => { setShowSettingsDrawer(false); setShowCoverPicker(true); }}
                onRemoveCover={removeCover}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                categories={categories}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                status={status}
                onStatusChange={setStatus}
                isFeatured={isFeatured}
                onFeaturedChange={setIsFeatured}
                scheduledAt={scheduledAt}
                onScheduledAtChange={setScheduledAt}
                seoTitle={seoTitle}
                onSeoTitleChange={setSeoTitle}
                seoDescription={seoDescription}
                onSeoDescriptionChange={setSeoDescription}
                title={title}
            />

            {/* Media Picker Modals */}
            <MediaPickerModal
                isOpen={showCoverPicker}
                onClose={() => setShowCoverPicker(false)}
                onSelect={selectCoverImage}
            />
            <MediaPickerModal
                isOpen={showEditorMediaPicker}
                onClose={() => { setShowEditorMediaPicker(false); setEditorImageCallback(null); }}
                onSelect={selectEditorImage}
            />
        </div>
    );
}
