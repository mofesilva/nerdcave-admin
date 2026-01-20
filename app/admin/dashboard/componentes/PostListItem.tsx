"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ArticleSummary } from "@/lib/articles/Article.model";

interface PostListItemProps {
    post: ArticleSummary;
    href?: string;
}

export default function PostListItem({ post, href }: PostListItemProps) {
    const linkHref = href || `/admin/posts/${post._id}`;

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
                <Badge
                    variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'outline'}
                    className="text-xs py-0"
                >
                    {post.status === 'published' ? 'Publicado' : post.status === 'draft' ? 'Rascunho' : 'Agendado'}
                </Badge>
            </div>
        </Link>
    );
}
