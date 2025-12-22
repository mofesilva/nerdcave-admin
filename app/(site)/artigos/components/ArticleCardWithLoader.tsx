"use client";

import { useState, useEffect, useMemo } from "react";
import { useApiClient, MediaStorageModule } from "@cappuccino/web-sdk";
import { ArticleCard } from "../../../components/blog/ArticleCard";
import { Loader2 } from "lucide-react";
import { MediaModel } from "@/lib/models/Media.model";

const APP_NAME = "nerdcave-link-tree";

interface ArticleCardWithLoaderProps {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    categoryName: string;
    categoryColor: string;
    categoryId: string;
    publishedAt: string;
    readingTime: number;
    media?: MediaModel;
    variant?: "default" | "horizontal";
}

export function ArticleCardWithLoader({
    _id,
    title,
    slug,
    excerpt,
    categoryName,
    categoryColor,
    categoryId,
    publishedAt,
    readingTime,
    media,
    variant = "default",
}: ArticleCardWithLoaderProps) {
    const apiClient = useApiClient();
    const mediastorage = useMemo(() => {
        if (!apiClient) return null;
        return new MediaStorageModule(apiClient);
    }, [apiClient]);

    const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(!!media?.fileName);
    const [hasError, setHasError] = useState(false);

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
                    setHasError(true);
                    setIsLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            // Limpar object URL ao desmontar
            if (coverUrl) {
                URL.revokeObjectURL(coverUrl);
            }
        };
    }, [media?.fileName, mediastorage]);

    // Skeleton loader enquanto carrega
    if (isLoading) {
        if (variant === "horizontal") {
            return (
                <div className="flex flex-col sm:flex-row bg-card rounded-xl overflow-hidden border border-border animate-pulse">
                    <div className="w-full sm:w-48 md:w-64 aspect-16/10 sm:aspect-auto sm:h-40 bg-muted flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                    </div>
                    <div className="flex flex-col flex-1 p-4 gap-3">
                        <div className="h-5 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-1/4 mt-auto" />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col bg-card rounded-xl overflow-hidden border border-border animate-pulse">
                <div className="w-full aspect-16/10 bg-muted flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                </div>
                <div className="flex flex-col p-4 gap-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/4 mt-auto" />
                </div>
            </div>
        );
    }

    return (
        <ArticleCard
            _id={_id}
            title={title}
            slug={slug}
            excerpt={excerpt}
            coverUrl={coverUrl}
            categoryName={categoryName}
            categoryColor={categoryColor}
            publishedAt={publishedAt}
            readingTime={readingTime}
            variant={variant}
        />
    );
}
