"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Eye, EyeOff, FolderOpen } from "lucide-react";
import Link from "next/link";
import { AlbumModel } from "@/lib/models/Album.model";
import { AlbumsController } from "@/lib/controllers";
import { CategoriesController } from "@/lib/controllers";
import { CategoryModel } from "@/lib/models/Category.model";

export default function AlbumsPage() {
    const [albums, setAlbums] = useState<AlbumModel[]>([]);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<AlbumModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        status: 'draft' as 'draft' | 'published',
        isPublic: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const [albumsList, categoriesList] = await Promise.all([
                AlbumsController.getAll(),
                CategoriesController.getForAlbums(),
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

    const handleOpenModal = (album?: AlbumModel) => {
        if (album) {
            setEditingAlbum(album);
            setFormData({
                title: album.title,
                description: album.description,
                categoryId: album.categoryId,
                status: album.status,
                isPublic: album.isPublic,
            });
        } else {
            setEditingAlbum(null);
            setFormData({
                title: '',
                description: '',
                categoryId: categories[0]?._id || '',
                status: 'draft',
                isPublic: true,
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
                await AlbumsController.update(editingAlbum._id, formData);
            } else {
                await AlbumsController.create({
                    ...formData,
                    tags: [],
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

    const handleTogglePublish = async (album: AlbumModel) => {
        try {
            if (album.status === 'published') {
                await AlbumsController.unpublish(album._id);
            } else {
                await AlbumsController.publish(album._id);
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
            await AlbumsController.delete(id);
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Álbuns</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Gerencie suas galerias de fotos</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Novo Álbum
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Albums Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Carregando álbuns...</p>
                </div>
            ) : albums.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum álbum criado ainda</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="mt-4 text-primary hover:underline"
                    >
                        Criar primeiro álbum
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => (
                        <div
                            key={album._id}
                            className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all group"
                        >
                            {/* Cover Image */}
                            <Link href={`/admin/albums/${album._id}`}>
                                <div className="aspect-video bg-secondary relative cursor-pointer">
                                    {album.coverMediaId ? (
                                        <img
                                            src={`/api/media/${album.coverMediaId}`}
                                            alt={album.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                                        </div>
                                    )}

                                    {/* Photo count badge */}
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                                        {album.mediaCount} imagem(ns)
                                    </div>

                                    {/* Status badge */}
                                    <div className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${album.status === 'published'
                                            ? 'bg-green-500/20 text-green-400'
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
                                            {getCategoryName(album.categoryId)} • {album.views} visualizações
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                    <button
                                        onClick={() => handleTogglePublish(album)}
                                        className={`p-2 rounded-lg transition-colors ${album.status === 'published'
                                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                                            }`}
                                        title={album.status === 'published' ? 'Despublicar' : 'Publicar'}
                                    >
                                        {album.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(album)}
                                        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(album._id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        title="Deletar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <Link
                                        href={`/admin/albums/${album._id}`}
                                        className="ml-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-colors"
                                    >
                                        Gerenciar Fotos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
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

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublic}
                                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-sm text-foreground">Álbum público</span>
                                </label>
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
