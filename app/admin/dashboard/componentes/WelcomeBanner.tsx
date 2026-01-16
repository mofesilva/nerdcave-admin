"use client";

import Link from "next/link";
import { Zap, FileText, Image as ImageIcon } from "lucide-react";

interface WelcomeBannerProps {
    publishedPosts: number;
    totalViews: string;
}

export default function WelcomeBanner({ publishedPosts, totalViews }: WelcomeBannerProps) {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-md p-8 text-primary-foreground">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6" />
                    <span className="text-sm font-medium opacity-90">Nerdcave Hub</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta! 👋</h1>
                <p className="text-primary-foreground/80 max-w-xl">
                    Seu hub está com <span className="font-semibold text-white">{publishedPosts} posts publicados</span> e
                    <span className="font-semibold text-white"> {totalViews} visualizações</span> no total.
                </p>

                <div className="flex gap-3 mt-6">
                    <Link
                        href="/admin/posts/new"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-all"
                    >
                        <FileText className="w-4 h-4" />
                        Novo Post
                    </Link>
                    <Link
                        href="/admin/media"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-all"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Upload Mídia
                    </Link>
                </div>
            </div>
        </div>
    );
}
