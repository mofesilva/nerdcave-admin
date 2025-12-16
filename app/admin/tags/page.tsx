"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, Search, X } from "lucide-react";
import { TagModel } from "@/lib/models/Tag.model";
import { TagsController } from "@/lib/controllers";

export default function TagsPage() {
    const [tags, setTags] = useState<TagModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<TagModel | null>(null);
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
            const models = await TagsController.getAll();
            setTags(models);
            setError(null);
        } catch (err) {
            setError("Falha ao carregar tags");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenModal = (tag?: TagModel) => {
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
                await TagsController.update(editingTag._id, { name: formData.name });
            } else {
                await TagsController.create({ name: formData.name });
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
            await TagsController.delete(id);
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
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Tags</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Gerencie as tags do seu conteúdo</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Nova Tag
                </button>
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
                    <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
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
                            <button
                                onClick={() => handleOpenModal()}
                                className="mt-4 text-primary hover:underline"
                            >
                                Criar primeira tag
                            </button>
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
                                    <button
                                        onClick={() => handleOpenModal(tag)}
                                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tag._id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                                        title="Deletar"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
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
                                    Slug: {formData.name ? TagModel.generateSlug(formData.name) : '—'}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
