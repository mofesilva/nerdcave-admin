"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { LinkModel } from "@/lib/models/Link.model";
import { LinksController } from "@/lib/controllers";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    gradient: 'from-purple-500 to-pink-500',
    isActive: true,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      setLoading(true);
      const models = await LinksController.getAll();
      models.sort((a, b) => a.order - b.order);
      setLinks(models);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar links");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (link?: LinkModel) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        description: link.description,
        url: link.url,
        gradient: link.gradient,
        isActive: link.isActive,
      });
    } else {
      setEditingLink(null);
      setFormData({
        title: '',
        description: '',
        url: '',
        gradient: '#000000',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingLink) {
        await LinksController.update(editingLink._id, formData);
      } else {
        const payload = {
          ...formData,
          order: links.length,
          clicks: 0,
          type: 'main' as const,
        };
        await LinksController.create(payload);
      }

      handleCloseModal();
      await fetchLinks();
    } catch (error) {
      console.error('Error saving link:', error);
      setError('Erro ao salvar link');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    const link = links.find(l => l._id === id);
    if (!link) return;

    try {
      await LinksController.update(id, { isActive: !link.isActive });
      await fetchLinks();
    } catch (error) {
      console.error('Error toggling link:', error);
      setError('Erro ao atualizar link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;

    try {
      await LinksController.delete(id);
      await fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      setError('Erro ao deletar link');
    }
  };

  const gradientOptions = [
    { name: 'Purple-Pink', value: 'from-purple-500 to-pink-500' },
    { name: 'Blue-Cyan', value: 'from-blue-500 to-cyan-500' },
    { name: 'Red-Pink', value: 'from-red-500 to-pink-500' },
    { name: 'Green-Emerald', value: 'from-green-500 to-emerald-500' },
    { name: 'Orange-Yellow', value: 'from-orange-500 to-yellow-500' },
    { name: 'Violet-Purple', value: 'from-violet-500 to-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Gerenciar Links</h1>
          <p className="text-muted-foreground mt-2 text-lg">Organize e personalize sua presença digital</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Novo Link
        </button>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando seus links...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center text-destructive">
            {error}
          </div>
        ) : links.length === 0 ? (
          <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum link criado</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Comece adicionando seu primeiro link para compartilhar com seu público.</p>
            <button
              onClick={() => handleOpenModal()}
              className="text-primary font-medium hover:underline"
            >
              Criar primeiro link
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <div
                key={link._id}
                className="group bg-card hover:bg-accent/50 border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-md flex items-center gap-4"
              >
                {/* Drag Handle */}
                <button className="p-2 text-muted-foreground hover:text-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground text-lg truncate">{link.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${link.isActive
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground border-border'
                      }`}>
                      {link.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm truncate mb-1">{link.description}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline truncate block"
                  >
                    {link.url}
                  </a>
                </div>

                {/* Stats */}
                <div className="px-6 py-2 bg-background rounded-lg border border-border text-center min-w-[100px]">
                  <span className="block text-xl font-bold text-foreground">{link.clicks}</span>
                  <span className="text-xs text-muted-foreground tracking-wider">Cliques</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pl-4 border-l border-border">
                  <button
                    onClick={() => handleToggleActive(link._id)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors cursor-pointer"
                    title={link.isActive ? 'Ocultar' : 'Mostrar'}
                  >
                    {link.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleOpenModal(link)}
                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={handleCloseModal}>
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {editingLink ? 'Editar Link' : 'Novo Link'}
              </h2>
              <p className="text-muted-foreground mb-8">Preencha as informações abaixo para {editingLink ? 'atualizar' : 'criar'} seu link.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all"
                      placeholder="Ex: Meu Canal do YouTube"
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
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all resize-none"
                      placeholder="Uma breve descrição sobre este link..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      URL de Destino
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all"
                      placeholder="https://..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Estilo do Cartão
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {gradientOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, gradient: option.value })}
                          className={`group relative p-1 rounded-xl transition-all ${formData.gradient === option.value
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                            : 'hover:opacity-80'
                            }`}
                        >
                          <div className={`h-12 rounded-lg bg-gradient-to-r ${option.value} shadow-sm`} />
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {formData.gradient === option.value && (
                              <div className="bg-black/20 rounded-full p-1">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </span>
                          <p className="text-xs text-muted-foreground mt-2 text-center font-medium">{option.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-background rounded-xl border border-border">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-primary border-border rounded focus:ring-primary bg-card"
                    />
                    <label htmlFor="isActive" className="ml-3 flex-1 cursor-pointer">
                      <span className="block text-sm font-medium text-foreground">Link Ativo</span>
                      <span className="block text-xs text-muted-foreground">Se desativado, o link ficará oculto na sua página pública</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl font-medium text-foreground bg-background border border-border hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Salvando...' : (editingLink ? 'Salvar Alterações' : 'Criar Link')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
