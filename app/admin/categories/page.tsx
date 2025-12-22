"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FolderTree, GripVertical } from "lucide-react";
import { CategoryModel } from "@/lib/models/Category.model";
import { CategoriesController } from "@/lib/controllers";
import type { Category } from "@/types";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        type: 'both' as Category['type'],
        parentId: '',
        order: 0,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            setLoading(true);
            const models = await CategoriesController.getAll();
            setCategories(models);
            setError(null);
        } catch (err) {
            setError("Falha ao carregar categorias");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenModal = (category?: CategoryModel) => {
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
                slug: formData.slug || CategoryModel.generateSlug(formData.name),
                description: formData.description || undefined,
                type: formData.type,
                parentId: formData.parentId || undefined,
                order: formData.order,
            };

            if (editingCategory) {
                await CategoriesController.update(editingCategory._id, payload);
            } else {
                await CategoriesController.create(payload);
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
            await CategoriesController.delete(id);
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

    const getTypeLabel = (type: Category['type']) => {
        const option = typeOptions.find(o => o.value === type);
        return option?.name || type;
    };

    const getTypeBadgeColor = (type: Category['type']) => {
        switch (type) {
            case 'article': return 'bg-blue-500/20 text-blue-400';
            case 'album': return 'bg-purple-500/20 text-purple-400';
            case 'both': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div />
                <Button
                    onClick={() => handleOpenModal()}
                    icon={Plus}
                    size="lg"
                >
                    Nova Categoria
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Categories List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-4">Carregando categorias...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <FolderTree className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhuma categoria criada ainda</p>
                        <Button
                            onClick={() => handleOpenModal()}
                            variant="ghost"
                            className="mt-4"
                        >
                            Criar primeira categoria
                        </Button>
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category._id}
                            className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="cursor-grab text-muted-foreground hover:text-foreground">
                                    <GripVertical className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-foreground truncate">{category.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(category.type)}`}>
                                            {getTypeLabel(category.type)}
                                        </span>
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
                    ))
                )}
            </div>

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
