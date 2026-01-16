"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, FolderTree, GripVertical, LayoutGrid, List, ArrowDownAZ, ArrowUpAZ, Loader2, FileText, Image as ImageIcon, ChevronRight, ArrowUpDown } from "lucide-react";
import type { Category, CategoryType } from "@/lib/categories/Category.model";
import * as CategoriesController from "@/lib/categories/Category.controller";
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

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filtros e visualização (PADRÃO)
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [sortBy, setSortBy] = useState<'az-asc' | 'az-desc' | 'order-asc' | 'order-desc'>('order-asc');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Filtros específicos da página
    const [typeFilter, setTypeFilter] = useState<'all' | CategoryType>('all');

    // Estado para categorias expandidas (toggle)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        type: 'both' as CategoryType,
        parentId: '',
        order: 0,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    // Reset para página 1 quando filtros mudam
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, typeFilter, sortBy, itemsPerPage]);

    // Filtrar categorias
    const filteredCategories = useMemo(() => {
        return categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            const matchesType = typeFilter === 'all' || category.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [categories, searchQuery, typeFilter]);

    // Ordenar categorias
    const sortedCategories = useMemo(() => {
        return [...filteredCategories].sort((a, b) => {
            switch (sortBy) {
                case 'az-asc':
                    return a.name.localeCompare(b.name);
                case 'az-desc':
                    return b.name.localeCompare(a.name);
                case 'order-asc':
                    return a.order - b.order;
                case 'order-desc':
                    return b.order - a.order;
                default:
                    return 0;
            }
        });
    }, [filteredCategories, sortBy]);

    // Organizar em árvore hierárquica
    const { rootCategories, childrenMap } = useMemo(() => {
        const roots: Category[] = [];
        const children: Record<string, Category[]> = {};

        sortedCategories.forEach(cat => {
            if (!cat.parentId) {
                roots.push(cat);
            } else {
                if (!children[cat.parentId]) {
                    children[cat.parentId] = [];
                }
                children[cat.parentId].push(cat);
            }
        });

        return { rootCategories: roots, childrenMap: children };
    }, [sortedCategories]);

    // Paginar apenas categorias raiz
    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return rootCategories.slice(startIndex, startIndex + itemsPerPage);
    }, [rootCategories, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(rootCategories.length / itemsPerPage);

    // Toggle para expandir/colapsar categoria
    const toggleExpanded = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    // Verificar se categoria tem filhos
    const hasChildren = (categoryId: string) => {
        return (childrenMap[categoryId]?.length || 0) > 0;
    };

    async function fetchCategories() {
        try {
            setLoading(true);
            const models = await CategoriesController.getAllCategories();
            setCategories(models);
            setError(null);
        } catch (err) {
            setError("Falha ao carregar categorias");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                type: category.type,
                parentId: category.parentId || '',
                order: category.order,
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                type: 'both',
                parentId: '',
                order: categories.length,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                slug: formData.slug || generateSlug(formData.name),
                description: formData.description || undefined,
                type: formData.type,
                parentId: formData.parentId || undefined,
                order: formData.order,
            };

            if (editingCategory) {
                await CategoriesController.updateCategory({
                    id: editingCategory._id,
                    updates: payload
                });
            } else {
                await CategoriesController.createCategory({ data: payload as any });
            }

            handleCloseModal();
            await fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Erro ao salvar categoria');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

        try {
            await CategoriesController.deleteCategory({ id });
            await fetchCategories();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            setError(error.message || 'Erro ao deletar categoria');
        }
    };

    const typeOptions = [
        { name: 'Artigos', value: 'article' },
        { name: 'Álbuns', value: 'album' },
        { name: 'Ambos', value: 'both' },
    ];

    const getTypeLabel = (type: CategoryType) => {
        const option = typeOptions.find(o => o.value === type);
        return option?.name || type;
    };

    const getTypeBadgeColor = (type: CategoryType) => {
        switch (type) {
            case 'article': return 'bg-blue-500/20 text-blue-400';
            case 'album': return 'bg-purple-500/20 text-purple-400';
            case 'both': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getTypeIcon = (type: CategoryType) => {
        switch (type) {
            case 'article': return <FileText className="w-5 h-5" />;
            case 'album': return <ImageIcon className="w-5 h-5" />;
            case 'both': return <FolderTree className="w-5 h-5" />;
            default: return <FolderTree className="w-5 h-5" />;
        }
    };

    // Renderiza card no modo grid
    const renderGridCard = (category: Category) => {
        const children = childrenMap[category._id] || [];
        const hasChildCategories = children.length > 0;

        return (
            <div
                key={category._id}
                className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all group flex flex-col"
            >
                <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl ${getTypeBadgeColor(category.type)}`}>
                        {getTypeIcon(category.type)}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconButton
                            icon={<Edit2 className="w-4 h-4" />}
                            onClick={() => handleOpenModal(category)}
                            colorClass="text-foreground"
                            hoverClass="hover:bg-secondary/80"
                            title="Editar"
                        />
                        <IconButton
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleDelete(category._id)}
                            colorClass="text-red-400"
                            hoverClass="hover:bg-red-500/20"
                            title="Deletar"
                        />
                    </div>
                </div>

                <h3 className="font-semibold text-foreground truncate mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">/{category.slug}</p>
                {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{category.description}</p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(category.type)}`}>
                        {getTypeLabel(category.type)}
                    </span>
                    {hasChildCategories ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {children.length} subcategorias
                        </span>
                    ) : (
                        <span className="text-xs text-muted-foreground">Ordem: {category.order}</span>
                    )}
                </div>
            </div>
        );
    };

    // Renderiza item no modo lista (com suporte a hierarquia)
    const renderListItem = (category: Category, level: number = 0) => {
        const isExpanded = expandedCategories.has(category._id);
        const children = childrenMap[category._id] || [];
        const hasChildCategories = children.length > 0;

        return (
            <div key={category._id} className={level > 0 ? 'pl-8' : ''}>
                <div
                    className={`bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all group ${
                        level > 0 ? 'border-l-4 border-l-primary/50' : ''
                    }`}
                >
                    <div className="flex items-center gap-4">
                        {/* Toggle para expandir/colapsar */}
                        {hasChildCategories ? (
                            <button
                                onClick={() => toggleExpanded(category._id)}
                                className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <ChevronRight
                                    className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
                                        }`}
                                />
                            </button>
                        ) : (
                            <div className="w-7" /> // Espaçador para alinhar
                        )}

                        <div className="cursor-grab text-muted-foreground hover:text-foreground">
                            <GripVertical className="w-5 h-5" />
                        </div>

                        <div className={`p-2.5 rounded-xl ${getTypeBadgeColor(category.type)}`}>
                            {getTypeIcon(category.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-foreground truncate">{category.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(category.type)}`}>
                                    {getTypeLabel(category.type)}
                                </span>
                                {hasChildCategories && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                        {children.length} sub
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                /{category.slug}
                                {category.description && ` • ${category.description}`}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <IconButton
                                icon={<Edit2 />}
                                onClick={() => handleOpenModal(category)}
                                colorClass="text-foreground"
                                hoverClass="hover:bg-secondary/80"
                                title="Editar"
                            />
                            <IconButton
                                icon={<Trash2 />}
                                onClick={() => handleDelete(category._id)}
                                colorClass="text-red-400"
                                hoverClass="hover:bg-red-500/20"
                                title="Deletar"
                            />
                        </div>
                    </div>
                </div>

                {/* Subcategorias (aninhadas) */}
                {hasChildCategories && isExpanded && (
                    <div className="mt-2 space-y-2">
                        {children.map(child => renderListItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-3">
            {/* Toolbar Padrão */}
            <Toolbar
                search={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar categorias..."
            >
                {/* Filtro específico: Tipo */}
                <SegmentedControl
                    options={[
                        { value: 'all', label: 'Todas' },
                        { value: 'article', label: 'Artigos' },
                        { value: 'album', label: 'Álbuns' },
                        { value: 'both', label: 'Ambos' },
                    ]}
                    value={typeFilter}
                    onChange={setTypeFilter}
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
                        { value: 'order-asc', label: 'Ordem Crescente', icon: ArrowUpDown },
                        { value: 'order-desc', label: 'Ordem Decrescente', icon: ArrowUpDown },
                    ]}
                    label="Ordenar"
                />

                {/* Padrão: Itens por página */}
                <FilterDropdown
                    value={itemsPerPage.toString()}
                    onChange={(value) => setItemsPerPage(parseInt(value))}
                    options={[
                        { value: '5', label: '5 / página' },
                        { value: '10', label: '10 / página' },
                        { value: '25', label: '25 / página' },
                        { value: '50', label: '50 / página' },
                    ]}
                    label="Exibir"
                />

                {/* Padrão: Botão adicionar */}
                <Button
                    onClick={() => handleOpenModal()}
                    icon={Plus}
                    className="ml-auto"
                >
                    Nova Categoria
                </Button>
            </Toolbar>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Categories List/Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground mt-4">Carregando categorias...</p>
                </div>
            ) : sortedCategories.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <FolderTree className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {searchQuery || typeFilter !== 'all' ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria criada ainda'}
                    </p>
                    {!searchQuery && typeFilter === 'all' && (
                        <Button
                            onClick={() => handleOpenModal()}
                            variant="ghost"
                            className="mt-4"
                        >
                            Criar primeira categoria
                        </Button>
                    )}
                </div>
            ) : viewMode === 'list' ? (
                <div className="space-y-4 w-full">
                    {paginatedCategories.map(cat => renderListItem(cat, 0))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                    {paginatedCategories.map(cat => renderGridCard(cat))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, rootCategories.length)} de {rootCategories.length} categorias
                        {sortedCategories.length !== rootCategories.length && (
                            <span className="text-muted-foreground/70"> ({sortedCategories.length} total com subcategorias)</span>
                        )}
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
                            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
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
                                    className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none"
                                    placeholder="Nome da categoria"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none"
                                    placeholder="slug-da-categoria (gerado automaticamente)"
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
                                    placeholder="Descrição opcional"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tipo *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Category['type'] })}
                                    className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none"
                                >
                                    {typeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Categoria Pai
                                </label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                    className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none"
                                >
                                    <option value="">Nenhuma (raiz)</option>
                                    {categories
                                        .filter(c => c._id !== editingCategory?._id)
                                        .map((cat) => (
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
