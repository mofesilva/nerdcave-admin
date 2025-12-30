"use client";

import { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ArticleCard } from "../../../components/blog/ArticleCard";
import { SectionHeader } from "../../../components/blog/SectionHeader";
import { CommentsSection } from "../../../components/blog/CommentsSection";
import * as ArticleController from "@/lib/articles/Article.controller";
import * as CategoryController from "@/lib/categories/Category.controller";
import * as MediaController from "@/lib/medias/Media.controller";
import type { Category } from "@/lib/categories/Category.model";
import type { Media } from "@/lib/medias/Media.model";
import { useAutoLogin } from "@/lib/contexts/AutoLoginContext";
import { getExcerpt } from "@/lib/utils";

interface ArticleData {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverUrl?: string;
    categoryName: string;
    categoryColor: string;
    publishedAt: string;
    readingTime: number;
    authorName: string;
    authorAvatar?: string;
}

interface RelatedArticle {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverUrl?: string;
    categoryName: string;
    categoryColor: string;
    publishedAt: string;
    readingTime: number;
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { isReady: isLoginReady } = useAutoLogin();
    const hasFetched = useRef(false);

    const [article, setArticle] = useState<ArticleData | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        // Só executa quando login está pronto e ainda não buscou
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

        const getCategoryData = (categoryId: string | undefined, cats: Category[]) => {
            const cat = cats.find(c => c._id === categoryId);
            return {
                name: cat?.name || "Sem categoria",
                color: cat?.color || "#6e5fa6"
            };
        };

