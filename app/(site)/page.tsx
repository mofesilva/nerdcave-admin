"use client";

import { useState, useEffect, useRef } from "react";
import { HeroCarousel } from "../components/blog/HeroCarousel";
import { ArticleCard } from "../components/blog/ArticleCard";
import { AlbumCard } from "../components/blog/AlbumCard";
import { SectionHeader } from "../components/blog/SectionHeader";
import * as ArticleController from "@/lib/articles/Article.controller";
import * as CategoryController from "@/lib/categories/Category.controller";
import * as MediaController from "@/lib/medias/Media.controller";
import * as AlbumController from "@/lib/albums/Album.controller";
import type { Category } from "@/lib/categories/Category.model";
import { useAutoLogin } from "@/lib/contexts/AutoLoginContext";

interface HeroArticle {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverUrl?: string;
    categoryName?: string;
}

interface ArticleCardData {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverUrl?: string;
    categoryName?: string;
    categoryColor?: string;
    publishedAt?: string;
    readingTime?: number;
}

interface AlbumCardData {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    coverUrl?: string;
    photoCount: number;
}

export default function HomePage() {
    const { isReady: isLoginReady } = useAutoLogin();
    const hasFetched = useRef(false);

    const [featuredArticles, setFeaturedArticles] = useState<HeroArticle[]>([]);
    const [recentArticles, setRecentArticles] = useState<ArticleCardData[]>([]);
    const [recentAlbums, setRecentAlbums] = useState<AlbumCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isLoginReady || hasFetched.current) return;
        hasFetched.current = true;

        const loadImageUrl = async (fileName: string): Promise<string | null> => {
            try {
                const response = await MediaController.downloadFile({ fileName });
                if (!response) return null;
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } catch (err) {
                console.error('Erro ao baixar imagem:', fileName, err);
                return null;
            }
        };

        async function loadData() {
            try {
                // Buscar todos os dados necessários em paralelo
                const [featured, published, categories, albums] = await Promise.all([
                    ArticleController.getFeaturedArticles(),
                    ArticleController.getPublishedArticles(),
                    CategoryController.getAllCategories(),
                    AlbumController.getAllAlbumsController(),
                ]);

                // Criar mapa de categorias
                const catMap = new Map<string, Category>();
                categories.forEach(cat => catMap.set(cat._id, cat));

                // Coletar todas as medias de cover já populadas
                const allMedias = [
                    ...featured.filter(a => a.coverMedia).map(a => a.coverMedia!),
                    ...published.slice(0, 4).filter(a => a.coverMedia).map(a => a.coverMedia!),
                    ...albums.slice(0, 4).filter(a => a.coverMedia).map(a => a.coverMedia!),
                ];

                // Baixar imagens e criar mapa de URLs
                const mediaUrls = new Map<string, string>();
                await Promise.all(
                    allMedias.map(async (media) => {
                        if (media?.fileName) {
                            const url = await loadImageUrl(media.fileName);
                            if (url) {
                                mediaUrls.set(media._id, url);
                            }
                        }
                    })
                );

                // Mapear artigos em destaque para o formato do HeroCarousel
                const heroArticles: HeroArticle[] = featured.map(article => ({
                    _id: article._id,
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.content?.substring(0, 150) || "",
                    coverUrl: article.coverMedia ? mediaUrls.get(article.coverMedia._id) : undefined,
                    categoryName: article.category ? catMap.get(article.category)?.name : undefined,
                }));
                setFeaturedArticles(heroArticles);

                // Mapear artigos recentes (top 4, excluindo os em destaque)
                const recentOnly = published
                    .filter(a => !a.isFeatured)
                    .slice(0, 4);

                const recentCards: ArticleCardData[] = recentOnly.map(article => {
                    const category = article.category ? catMap.get(article.category) : undefined;
                    return {
                        _id: article._id,
                        title: article.title,
                        slug: article.slug,
                        excerpt: article.content?.substring(0, 150) || "",
                        coverUrl: article.coverMedia ? mediaUrls.get(article.coverMedia._id) : undefined,
                        categoryName: category?.name,
                        categoryColor: category?.color,
                        publishedAt: article.publishedAt,
                        readingTime: article.readingTime,
                    };
                });
                setRecentArticles(recentCards);

                // Mapear álbuns recentes (top 4)
                const albumCards: AlbumCardData[] = albums.slice(0, 4).map(album => ({
                    _id: album._id,
                    title: album.title,
                    slug: album.slug,
                    description: album.description,
                    coverUrl: album.coverMedia ? mediaUrls.get(album.coverMedia._id) : undefined,
                    photoCount: album.medias?.length || 0,
                }));
                setRecentAlbums(albumCards);

            } catch (error) {
                console.error("Erro ao carregar dados da homepage:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [isLoginReady]);

    return (
        <div className="min-h-screen">
            {/* Hero Section - Full Screen Carousel */}
            <HeroCarousel articles={featuredArticles} />

            {/* Recent Articles Section */}
            <section className="px-4 sm:px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader
                        title="Artigos Recentes"
                        subtitle="As últimas novidades do mundo nerd"
                        href="/artigos"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentArticles.map((article) => (
                            <ArticleCard key={article._id} {...article} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Preview Section */}
            <section className="px-4 sm:px-6 py-12 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader
                        title="Galeria"
                        subtitle="Fotos e álbuns da comunidade"
                        href="/galeria"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentAlbums.map((album) => (
                            <AlbumCard key={album._id} {...album} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="px-4 sm:px-6 py-16 bg-nerdcave-dark">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-nerdcave-light outfit outfit-700 mb-4">
                        Fique por Dentro
                    </h2>
                    <p className="text-nerdcave-light/70 outfit outfit-400 mb-8 max-w-xl mx-auto">
                        Receba as últimas novidades, artigos exclusivos e conteúdos especiais diretamente no seu email.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="flex-1 px-5 py-3 rounded-lg bg-nerdcave-light/10 border border-nerdcave-light/20 text-nerdcave-light placeholder:text-nerdcave-light/40 focus:outline-none focus:border-nerdcave-lime transition-colors outfit outfit-400"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-lg bg-nerdcave-lime text-nerdcave-dark font-semibold outfit outfit-600 hover:bg-nerdcave-lime/90 transition-colors"
                        >
                            Inscrever
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
