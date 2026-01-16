"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import type { Link, LinkType } from "@/lib/links/Link.model";
import * as LinksController from "@/lib/links/Link.controller";
import Button from "@/_components/Button";
import IconButton from "@/_components/IconButton";

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    isActive: true,
    type: 'main' as LinkType,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      setLoading(true);
      const models = await LinksController.getAllLinks();
      models.sort((a: Link, b: Link) => a.order - b.order);
      setLinks(models);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar links");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (link?: Link) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        description: link.description,
        url: link.url,
        isActive: link.isActive,
        type: link.type,
      });
    } else {
      setEditingLink(null);
      setFormData({
        title: '',
        description: '',
        url: '',
        isActive: true,
        type: 'main',
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
        await LinksController.updateLink({ id: editingLink._id, updates: formData });
      } else {
        const payload = {
          ...formData,
          order: links.length,
        };
        await LinksController.createLink({ data: payload as any });
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
    try {
      await LinksController.toggleLinkActive({ id });
      await fetchLinks();
    } catch (error) {
      console.error('Error toggling link:', error);
      setError('Erro ao atualizar link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;

    try {
      await LinksController.deleteLink({ id });
      await fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      setError('Erro ao deletar link');
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
          Novo Link
        </Button>
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
            <Button
              onClick={() => handleOpenModal()}
              variant="ghost"
            >
              Criar primeiro link
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <div
                key={link._id}
                className="group bg-card hover:bg-accent/50 border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-md flex items-center gap-4"
              >
                {/* Drag Handle */}
                <IconButton
                  icon={<GripVertical />}
                  className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                />

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

                {/* Actions */}
                <div className="flex items-center gap-2 pl-4 border-l border-border">
                  <IconButton
                    icon={link.isActive ? <Eye /> : <EyeOff />}
                    onClick={() => handleToggleActive(link._id)}
                    title={link.isActive ? 'Ocultar' : 'Mostrar'}
                  />
                  <IconButton
                    icon={<Edit2 />}
                    onClick={() => handleOpenModal(link)}
                    colorClass="text-blue-500"
                    hoverClass="hover:bg-blue-500/10"
                    title="Editar"
                  />
                  <IconButton
                    icon={<Trash2 />}
                    onClick={() => handleDelete(link._id)}
                    colorClass="text-destructive"
                    hoverClass="hover:bg-destructive/10"
                    title="Deletar"
                  />
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
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={loading}
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
                    {loading ? 'Salvando...' : (editingLink ? 'Salvar Alterações' : 'Criar Link')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
