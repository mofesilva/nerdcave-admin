"use client";

import Link from "next/link";
import { FileText, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/articles/Article.model";

interface PostListItemProps {
    post: Article;
    href?: string;
}

export default function PostListItem({ post, href }: PostListItemProps) {
    const linkHref = href || `/admin/compose/${post._id}`;

    return (
        <Link
            href={linkHref}
            className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors group"
        >
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                        variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'outline'}
                        className="text-xs py-0"
                    >
                        {post.status === 'published' ? 'Publicado' : post.status === 'draft' ? 'Rascunho' : 'Agendado'}
                    </Badge>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime || 1} min</span>
                </div>
            </div>
            {post.isFeatured && (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
            )}
        </Link>
    );
}
