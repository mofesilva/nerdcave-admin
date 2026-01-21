"use client";

import { Star, Trash2, Eye, EyeOff } from "lucide-react";
import IconButton from "@/_components/IconButton";
import type { Article } from "@/lib/articles/Article.model";

interface PostCardActionsRowProps {
    article: Article;
    variant: "list" | "grid";
    onDelete: (id: string) => void;
    onTogglePublish: (article: Article) => void;
    onToggleFeatured: (article: Article) => void;
}

export function PostCardActionsRow({
    article,
    variant,
    onDelete,
    onTogglePublish,
    onToggleFeatured,
}: PostCardActionsRowProps) {
    const isPublished = article.status === 'published';
    const isFeatured = article.isFeatured;

    if (variant === "list") {
        return (
            <div className="hidden sm:flex items-center gap-1 shrink-0" onClick={(e) => e.preventDefault()}>
                <IconButton
                    icon={<Star className={isFeatured ? 'fill-primary' : ''} />}
                    onClick={(e) => { e?.preventDefault(); onToggleFeatured(article); }}
                    colorClass={isFeatured ? 'text-primary' : 'text-muted-foreground'}
                    hoverClass={isFeatured ? 'hover:bg-primary/30' : 'hover:bg-muted'}
                    title={isFeatured ? 'Remover destaque' : 'Destacar'}
                />
                <IconButton
                    icon={isPublished ? <Eye /> : <EyeOff />}
                    onClick={(e) => { e?.preventDefault(); onTogglePublish(article); }}
                    colorClass={isPublished ? 'text-primary' : 'text-muted-foreground'}
                    hoverClass={isPublished ? 'hover:bg-primary/30' : 'hover:bg-muted'}
                    title={isPublished ? 'Despublicar' : 'Publicar'}
                />
                <IconButton
                    icon={<Trash2 />}
                    onClick={(e) => { e?.preventDefault(); onDelete(article._id); }}
                    colorClass="text-muted-foreground"
                    hoverClass="hover:bg-red-500/20 hover:text-red-400"
                    title="Deletar"
                />
            </div>
        );
    }

    // Grid variant
    return (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" onClick={(e) => e.preventDefault()}>
            <IconButton
                icon={<Star className={isFeatured ? 'fill-primary' : ''} />}
                onClick={(e) => { e?.preventDefault(); onToggleFeatured(article); }}
                colorClass={isFeatured ? 'text-primary' : 'text-white'}
                hoverClass="hover:bg-primary/20"
                title={isFeatured ? 'Remover destaque' : 'Destacar'}
            />
            <IconButton
                icon={isPublished ? <Eye /> : <EyeOff />}
                onClick={(e) => { e?.preventDefault(); onTogglePublish(article); }}
                colorClass={isPublished ? 'text-primary' : 'text-white'}
                hoverClass="hover:bg-primary/20"
                title={isPublished ? 'Despublicar' : 'Publicar'}
            />
            <IconButton
                icon={<Trash2 />}
                onClick={(e) => { e?.preventDefault(); onDelete(article._id); }}
                colorClass="text-white"
                hoverClass="hover:bg-red-500/50 hover:text-red-300"
                title="Deletar"
            />
        </div>
    );
}
