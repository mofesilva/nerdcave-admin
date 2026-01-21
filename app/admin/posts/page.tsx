"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, FileText, Loader2, LayoutGrid, List, ArrowDownAZ, ArrowUpZA, CalendarPlus, CalendarClock, FolderOpen } from "lucide-react";
import Link from "next/link";
import FilterDropdown from "@/_components/FilterDropdown";
import Button from "@/_components/Button";
import SegmentedControl from "@/_components/SegmentedControl";
import StatusBadges from "@/_components/StatusBadges";
import Toolbar from "@/_components/Toolbar";
import ConfirmDialog from "@/_components/ConfirmDialog";
import { PostCardWithLoader } from "./_components/PostCardWithLoader";
import * as ArticlesController from "@/lib/articles/Article.controller";
import * as CategoriesController from "@/lib/categories/Category.controller";
import type { Article } from "@/lib/articles/Article.model";
import type { Category } from "@/lib/categories/Category.model";
import type { Media } from "@/lib/medias/Media.model";

export default function PostsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'scheduled'>('all');
    const [sortBy, setSortBy] = useState<'a-z' | 'z-a' | 'created' | 'edited' | 'category'>('created');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const [articlesData, categoriesData] = await Promise.all([
                ArticlesController.getAllArticles(),
                CategoriesController.getAllCategories(),
            ]);

            setArticles(articlesData);
            setCategories(categoriesData);

            // Não é mais necessário carregar media separadamente pois coverMedia já está no Article
            setError(null);
        } catch (err) {
            setError("Falha ao carregar artigos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedArticles = useMemo(() => {
        return [...filteredArticles].sort((a, b) => {
            switch (sortBy) {
                case 'a-z':
                    return a.title.localeCompare(b.title);
                case 'z-a':
                    return b.title.localeCompare(a.title);
                case 'created':
                    const createdA = a.createdAt || '';
                    const createdB = b.createdAt || '';
                    return new Date(createdB).getTime() - new Date(createdA).getTime();
                case 'edited':
                    const editedA = a.updatedAt || a.createdAt || '';
                    const editedB = b.updatedAt || b.createdAt || '';
                    return new Date(editedB).getTime() - new Date(editedA).getTime();
                case 'category':
                    const catA = getCategoryName(a.category);
                    const catB = getCategoryName(b.category);
                    return catA.localeCompare(catB);
                default:
                    return 0;
            }
        });
    }, [filteredArticles, sortBy]);

    const openDeleteDialog = (id: string) => {
        setArticleToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!articleToDelete) return;

        try {
            setDeleting(true);
            await ArticlesController.deleteArticle({ id: articleToDelete });
            setArticles(prev => prev.filter(a => a._id !== articleToDelete));
            setDeleteDialogOpen(false);
            setArticleToDelete(null);
        } catch (err) {
            console.error('Erro ao deletar:', err);
        } finally {
            setDeleting(false);
        }
    };

    const handleTogglePublish = async (article: Article) => {
        try {
            if (article.status === 'published') {
                await ArticlesController.unpublishArticle({ id: article._id });
            } else {
                await ArticlesController.publishArticle({ id: article._id });
            }
            await fetchData();
        } catch (err) {
            console.error('Erro ao alterar status:', err);
        }
    };

    const handleToggleFeatured = async (article: Article) => {
        try {
            await ArticlesController.toggleFeatured({ id: article._id });
            await fetchData();
        } catch (err) {
            console.error('Erro ao alterar destaque:', err);
        }
    };

    const getCategoryName = (category?: string) => {
        if (!category) return 'Sem categoria';
        return categories.find(c => c._id === category)?.name || 'Sem categoria';
    };

    const getMedia = (article: Article): Media | undefined => {
        return article.coverMedia;
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
                return <StatusBadges status="Publicado" bgColor="bg-primary/20" textColor="text-primary" textSize="text-[10px]" />;
            case 'scheduled':
                return <StatusBadges status="Agendado" bgColor="bg-yellow-500/20" textColor="text-yellow-400" textSize="text-[10px]" />;
            default:
                return <StatusBadges status="Rascunho" bgColor="bg-gray-500/20" textColor="text-gray-400" textSize="text-[10px]" />;
        }
    };

    return (
        <div className="space-y-2">
            {/* Mobile Layout */}
            <div className="sm:hidden space-y-3">
                {/* Row 1: Search */}
                <Toolbar
                    search={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Buscar posts..."
                />
                {/* Row 2: Status Filter */}
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
                {/* Row 3: Toggle + Sort + Button */}
                <div className="flex items-center gap-2">
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
                        onChange={(value) => setSortBy(value as 'a-z' | 'z-a' | 'created' | 'edited' | 'category')}
                        options={[
                            { value: 'a-z', label: 'A-Z', icon: ArrowDownAZ },
                            { value: 'z-a', label: 'Z-A', icon: ArrowUpZA },
                            { value: 'created', label: 'Data Criação', icon: CalendarPlus },
                            { value: 'edited', label: 'Data Edição', icon: CalendarClock },
                            { value: 'category', label: 'Categoria', icon: FolderOpen },
                        ]}
                        label="Ordenar por"
                    />
                    <Link href="/admin/posts/new" className="flex-1">
                        <Button icon={Plus} size="auto" className="w-full">Novo Post</Button>
                    </Link>
                </div>
            </div>

            {/* Desktop Layout - Tudo em 1 linha */}
            <div className="hidden sm:block">
                <Toolbar
                    search={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Buscar posts..."
                >
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
                        onChange={(value) => setSortBy(value as 'a-z' | 'z-a' | 'created' | 'edited' | 'category')}
                        options={[
                            { value: 'a-z', label: 'A-Z', icon: ArrowDownAZ },
                            { value: 'z-a', label: 'Z-A', icon: ArrowUpZA },
                            { value: 'created', label: 'Data Criação', icon: CalendarPlus },
                            { value: 'edited', label: 'Data Edição', icon: CalendarClock },
                            { value: 'category', label: 'Categoria', icon: FolderOpen },
                        ]}
                        label="Ordenar por"
                    />
                    <div className="flex-1" />
                    <Link href="/admin/posts/new">
                        <Button icon={Plus} size="auto">Novo Post</Button>
                    </Link>
                </Toolbar>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </div>
            ) : sortedArticles.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-md border border-border">
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
                                categoryName={getCategoryName(article.category)}
                                variant="list"
                                onDelete={openDeleteDialog}
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
                                categoryName={getCategoryName(article.category)}
                                variant="grid"
                                onDelete={openDeleteDialog}
                                onTogglePublish={handleTogglePublish}
                                onToggleFeatured={handleToggleFeatured}
                                formatDate={formatDate}
                                getStatusBadge={getStatusBadge}
                            />
                        ))}
                    </div>
                )
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => { setDeleteDialogOpen(false); setArticleToDelete(null); }}
                onConfirm={handleDelete}
                title="Deletar artigo"
                message="Tem certeza que deseja deletar este artigo? Esta ação não pode ser desfeita."
                confirmLabel="Deletar"
                cancelLabel="Cancelar"
                variant="danger"
                loading={deleting}
            />
        </div>
    );
}
