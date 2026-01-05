"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, Search, X } from "lucide-react";
import type { Tag as TagType } from "@/lib/tags/Tag.model";
import * as TagsController from "@/lib/tags/Tag.controller";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";

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
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        fetchTags();
    }, []);

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

    const filteredTags = searchQuery
        ? tags.filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : tags;

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
                    Nova Tag
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 max-w-md border border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar tags..."
                    className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground flex-1"
                />
                {searchQuery && (
                    <IconButton
                        icon={<X />}
                        onClick={() => setSearchQuery('')}
                    />
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Tags Grid */}
            <div>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-4">Carregando tags...</p>
                    </div>
                ) : filteredTags.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {searchQuery ? 'Nenhuma tag encontrada' : 'Nenhuma tag criada ainda'}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => handleOpenModal()}
                                variant="ghost"
                                className="mt-4"
                            >
                                Criar primeira tag
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {filteredTags.map((tag) => (
                            <div
                                key={tag._id}
                                className="group bg-card rounded-xl px-4 py-3 border border-border hover:border-primary/30 transition-all flex items-center gap-3"
                            >
                                <Tag className="w-4 h-4 text-primary" />
                                <span className="font-medium text-foreground">{tag.name}</span>
                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
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
                        ))}
                    </div>
                )}
            </div>

            {/* Stats */}
            {tags.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Estatísticas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-secondary rounded-xl p-4">
                            <p className="text-2xl font-bold text-foreground">{tags.length}</p>
                            <p className="text-sm text-muted-foreground">Total de Tags</p>
                        </div>
                        <div className="bg-secondary rounded-xl p-4">
                            <p className="text-2xl font-bold text-foreground">
                                {tags.reduce((acc, tag) => acc + tag.usageCount, 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">Total de Usos</p>
                        </div>
                        <div className="bg-secondary rounded-xl p-4">
                            <p className="text-2xl font-bold text-foreground">
                                {tags.filter(t => t.usageCount > 0).length}
                            </p>
                            <p className="text-sm text-muted-foreground">Tags em Uso</p>
                        </div>
                        <div className="bg-secondary rounded-xl p-4">
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
                    <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-xl">
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
                                    className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground border border-border focus:border-primary focus:outline-none"
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
