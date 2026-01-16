"use client";

import Link from "next/link";
import { FileText, Clock, Star, ExternalLink } from "lucide-react";
import type { Article } from "@/lib/articles/Article.model";
import CardTitleSection from "@/_components/CardTitleSection";

interface RecentPostsProps {
    posts: Article[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
    return (
        <div className="bg-card rounded-md border border-border p-6">
            <CardTitleSection
                title="Posts Recentes"
                subtitle="Últimas publicações"
                trailing={
                    <Link href="/admin/posts" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        Ver todos <ExternalLink className="w-3 h-3" />
                    </Link>
                }
            />

            <div className="space-y-3">
                {posts.length > 0 ? posts.map((post) => (
                    <Link key={post._id} href={`/admin/posts/${post._id}`} className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors group">
                        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className={`px-1.5 py-0.5 rounded ${post.status === 'published' ? 'bg-primary/10 text-primary' :
                                    post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {post.status === 'published' ? 'Publicado' : post.status === 'draft' ? 'Rascunho' : 'Agendado'}
                                </span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>{post.readingTime || 1} min</span>
                            </div>
                        </div>
                        {post.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                        )}
                    </Link>
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
        </div>
    );
}
