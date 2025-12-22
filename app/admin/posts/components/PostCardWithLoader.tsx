"use client";

import { useState, useEffect, useMemo } from "react";
import { useApiClient, MediaStorageModule } from "@cappuccino/web-sdk";
import Image from "next/image";
import Link from "next/link";
import { FileText, Star, Edit2, Trash2, Eye, EyeOff, Calendar, Loader2 } from "lucide-react";
import IconButton from "@/components/IconButton";
import { ArticleModel } from "@/lib/models/Article.model";
import { MediaModel } from "@/lib/models/Media.model";

const APP_NAME = "nerdcave-link-tree";

interface PostCardWithLoaderProps {
    article: ArticleModel;
    media?: MediaModel;
    categoryName: string;
    variant: "list" | "grid";
    onDelete: (id: string) => void;
    onTogglePublish: (article: ArticleModel) => void;
    onToggleFeatured: (article: ArticleModel) => void;
    formatDate: (dateStr?: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
}

export function PostCardWithLoader({
    article,
    media,
    categoryName,
    variant,
    onDelete,
    onTogglePublish,
    onToggleFeatured,
    formatDate,
    getStatusBadge,
}: PostCardWithLoaderProps) {
    const apiClient = useApiClient();
    const mediastorage = useMemo(() => {
        if (!apiClient) return null;
        return new MediaStorageModule(apiClient);
    }, [apiClient]);

    const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(!!media?.fileName);

    // Carregar imagem quando o componente monta
    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            if (!media?.fileName || !mediastorage) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await mediastorage.download(APP_NAME, media.fileName);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                if (isMounted) {
                    setCoverUrl(url);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Erro ao baixar imagem:', media.fileName, err);
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            if (coverUrl) {
                URL.revokeObjectURL(coverUrl);
            }
        };
    }, [media?.fileName, mediastorage]);

    // Skeleton para modo lista
    if (isLoading && variant === "list") {
        return (
            <div className="bg-card rounded-xl border border-border p-4 flex gap-4 animate-pulse">
                <div className="w-32 h-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </div>
                <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted rounded-full" />
                        <div className="h-5 w-20 bg-muted rounded" />
                    </div>
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
            </div>
        );
    }

    // Skeleton para modo grid
    if (isLoading && variant === "grid") {
        return (
            <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                </div>
                <div className="p-4 space-y-3">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-5 w-full bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                </div>
            </div>
        );
    }

    // Modo lista
    if (variant === "list") {
        return (
            <div className="bg-card rounded-xl border border-border p-4 flex gap-4 hover:border-primary/30 transition cursor-pointer">
                {/* Cover Image */}
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center relative">
                    {coverUrl ? (
                        <Image
                            src={coverUrl}
                            alt={article.title}
                            fill
                            quality={85}
                            sizes="128px"
                            className="object-cover"
                        />
                    ) : (
                        <FileText className="w-8 h-8 text-muted-foreground" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {getStatusBadge(article.status)}
                                {article.isFeatured && (
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {categoryName}
                                </span>
                            </div>
                            <h3 className="font-semibold text-foreground truncate">{article.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {article.getExcerpt(100) || 'Sem resumo'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <IconButton
                                icon={<Star className={article.isFeatured ? 'fill-primary' : ''} />}
                                onClick={() => onToggleFeatured(article)}
                                colorClass={article.isFeatured ? 'text-primary' : 'text-muted-foreground'}
                                hoverClass={article.isFeatured ? 'hover:bg-primary/30' : 'hover:bg-muted'}
                                title={article.isFeatured ? 'Remover destaque' : 'Destacar'}
                            />
                            <IconButton
                                icon={article.status === 'published' ? <Eye /> : <EyeOff />}
                                onClick={() => onTogglePublish(article)}
                                colorClass={article.status === 'published' ? 'text-primary' : 'text-muted-foreground'}
                                hoverClass={article.status === 'published' ? 'hover:bg-primary/30' : 'hover:bg-muted'}
                                title={article.status === 'published' ? 'Despublicar' : 'Publicar'}
                            />
                            <Link
                                href={`/admin/posts/${article._id}`}
                                className="p-2 rounded-lg bg-card hover:bg-muted text-muted-foreground transition"
                                title="Editar"
                            >
                                <Edit2 className="w-4 h-4" />
                            </Link>
                            <IconButton
                                icon={<Trash2 />}
                                onClick={() => onDelete(article._id)}
                                colorClass="text-muted-foreground"
                                hoverClass="hover:bg-red-500/20 hover:text-red-400"
                                title="Deletar"
                            />
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {article.status === 'published' ? formatDate(article.publishedAt) : 'Não publicado'}
                        </span>
                        <span>{article.readingTime} min de leitura</span>
                    </div>
                </div>
            </div>
        );
    }

    // Modo grid
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition group">
            {/* Cover Image */}
            <div className="aspect-video bg-muted flex items-center justify-center relative">
                {coverUrl ? (
                    <Image
                        src={coverUrl}
                        alt={article.title}
                        fill
                        quality={85}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                    />
                ) : (
                    <FileText className="w-12 h-12 text-muted-foreground" />
                )}
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <IconButton
                        icon={<Star className={article.isFeatured ? 'fill-yellow-400' : ''} />}
                        onClick={() => onToggleFeatured(article)}
                        colorClass={article.isFeatured ? 'text-yellow-400' : 'text-white'}
                        hoverClass="hover:bg-white/20"
                        title={article.isFeatured ? 'Remover destaque' : 'Destacar'}
                    />
                    <IconButton
                        icon={article.status === 'published' ? <Eye /> : <EyeOff />}
                        onClick={() => onTogglePublish(article)}
                        colorClass={article.status === 'published' ? 'text-green-400' : 'text-white'}
                        hoverClass="hover:bg-white/20"
                        title={article.status === 'published' ? 'Despublicar' : 'Publicar'}
                    />
                    <Link
                        href={`/admin/posts/${article._id}`}
                        className="p-2 rounded-lg text-white hover:bg-white/20 transition"
                        title="Editar"
                    >
                        <Edit2 className="w-5 h-5" />
                    </Link>
                    <IconButton
                        icon={<Trash2 />}
                        onClick={() => onDelete(article._id)}
                        colorClass="text-white"
                        hoverClass="hover:bg-red-500/50 hover:text-red-300"
                        title="Deletar"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(article.status)}
                    {article.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                </div>
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.getExcerpt(80) || 'Sem resumo'}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span>{categoryName}</span>
                    <span>•</span>
                    <span>{article.readingTime} min</span>
                </div>
            </div>
        </div>
    );
}
