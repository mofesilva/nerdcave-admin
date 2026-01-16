"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Tag, LayoutGrid, List, ArrowDownAZ, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp, Loader2, Hash } from "lucide-react";
import type { Tag as TagType } from "@/lib/tags/Tag.model";
import * as TagsController from "@/lib/tags/Tag.controller";
import Button from "@/_components/Button";
import IconButton from "@/_components/IconButton";
import Toolbar from "@/_components/Toolbar";
import SegmentedControl from "@/_components/SegmentedControl";
import FilterDropdown from "@/_components/FilterDropdown";
import Pagination from "@/_components/Pagination";

// Helper function to generate slug
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export default function TagsPage() {
    const [tags, setTags] = useState<TagType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<TagType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filtros e visualização (PADRÃO)
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [sortBy, setSortBy] = useState<'az-asc' | 'az-desc' | 'date-asc' | 'date-desc' | 'usage-asc' | 'usage-desc'>('az-asc');
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    // Filtro específico: por uso
    const [usageFilter, setUsageFilter] = useState<'all' | 'used' | 'unused'>('all');

    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        fetchTags();
    }, []);

    // Reset para página 1 quando filtros mudam
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, usageFilter, sortBy, itemsPerPage]);

    // Filtrar tags
    const filteredTags = useMemo(() => {
        return tags.filter(tag => {
            const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesUsage = usageFilter === 'all' ||
                (usageFilter === 'used' && tag.usageCount > 0) ||
                (usageFilter === 'unused' && tag.usageCount === 0);
            return matchesSearch && matchesUsage;
        });
    }, [tags, searchQuery, usageFilter]);

    // Ordenar tags
    const sortedTags = useMemo(() => {
        return [...filteredTags].sort((a, b) => {
            switch (sortBy) {
                case 'az-asc':
                    return a.name.localeCompare(b.name);
                case 'az-desc':
                    return b.name.localeCompare(a.name);
                case 'date-asc':
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                case 'date-desc':
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                case 'usage-asc':
                    return a.usageCount - b.usageCount;
                case 'usage-desc':
                    return b.usageCount - a.usageCount;
                default:
                    return 0;
            }
        });
    }, [filteredTags, sortBy]);

    // Paginar tags
    const paginatedTags = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedTags.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedTags, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedTags.length / itemsPerPage);

    async function fetchTags() {
        try {
            setLoading(true);
            const models = await TagsController.getAllTags();
            setTags(models);
            setError(null);
        } catch (err) {
            setError("Falha ao carregar tags");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenModal = (tag?: TagType) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({
                name: tag.name,
            });
        } else {
            setEditingTag(null);
            setFormData({
                name: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTag(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingTag) {
                await TagsController.updateTag({
                    id: editingTag._id,
                    updates: { name: formData.name }
                });
            } else {
                await TagsController.createTag({
                    data: { name: formData.name } as any
                });
            }

            handleCloseModal();
            await fetchTags();
        } catch (error) {
            console.error('Error saving tag:', error);
            setError('Erro ao salvar tag');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta tag?')) return;

        try {
            await TagsController.deleteTag({ id });
            await fetchTags();
        } catch (error) {
            console.error('Error deleting tag:', error);
            setError('Erro ao deletar tag');
        }
    };

    // Renderiza tag no modo grid (chips)
    const renderGridItem = (tag: TagType) => (
        <div
            key={tag._id}
            className="group bg-card rounded-md px-4 py-3 border border-border hover:border-primary/30 transition-all flex items-center gap-3"
        >
            <Tag className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{tag.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${tag.usageCount > 0 ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                }`}>
                {tag.usageCount} uso{tag.usageCount !== 1 ? 's' : ''}
            </span>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <IconButton
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenModal(tag)}
                    hoverClass="hover:bg-secondary hover:text-foreground"
                    title="Editar"
                    className="p-1.5"
                />
                <IconButton
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => handleDelete(tag._id)}
                    hoverClass="hover:bg-red-500/10 hover:text-red-400"
                    title="Deletar"
                    className="p-1.5"
                />
            </div>
        </div>
    );

    // Renderiza tag no modo lista
    const renderListItem = (tag: TagType) => (
        <div
            key={tag._id}
            className="group bg-card rounded-md p-5 border border-border hover:border-primary/30 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-md bg-primary/20">
                    <Hash className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground truncate">{tag.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${tag.usageCount > 0 ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                            }`}>
                            {tag.usageCount} uso{tag.usageCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        /{tag.slug}
                    </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton
                        icon={<Edit2 />}
                        onClick={() => handleOpenModal(tag)}
                        colorClass="text-foreground"
                        hoverClass="hover:bg-secondary/80"
                        title="Editar"
                    />
                    <IconButton
                        icon={<Trash2 />}
                        onClick={() => handleDelete(tag._id)}
                        colorClass="text-red-400"
                        hoverClass="hover:bg-red-500/20"
                        title="Deletar"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-3">
            {/* Toolbar Padrão */}
            <Toolbar
                search={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar tags..."
            >
                {/* Filtro específico: Por uso */}
                <SegmentedControl
                    options={[
                        { value: 'all', label: 'Todas' },
                        { value: 'used', label: 'Em Uso' },
                        { value: 'unused', label: 'Sem Uso' },
                    ]}
                    value={usageFilter}
                    onChange={setUsageFilter}
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
                        { value: 'usage-desc', label: 'Mais Usadas', icon: Hash },
                        { value: 'usage-asc', label: 'Menos Usadas', icon: Hash },
                        { value: 'date-desc', label: 'Mais Recentes', icon: CalendarArrowDown },
                        { value: 'date-asc', label: 'Mais Antigas', icon: CalendarArrowUp },
                    ]}
                    label="Ordenar"
                />

                {/* Padrão: Itens por página */}
                <FilterDropdown
                    value={itemsPerPage.toString()}
                    onChange={(value) => setItemsPerPage(parseInt(value))}
                    options={[
                        { value: '10', label: '10 / página' },
                        { value: '25', label: '25 / página' },
                        { value: '50', label: '50 / página' },
                        { value: '100', label: '100 / página' },
                    ]}
                    label="Exibir"
                />

                {/* Padrão: Botão adicionar */}
                <Button
                    onClick={() => handleOpenModal()}
                    icon={Plus}
                    className="ml-auto"
                >
                    Nova Tag
                </Button>
            </Toolbar>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Tags List/Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground mt-4">Carregando tags...</p>
                </div>
            ) : sortedTags.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-md border border-border">
                    <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {searchQuery || usageFilter !== 'all' ? 'Nenhuma tag encontrada' : 'Nenhuma tag criada ainda'}
                    </p>
                    {!searchQuery && usageFilter === 'all' && (
                        <Button
                            onClick={() => handleOpenModal()}
                            variant="ghost"
                            className="mt-4"
                        >
                            Criar primeira tag
                        </Button>
                    )}
                </div>
            ) : viewMode === 'list' ? (
                <div className="space-y-4">
                    {paginatedTags.map(renderListItem)}
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {paginatedTags.map(renderGridItem)}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedTags.length)} de {sortedTags.length} tags
                    </p>
                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Stats */}
            {tags.length > 0 && (
                <div className="bg-card rounded-md p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Estatísticas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-secondary rounded-md p-4">
                            <p className="text-2xl font-bold text-foreground">{tags.length}</p>
                            <p className="text-sm text-muted-foreground">Total de Tags</p>
                        </div>
                        <div className="bg-secondary rounded-md p-4">
                            <p className="text-2xl font-bold text-foreground">
                                {tags.reduce((acc, tag) => acc + tag.usageCount, 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">Total de Usos</p>
                        </div>
                        <div className="bg-secondary rounded-md p-4">
                            <p className="text-2xl font-bold text-foreground">
                                {tags.filter(t => t.usageCount > 0).length}
                            </p>
                            <p className="text-sm text-muted-foreground">Tags em Uso</p>
                        </div>
                        <div className="bg-secondary rounded-md p-4">
                            <p className="text-2xl font-bold text-foreground">
                                {tags.filter(t => t.usageCount === 0).length}
                            </p>
                            <p className="text-sm text-muted-foreground">Tags Sem Uso</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-md p-6 w-full max-w-md border border-border shadow-xl">
                        <h2 className="text-xl font-bold text-foreground mb-6">
                            {editingTag ? 'Editar Tag' : 'Nova Tag'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-secondary rounded-md px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none"
                                    placeholder="Nome da tag"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Slug: {formData.name ? generateSlug(formData.name) : '—'}
                                </p>
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
