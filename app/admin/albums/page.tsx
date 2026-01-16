"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Eye, EyeOff, FolderOpen, LayoutGrid, List, ArrowDownAZ, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Album } from "@/lib/albums/Album.model";
import type { Category } from "@/lib/categories/Category.model";
import * as AlbumsController from "@/lib/albums/Album.controller";
import * as CategoriesController from "@/lib/categories/Category.controller";
import * as MediaController from "@/lib/medias/Media.controller";
import Button from "@/_components/Button";
import IconButton from "@/_components/IconButton";
import Toolbar from "@/_components/Toolbar";
import SegmentedControl from "@/_components/SegmentedControl";
import FilterDropdown from "@/_components/FilterDropdown";
import Pagination from "@/_components/Pagination";

export default function AlbumsPage() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filtros e visualização (PADRÃO)
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [sortBy, setSortBy] = useState<'az-asc' | 'az-desc' | 'date-asc' | 'date-desc'>('date-desc');
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);

    // Filtro específico: por status
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        categoryId: '',
        status: 'draft' as 'draft' | 'published',
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Reset para página 1 quando filtros mudam
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, sortBy, itemsPerPage]);

    // Filtrar álbuns
    const filteredAlbums = useMemo(() => {
        return albums.filter(album => {
            const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                album.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || album.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [albums, searchQuery, statusFilter]);

    // Ordenar álbuns
    const sortedAlbums = useMemo(() => {
        return [...filteredAlbums].sort((a, b) => {
            switch (sortBy) {
                case 'az-asc':
                    return a.title.localeCompare(b.title);
                case 'az-desc':
                    return b.title.localeCompare(a.title);
                case 'date-asc':
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                case 'date-desc':
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                default:
                    return 0;
            }
        });
    }, [filteredAlbums, sortBy]);

    // Paginar álbuns
    const paginatedAlbums = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAlbums.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAlbums, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedAlbums.length / itemsPerPage);

    async function fetchData() {
        try {
            setLoading(true);
            const [albumsList, categoriesList] = await Promise.all([
                AlbumsController.getAllAlbumsController(),
                CategoriesController.getCategoriesForAlbums(),
            ]);
            setAlbums(albumsList);
            setCategories(categoriesList);
            setError(null);
        } catch (err) {
            setError("Falha ao carregar álbuns");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenModal = (album?: Album) => {
        if (album) {
            setEditingAlbum(album);
            setFormData({
                title: album.title,
                slug: album.slug,
                description: album.description,
                categoryId: album.categoryId,
                status: album.status,
            });
        } else {
            setEditingAlbum(null);
            setFormData({
                title: '',
                slug: '',
                description: '',
                categoryId: categories[0]?._id || '',
                status: 'draft',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAlbum(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingAlbum) {
                await AlbumsController.updateAlbumController({
                    id: editingAlbum._id,
                    updates: formData
                });
            } else {
                await AlbumsController.createAlbumController({
                    data: {
                        ...formData,
                        tags: [],
                        medias: [],
                    },
                });
            }

            handleCloseModal();
            await fetchData();
        } catch (error) {
            console.error('Error saving album:', error);
            setError('Erro ao salvar álbum');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (album: Album) => {
        try {
            if (album.status === 'published') {
                await AlbumsController.unpublishAlbumController({ id: album._id });
            } else {
                await AlbumsController.publishAlbumController({ id: album._id });
            }
            await fetchData();
        } catch (error) {
            console.error('Error toggling publish:', error);
            setError('Erro ao alterar status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este álbum e todas as suas fotos?')) return;

        try {
            await AlbumsController.deleteAlbumController({ id });
            await fetchData();
        } catch (error) {
            console.error('Error deleting album:', error);
            setError('Erro ao deletar álbum');
        }
    };

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find(c => c._id === categoryId);
        return cat?.name || 'Sem categoria';
    };

    // Renderiza card no modo grid
    const renderGridCard = (album: Album) => (
        <div
            key={album._id}
            className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all group"
        >
            {/* Cover Image */}
            <Link href={`/admin/albums/${album._id}`}>
                <div className="aspect-video bg-secondary relative cursor-pointer">
                    {album.coverMedia ? (
                        <Image
                            src={MediaController.getMediaUrl({ fileName: album.coverMedia.fileName })}
                            alt={album.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                    )}

                    {/* Photo count badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                        {album.medias.length} imagem(ns)
                    </div>

                    {/* Status badge */}
                    <div className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${album.status === 'published'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {album.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </div>
                </div>
            </Link>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <Link href={`/admin/albums/${album._id}`}>
                            <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">
                                {album.title}
                            </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {album.description || 'Sem descrição'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            {getCategoryName(album.categoryId)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <IconButton
                        icon={album.status === 'published' ? <Eye /> : <EyeOff />}
                        onClick={() => handleTogglePublish(album)}
                        colorClass={album.status === 'published' ? 'text-green-400' : 'text-muted-foreground'}
                        hoverClass={album.status === 'published' ? 'hover:bg-green-500/20' : 'hover:bg-secondary hover:text-foreground'}
                        title={album.status === 'published' ? 'Despublicar' : 'Publicar'}
                    />
                    <IconButton
                        icon={<Edit2 />}
                        onClick={() => handleOpenModal(album)}
                        colorClass="text-foreground"
                        hoverClass="hover:bg-secondary/80"
                        title="Editar"
                    />
                    <IconButton
                        icon={<Trash2 />}
                        onClick={() => handleDelete(album._id)}
                        colorClass="text-red-400"
                        hoverClass="hover:bg-red-500/20"
                        title="Deletar"
                    />
                    <Link
                        href={`/admin/albums/${album._id}`}
                        className="ml-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-colors"
                    >
                        Gerenciar Fotos
                    </Link>
                </div>
            </div>
        </div>
    );

    // Renderiza item no modo lista
    const renderListItem = (album: Album) => (
        <div
            key={album._id}
            className="bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-all group"
        >
            <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <Link href={`/admin/albums/${album._id}`} className="shrink-0">
                    <div className="w-32 h-20 bg-secondary rounded-xl relative overflow-hidden">
                        {album.coverMedia ? (
                            <Image
                                src={MediaController.getMediaUrl({ fileName: album.coverMedia.fileName })}
                                alt={album.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                        )}
                    </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <Link href={`/admin/albums/${album._id}`}>
                            <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">
                                {album.title}
                            </h3>
                        </Link>
                        <span className={`text-xs px-2 py-1 rounded-full ${album.status === 'published'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            {album.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                            {album.medias.length} imagem(ns)
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {album.description || 'Sem descrição'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {getCategoryName(album.categoryId)}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton
                        icon={album.status === 'published' ? <Eye /> : <EyeOff />}
                        onClick={() => handleTogglePublish(album)}
                        colorClass={album.status === 'published' ? 'text-green-400' : 'text-muted-foreground'}
                        hoverClass={album.status === 'published' ? 'hover:bg-green-500/20' : 'hover:bg-secondary hover:text-foreground'}
                        title={album.status === 'published' ? 'Despublicar' : 'Publicar'}
                    />
                    <IconButton
                        icon={<Edit2 />}
                        onClick={() => handleOpenModal(album)}
                        colorClass="text-foreground"
                        hoverClass="hover:bg-secondary/80"
                        title="Editar"
                    />
                    <IconButton
                        icon={<Trash2 />}
                        onClick={() => handleDelete(album._id)}
                        colorClass="text-red-400"
                        hoverClass="hover:bg-red-500/20"
                        title="Deletar"
                    />
                </div>

                <Link
                    href={`/admin/albums/${album._id}`}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-colors"
                >
                    Gerenciar
                </Link>
            </div>
        </div>
    );

    return (
        <div className="space-y-3">
            {/* Toolbar Padrão */}
            <Toolbar
                search={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar álbuns..."
            >
                {/* Filtro específico: Status */}
                <SegmentedControl
                    options={[
                        { value: 'all', label: 'Todos' },
                        { value: 'draft', label: 'Rascunhos' },
                        { value: 'published', label: 'Publicados' },
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                />

                {/* Padrão: Grid/Lista */}
                <SegmentedControl
                    options={[
                        { value: 'list', label: 'Lista', icon: List },
                        { value: 'grid', label: 'Grid', icon: LayoutGrid },
                    ]}
                    value={viewMode}
                    onChange={setViewMode}
                    iconOnly
                />

                {/* Padrão: Ordenação */}
                <FilterDropdown
                    value={sortBy}
                    onChange={(value) => setSortBy(value as typeof sortBy)}
                    options={[
                        { value: 'az-asc', label: 'A-Z', icon: ArrowDownAZ },
                        { value: 'az-desc', label: 'Z-A', icon: ArrowUpAZ },
                        { value: 'date-desc', label: 'Mais Recentes', icon: CalendarArrowDown },
                        { value: 'date-asc', label: 'Mais Antigos', icon: CalendarArrowUp },
                    ]}
                    label="Ordenar"
                />

                {/* Padrão: Itens por página */}
                <FilterDropdown
                    value={itemsPerPage.toString()}
                    onChange={(value) => setItemsPerPage(parseInt(value))}
                    options={[
                        { value: '6', label: '6 / página' },
                        { value: '12', label: '12 / página' },
                        { value: '24', label: '24 / página' },
                        { value: '48', label: '48 / página' },
                    ]}
                    label="Exibir"
                />

                {/* Padrão: Botão adicionar */}
                <Button
                    onClick={() => handleOpenModal()}
                    icon={Plus}
                    className="ml-auto"
                >
                    Novo Álbum
                </Button>
            </Toolbar>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Albums List/Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground mt-4">Carregando álbuns...</p>
                </div>
            ) : sortedAlbums.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {searchQuery || statusFilter !== 'all' ? 'Nenhum álbum encontrado' : 'Nenhum álbum criado ainda'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                        <Button
                            onClick={() => handleOpenModal()}
                            variant="ghost"
                            className="mt-4"
                        >
                            Criar primeiro álbum
                        </Button>
                    )}
                </div>
            ) : viewMode === 'list' ? (
                <div className="space-y-4">
                    {paginatedAlbums.map(renderListItem)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedAlbums.map(renderGridCard)}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedAlbums.length)} de {sortedAlbums.length} álbuns
                    </p>
                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-xl">
                        <h2 className="text-xl font-bold text-foreground mb-6">
                            {editingAlbum ? 'Editar Álbum' : 'Novo Álbum'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none"
                                    placeholder="Título do álbum"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none resize-none"
                                    placeholder="Descrição do álbum"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Categoria *
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none"
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={handleCloseModal}
                                    variant="secondary"
                                    size="lg"
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    size="lg"
                                    className="flex-1"
                                >
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