        const fetchArticle = async () => {
            try {
                setLoading(true);
                console.log("[ArticlePage] Buscando artigo:", slug);

                // Buscar artigo por slug
                const articleData = await ArticleController.getArticleBySlug({ slug });
                console.log("[ArticlePage] Artigo encontrado:", articleData?._id, "coverMedia:", articleData?.coverMedia?._id);

                if (!articleData || articleData.status !== "published") {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                // Buscar categorias
                const categoriesData = await CategoryController.getAllCategories();

                // Buscar imagem de capa - coverMedia já vem populado
                let coverUrl: string | undefined;
                if (articleData.coverMedia) {
                    console.log("[ArticlePage] Buscando media:", articleData.coverMedia._id);
                    const url = await loadImageUrl(articleData.coverMedia.fileName);
                    console.log("[ArticlePage] URL da imagem:", url);
                    if (url) coverUrl = url;
                }

                // Montar dados do artigo
                const catData = getCategoryData(articleData.category, categoriesData);
                console.log("[ArticlePage] Conteúdo bruto:", JSON.stringify(articleData.content.substring(0, 500)));
                console.log("[ArticlePage] Tem \\n?", articleData.content.includes('\n'));
                console.log("[ArticlePage] Tem \\r\\n?", articleData.content.includes('\r\n'));
                setArticle({
                    _id: articleData._id,
                    title: articleData.title,
                    slug: articleData.slug,
                    excerpt: getExcerpt(articleData.content || '', 200),
                    content: articleData.content,
                    coverUrl,
                    categoryName: catData.name,
                    categoryColor: catData.color,
                    publishedAt: articleData.publishedAt || "",
                    readingTime: articleData.readingTime || 5,
                    authorName: "Nerdcave Team",
                    authorAvatar: "/images/logos/nerdcave-purple.png",
                });

                // Buscar artigos relacionados
                const allPublished = await ArticleController.getPublishedArticles();
                const related = allPublished
                    .filter(a => a._id !== articleData._id)
                    .slice(0, 3);

                // Carregar URLs das imagens relacionadas - coverMedia já vem populado
                const relatedWithCovers = await Promise.all(
                    related.map(async (a) => {
                        let relCoverUrl: string | undefined;
                        if (a.coverMedia) {
                            const url = await loadImageUrl(a.coverMedia.fileName);
                            if (url) relCoverUrl = url;
                        }
                        const cat = getCategoryData(a.category, categoriesData);
                        return {
                            _id: a._id,
                            title: a.title,
                            slug: a.slug,
                            excerpt: getExcerpt(a.content || '', 150),
                            coverUrl: relCoverUrl,
                            categoryName: cat.name,
                            categoryColor: cat.color,
                            publishedAt: a.publishedAt || "",
                            readingTime: a.readingTime || 5,
                        };
                    })
                );

                setRelatedArticles(relatedWithCovers);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar artigo:", err);
                setNotFound(true);
                setLoading(false);
            }
        };

        fetchArticle();
    }, [isLoginReady, slug]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-nerdcave-lime animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground outfit outfit-400">Carregando artigo...</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (notFound || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground outfit outfit-700 mb-4">
                        Artigo não encontrado
                    </h1>
                    <p className="text-muted-foreground outfit outfit-400 mb-8">
                        O artigo que você procura não existe ou foi removido.
                    </p>
                    <Link
                        href="/artigos"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-nerdcave-purple text-white rounded-full font-medium outfit outfit-500 hover:bg-nerdcave-purple/90 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar aos Artigos
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative h-[50vh] md:h-[60vh]">
                {article.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={article.coverUrl}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-nerdcave-purple" />
                )}
                <div className="absolute inset-0 bg-background/70" />
            </section>

            {/* Article Content */}
            <section className="px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <article className="max-w-6xl mx-auto bg-card rounded-2xl shadow-xl p-6 md:p-10">
                    {/* Breadcrumb with Back Button */}
                    <div className="flex items-center gap-2 mb-6">
                        <Link
                            href="/artigos"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-muted hover:bg-nerdcave-purple/20 text-muted-foreground hover:text-nerdcave-purple transition-colors"
                            title="Voltar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <nav className="flex items-center gap-2 text-sm outfit outfit-400">
                            <Link href="/artigos" className="text-muted-foreground hover:text-nerdcave-purple transition-colors">
                                Artigos
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-muted-foreground line-clamp-1">
                                {article.title}
                            </span>
                        </nav>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-card-foreground outfit outfit-700 mb-6">
                        {article.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                                {article.authorAvatar && (
                                    <Image
                                        src={article.authorAvatar}
                                        alt={article.authorName}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <span className="font-medium text-card-foreground outfit outfit-500">
                                {article.authorName}
                            </span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground outfit outfit-400">
                            {formatDate(article.publishedAt)}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground outfit outfit-400">
                            {article.readingTime} min de leitura
                        </span>
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none outfit article-content"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    <style jsx>{`
                        .article-content :global(p) {
                            margin-bottom: 1.5rem;
                            color: var(--muted-foreground);
                            line-height: 1.75;
                        }
                        .article-content :global(p:last-child) {
                            margin-bottom: 0;
                        }
                        .article-content :global(strong) {
                            color: var(--card-foreground);
                            font-weight: 600;
                        }
                        .article-content :global(em) {
                            font-style: italic;
                        }
                        .article-content :global(h2) {
                            margin-top: 2.5rem;
                            margin-bottom: 1rem;
                            font-size: 1.5rem;
                            font-weight: 700;
                            color: var(--card-foreground);
                        }
                        .article-content :global(h3) {
                            margin-top: 2rem;
                            margin-bottom: 0.75rem;
                            font-size: 1.25rem;
                            font-weight: 600;
                            color: var(--card-foreground);
                        }
                    `}</style>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-8 border-t border-border">
                        <div className="flex items-center gap-3">
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-nerdcave-purple/10 text-nerdcave-purple hover:bg-nerdcave-purple hover:text-white transition-all outfit outfit-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>Curtir</span>
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-nerdcave-lime/10 text-nerdcave-lime hover:bg-nerdcave-lime hover:text-nerdcave-dark transition-all outfit outfit-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Comentar</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground outfit outfit-500 text-sm">Compartilhar:</span>
                            <button className="w-9 h-9 rounded-full bg-nerdcave-dark/10 flex items-center justify-center text-foreground hover:bg-nerdcave-purple hover:text-white transition-all" title="Twitter/X">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </button>
                            <button className="w-9 h-9 rounded-full bg-nerdcave-dark/10 flex items-center justify-center text-foreground hover:bg-nerdcave-purple hover:text-white transition-all" title="Facebook">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                </svg>
                            </button>
                            <button className="w-9 h-9 rounded-full bg-nerdcave-dark/10 flex items-center justify-center text-foreground hover:bg-nerdcave-purple hover:text-white transition-all" title="Copiar link">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <CommentsSection articleId={article._id} />
                </article>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            title="Artigos Relacionados"
                            subtitle="Continue sua leitura"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedArticles.map((relArticle) => (
                                <ArticleCard key={relArticle._id} {...relArticle} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
