"use client";

import { getExcerpt, TiptapContent } from "@/lib/utils";

interface PostCardExcerptProps {
    content: TiptapContent | null;
    maxLength: number;
    variant: "list" | "grid";
}

export function PostCardExcerpt({ content, maxLength, variant }: PostCardExcerptProps) {
    const excerpt = getExcerpt(content, maxLength) || 'Sem resumo';

    if (variant === "list") {
        return (
            <p className="hidden sm:line-clamp-3 text-sm text-muted-foreground mt-1 w-1/2">
                {excerpt}
            </p>
        );
    }

    return (
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {excerpt}
        </p>
    );
}
