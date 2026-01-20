"use client";

import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";
import type { ArticleSummary } from "@/lib/articles/Article.model";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import CardTitle from "@/_components/CardTitle";
import PostListItem from "./PostListItem";

interface RecentPostsProps {
    posts: ArticleSummary[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle
                    title="Posts Recentes"
                    subtitle="Últimas publicações"
                    trailing={
                        <Link href="/admin/posts" className="text-primary text-sm font-normal hover:underline flex items-center gap-1">
                            Ver todos <ExternalLink className="w-3 h-3" />
                        </Link>
                    }
                />
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {posts.length > 0 ? posts.map((post) => (
                        <PostListItem key={post._id} post={post} />
                    )) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Nenhum post ainda</p>
                            <Link href="/admin/posts/new" className="text-primary text-sm hover:underline">
                                Criar primeiro post
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
