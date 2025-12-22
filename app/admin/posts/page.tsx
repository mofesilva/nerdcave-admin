"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, X, FileText, Loader2, LayoutGrid, List, ArrowDownAZ, Clock, FolderOpen } from "lucide-react";
import Link from "next/link";
import FilterDropdown from "@/components/FilterDropdown";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import SegmentedControl from "@/components/SegmentedControl";
import { PostCardWithLoader } from "./components/PostCardWithLoader";
import { ArticlesController, CategoriesController, MediaController } from "@/lib/controllers";
import { ArticleModel } from "@/lib/models/Article.model";
import { CategoryModel } from "@/lib/models/Category.model";
import { MediaModel } from "@/lib/models/Media.model";

export default function PostsPage() {
    const [articles, setArticles] = useState<ArticleModel[]>([]);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [mediaMap, setMediaMap] = useState<Record<string, MediaModel>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'scheduled'>('all');
    const [sortBy, setSortBy] = useState<'alphabetical' | 'date' | 'category'>('date');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const [articlesData, categoriesData] = await Promise.all([
                ArticlesController.getAll(),
                CategoriesController.getAll(),
            ]);

            setArticles(articlesData);
            setCategories(categoriesData);

            // Carregar media das capas
            const coverIds = articlesData
                .map(a => a.coverMediaId)
                .filter((id): id is string => !!id);

            if (coverIds.length > 0) {
                const mediaItems = await MediaController.getByIds(coverIds);
                const map: Record<string, MediaModel> = {};
                mediaItems.forEach(m => { map[m._id] = m; });
                setMediaMap(map);
            }

            setError(null);
        } catch (err) {
            setError("Falha ao carregar artigos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedArticles = useMemo(() => {
        return [...filteredArticles].sort((a, b) => {
            switch (sortBy) {
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'date':
                    const dateA = a.publishedAt || a.scheduledAt || '';
                    const dateB = b.publishedAt || b.scheduledAt || '';
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                case 'category':
                    const catA = getCategoryName(a.categoryId);
                    const catB = getCategoryName(b.categoryId);
                    return catA.localeCompare(catB);
                default:
                    return 0;
            }
        });
    }, [filteredArticles, sortBy]);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este artigo?')) return;

        try {
            await ArticlesController.delete(id);
            setArticles(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            console.error('Erro ao deletar:', err);
        }
    };

    const handleTogglePublish = async (article: ArticleModel) => {
        try {
            if (article.status === 'published') {
                await ArticlesController.unpublish(article._id);
            } else {
                await ArticlesController.publish(article._id);
            }
            await fetchData();
        } catch (err) {
            console.error('Erro ao alterar status:', err);
        }
    };

    const handleToggleFeatured = async (article: ArticleModel) => {
        try {
            await ArticlesController.update(article._id, { isFeatured: !article.isFeatured });
            await fetchData();
        } catch (err) {
            console.error('Erro ao alterar destaque:', err);
        }
    };

    const getCategoryName = (categoryId?: string) => {
        if (!categoryId) return 'Sem categoria';
        return categories.find(c => c._id === categoryId)?.name || 'Sem categoria';
    };

    const getMedia = (article: ArticleModel): MediaModel | undefined => {
        if (!article.coverMediaId) return undefined;
        return mediaMap[article.coverMediaId];
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Publicado</span>;
            case 'scheduled':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">Agendado</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Rascunho</span>;
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 flex-1 max-w-md border border-border">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar posts..."
                        className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground flex-1"
                    />
                    {searchQuery && (
                        <IconButton
                            icon={<X />}
                            onClick={() => setSearchQuery('')}
                        />
                    )}
                </div>

                <SegmentedControl
                    options={[
                        { value: 'all', label: 'Todos' },
                        { value: 'draft', label: 'Rascunhos' },
                        { value: 'published', label: 'Publicados' },
                        { value: 'scheduled', label: 'Agendados' },
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                />

                {/* View Mode Toggle */}
                <SegmentedControl
                    options={[
                        { value: 'list', label: 'Lista', icon: List },
                        { value: 'grid', label: 'Grid', icon: LayoutGrid },
                    ]}
                    value={viewMode}
                    onChange={setViewMode}
                    iconOnly
                />

                <FilterDropdown
                    value={sortBy}
                    onChange={(value) => setSortBy(value as 'alphabetical' | 'date' | 'category')}
                    options={[
                        { value: 'alphabetical', label: 'Ordem Alfabética', icon: ArrowDownAZ },
                        { value: 'date', label: 'Data', icon: Clock },
                        { value: 'category', label: 'Categoria', icon: FolderOpen },
                    ]}
                    label="Ordenar por"
                />

                <Link href="/admin/posts/new" className="ml-auto">
                    <Button icon={Plus} size="lg">Novo Post</Button>
                </Link>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </div>
            ) : sortedArticles.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {searchQuery || statusFilter !== 'all' ? 'Nenhum post encontrado' : 'Nenhum post criado'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                        <Link
                            href="/admin/posts/new"
                            className="inline-block mt-4 text-primary hover:underline"
                        >
                            Criar primeiro post
                        </Link>
                    )}
                </div>
            ) : (
                viewMode === 'list' ? (
                    <div className="space-y-4">
                        {sortedArticles.map((article) => (
                            <PostCardWithLoader
                                key={article._id}
                                article={article}
                                media={getMedia(article)}
                                categoryName={getCategoryName(article.categoryId)}
                                variant="list"
                                onDelete={handleDelete}
                                onTogglePublish={handleTogglePublish}
                                onToggleFeatured={handleToggleFeatured}
                                formatDate={formatDate}
                                getStatusBadge={getStatusBadge}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sortedArticles.map((article) => (
                            <PostCardWithLoader
                                key={article._id}
                                article={article}
                                media={getMedia(article)}
                                categoryName={getCategoryName(article.categoryId)}
                                variant="grid"
                                onDelete={handleDelete}
                                onTogglePublish={handleTogglePublish}
                                onToggleFeatured={handleToggleFeatured}
                                formatDate={formatDate}
                                getStatusBadge={getStatusBadge}
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
