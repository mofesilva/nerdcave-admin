"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Star, Image as ImageIcon, X, Loader2, Calendar, Tag, FileEdit, Clock } from "lucide-react";
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
import RichTextEditor from "../../_components/RichTextEditor";
import Select from "@/_components/Select";
import Button from "@/_components/Button";
import IconButton from "@/_components/IconButton";
import DateTimePicker from "@/_components/DateTimePicker";
import TagInput from "../../_components/TagInput";
import Toolbar from "@/_components/Toolbar";
import MediaPickerModal from "@/_components/MediaPickerModal";

// Helper functions
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

export default function PostEditorPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const isNew = params.id === 'new';
    const postId = isNew ? null : params.id as string;

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
    const [tags, setTags] = useState<TagType[]>([]);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
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
            // Retry para imagens recém-uploaded que podem demorar a propagar
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

    async function fetchMetadata() {
        try {
            const [cats, tgs] = await Promise.all([
                CategoriesController.getAllCategories(),
                TagsController.getAllTags(),
            ]);
            setCategories(cats);
            setTags(tgs);
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
            // Carregar objetos Tag completos
            const postTags = await Promise.all(
                article.tags.map(tagId => TagsController.getTagById({ id: tagId }))
            );
            setSelectedTags(postTags.filter((tag): tag is TagType => tag !== null));
            setStatus(article.status);
            setIsFeatured(article.isFeatured);
            setSeoTitle(article.seoTitle || '');
            setSeoDescription(article.seoDescription || '');
            setScheduledAt(article.scheduledAt || '');

            // Carregar imagem de capa
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

    async function openMediaPicker() {
        setShowMediaPicker(true);
    }

    async function selectCoverImage(media: Media) {
        setCoverMediaId(media._id);
        const url = await loadImageUrl(media.fileName);
        setCoverUrl(url);
        setShowMediaPicker(false);
    }

    function removeCover() {
        setCoverMediaId(null);
        setCoverUrl(null);
    }

    // Handler para inserir imagem no editor
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

    function handleTitleChange(value: string) {
        setTitle(value);
    }

    async function handleSave() {
        if (!title.trim()) {
            setError('Título é obrigatório');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // Gera slug automaticamente
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
                    //photo: user?.informations?.photo || undefined, // futuro: vem de DBUser.informations.photo
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

    async function handlePublish() {
        setStatus('published');
        // Salvar será chamado depois
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-3">
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

                    <Button
                        onClick={handleSave}
                        icon={Save}
                        loading={saving}
                    >
                        Salvar
                    </Button>
                </Toolbar>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Title */}
                    <div className="bg-card rounded-md border border-border p-4">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Título do post
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Digite o título do post"
                            className="w-full text-lg font-semibold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Content */}
                    <div className="bg-card rounded-md border border-border overflow-hidden">
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Escreva o conteúdo do seu post..."
                            onInsertImage={handleEditorInsertImage}
                        />
                    </div>

                    {/* SEO */}
                    <div className="bg-card rounded-md border border-border p-6">
                        <h3 className="font-semibold text-foreground mb-4">SEO</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Título SEO
                                </label>
                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    placeholder={title || 'Título para mecanismos de busca'}
                                    className="w-full bg-transparent border border-border rounded-md p-3 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Descrição SEO
                                </label>
                                <textarea
                                    value={seoDescription}
                                    onChange={(e) => setSeoDescription(e.target.value)}
                                    placeholder={'Descrição para mecanismos de busca'}
                                    rows={3}
                                    className="w-full bg-transparent border border-border rounded-md p-3 text-foreground placeholder:text-muted-foreground resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-3">
                    {/* Cover Image */}
                    <div className="bg-card rounded-md border border-border p-6">
                        <h3 className="font-semibold text-foreground mb-4">Imagem de Capa</h3>
                        {coverUrl ? (
                            <div className="relative aspect-video rounded-md overflow-hidden">
                                <Image
                                    src={coverUrl}
                                    alt="Capa"
                                    fill
                                    className="object-cover"
                                />
                                <IconButton
                                    icon={<X />}
                                    onClick={removeCover}
                                    colorClass="text-white"
                                    hoverClass="hover:bg-black/70"
                                    className="absolute top-2 right-2 bg-black/50 p-1"
                                />
                            </div>
                        ) : (
                            <div
                                onClick={openMediaPicker}
                                className="w-full aspect-video border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Selecionar imagem</span>
                            </div>
                        )}
                        {coverUrl && (
                            <Button
                                onClick={openMediaPicker}
                                variant="ghost"
                                size="sm"
                                className="w-full mt-3"
                            >
                                Trocar imagem
                            </Button>
                        )}
                    </div>

                    {/* Category & Tags */}
                    <div className="bg-card rounded-md border border-border p-6">
                        <h3 className="font-semibold text-foreground mb-4">Categoria</h3>
                        <Select
                            value={categoryId || ''}
                            onChange={(value) => setCategoryId(value || null)}
                            placeholder="Sem categoria"
                            options={[
                                { value: '', label: 'Sem categoria' },
                                ...categories.map(cat => ({ value: cat._id, label: cat.name }))
                            ]}
                            className="h-13"
                        />
                    </div>

                    {/* Tags */}
                    <TagInput
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                    />

                    {/* Schedule */}
                    {status === 'scheduled' && (
                        <div className="bg-card rounded-md border border-border p-6">
                            <h3 className="font-semibold text-foreground mb-4">Agendar Publicação</h3>
                            <DateTimePicker
                                value={scheduledAt}
                                onChange={(value) => setScheduledAt(value)}
                                placeholder="Selecione data e hora"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Media Picker Modal for Cover */}
            <MediaPickerModal
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={selectCoverImage}
            />

            {/* Media Picker Modal for Editor */}
            <MediaPickerModal
                isOpen={showEditorMediaPicker}
                onClose={() => { setShowEditorMediaPicker(false); setEditorImageCallback(null); }}
                onSelect={selectEditorImage}
            />
        </div>
    );
}
