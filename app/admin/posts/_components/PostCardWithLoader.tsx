"use client";

import Link from "next/link";
import {
    PostCoverImage,
    PostCardActionsRow,
    PostCardTitle,
    PostCardMetaRow,
    PostCardExcerpt,
} from ".";
import type { Article } from "@/lib/articles/Article.model";
import type { Media } from "@/lib/medias/Media.model";
import * as MediaController from "@/lib/medias/Media.controller";

interface PostCardWithLoaderProps {
    article: Article;
    media?: Media;
    categoryName: string;
    variant: "list" | "grid";
    onDelete: (id: string) => void;
    onTogglePublish: (article: Article) => void;
    onToggleFeatured: (article: Article) => void;
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
    const coverUrl = media?.fileName
        ? MediaController.getMediaUrl({ fileName: media.fileName })
        : '';

    // Modo lista
    if (variant === "list") {
        return (
            <Link
                href={`/admin/compose/${article._id}`}
                className="bg-card rounded-md border border-border p-3 sm:p-4 flex gap-3 sm:gap-4 hover:border-primary/30 transition cursor-pointer"
            >
                <PostCoverImage coverUrl={coverUrl} title={article.title} variant="list" />
                <div className="flex-1 min-w-0 flex flex-col justify-start">
                    <div className="flex items-center justify-between gap-1">
                        <PostCardTitle title={article.title} variant="list" />
                        <PostCardActionsRow
                            article={article}
                            variant="list"
                            onDelete={onDelete}
                            onTogglePublish={onTogglePublish}
                            onToggleFeatured={onToggleFeatured}
                        />
                    </div>
                    <PostCardMetaRow
                        status={article.status}
                        publishedAt={article.publishedAt}
                        readingTime={article.readingTime}
                        formatDate={formatDate}
                        variant="list"
                    />
                    <PostCardExcerpt content={article.content} maxLength={500} variant="list" />

                    {/* Meta */}
                    <div className="flex items-center gap-2 sm:gap-3 mt-auto pt-1 text-xs text-muted-foreground">
                        {getStatusBadge(article.status)}
                        <span className="px-2 py-1 text-[10px] rounded-full bg-primary/20 text-primary">
                            {categoryName}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // Modo grid
    return (
        <Link
            href={`/admin/compose/${article._id}`}
            className="bg-card rounded-md border border-border overflow-hidden hover:border-primary/30 transition group block"
        >
            {/* Cover Image */}
            <div className="relative">
                <PostCoverImage coverUrl={coverUrl} title={article.title} variant="grid" />
                {/* Overlay com ações */}
                <PostCardActionsRow
                    article={article}
                    variant="grid"
                    onDelete={onDelete}
                    onTogglePublish={onTogglePublish}
                    onToggleFeatured={onToggleFeatured}
                />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col h-[180px]">
                <PostCardTitle title={article.title} variant="grid" />

                {/* Date & Reading Time */}
                <PostCardMetaRow
                    status={article.status}
                    publishedAt={article.publishedAt}
                    readingTime={article.readingTime}
                    formatDate={formatDate}
                    variant="grid"
                />

                <PostCardExcerpt content={article.content} maxLength={200} variant="grid" />

                {/* Badges */}
                <div className="flex items-center gap-2 mt-auto pt-2">
                    {getStatusBadge(article.status)}
                    <span className="px-2 py-1 text-[10px] rounded-full bg-primary/20 text-primary">
                        {categoryName}
                    </span>
                </div>
            </div>
        </Link>
    );
}
