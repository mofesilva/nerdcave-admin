"use client";

import Link from "next/link";
import { Award, BarChart3 } from "lucide-react";
import { ArticleModel } from "@/lib/models/Article.model";

interface TopPostsProps {
    posts: ArticleModel[];
}

export default function TopPosts({ posts }: TopPostsProps) {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    return (
        <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-foreground">Top Performance</h2>
                    <p className="text-sm text-muted-foreground">Posts mais vistos</p>
                </div>
                <Award className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="space-y-3">
                {posts.length > 0 ? posts.map((post, index) => (
                    <Link
                        key={post._id}
                        href={`/admin/posts/${post._id}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                            index === 1 ? 'bg-zinc-300/20 text-zinc-400' :
                            index === 2 ? 'bg-orange-500/20 text-orange-500' :
                            'bg-muted text-muted-foreground'
                        }`}>
                            #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {post.readingTime || 1} min de leitura
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="font-bold text-foreground">{formatNumber(post.views || 0)}</p>
                            <p className="text-xs text-muted-foreground">views</p>
                        </div>
                    </Link>
                )) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Sem dados de performance ainda</p>
                    </div>
                )}
            </div>
        </div>
    );
}
