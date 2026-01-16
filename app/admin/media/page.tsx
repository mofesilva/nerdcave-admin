"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Image as ImageIcon, Grid, List } from "lucide-react";
import * as MediaController from "@/lib/medias/Media.controller";
import type { Media } from "@/lib/medias/Media.model";
import Button from "@/_components/Button";
import SegmentedControl from "@/_components/SegmentedControl";
import Select from "@/_components/Select";
import Toolbar from "@/_components/Toolbar";
import Pagination from "@/_components/Pagination";
import DropZone from "@/_components/DropZone";
import EmptyState from "@/_components/EmptyState";
import ErrorAlert from "@/_components/ErrorAlert";
import GridSkeleton from "@/_components/GridSkeleton";
import ImageLightbox from "@/_components/ImageLightbox";
import MediaCard from "./_components/MediaCard";

const PAGE_SIZES = [
    { value: "15", label: "15" },
    { value: "30", label: "30" },
    { value: "50", label: "50" },
];

const VIEW_MODES = [
    { value: "grid" as const, label: "Grid", icon: Grid },
    { value: "list" as const, label: "Lista", icon: List },
];

export default function MediaPage() {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPages, setTotalPages] = useState(1);
    const loadedRef = useRef(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Carrega dados
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        async function load() {
            setLoading(true);
            try {
                const result = await MediaController.getMediasPaginated({ page, pageSize, query: search || undefined });
                setMedia(result.items);
                setTotalPages(result.totalPages);
            } catch {
                setError("Erro ao carregar");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Recarrega quando muda filtros
    async function reload(newPage = page, newPageSize = pageSize, newSearch = search) {
        setLoading(true);
        setMedia([]); // LIMPA A LISTA ANTES
        try {
            const result = await MediaController.getMediasPaginated({
                page: newPage,
                pageSize: newPageSize,
                query: newSearch || undefined
            });
            setMedia(result.items);
            setTotalPages(result.totalPages);
            setPage(newPage);
            setPageSize(newPageSize);
            setSearch(newSearch);
        } catch {
            setError("Erro ao carregar");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(files: FileList) {
        setUploading(true);
        setError(null);
        try {
            for (const file of Array.from(files)) {
                if (!file.type.startsWith("image/")) continue;
                await MediaController.createMedia({
                    file,
                    data: {
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        fileName: '',
                    }
                });
            }
            reload(1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao fazer upload");
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete() {
        if (!confirm(`Deletar ${selected.size} item(s)?`)) return;
        for (const id of selected) {
            await MediaController.deleteMedia({ id });
        }
        setSelected(new Set());
        reload(1);
    }

    function toggle(id: string) {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    return (
        <div className="space-y-6">
            {/* Upload */}
            <DropZone
                onFiles={handleUpload}
                disabled={uploading}
            />

            <Toolbar
                search={search}
                onSearchChange={setSearch}
                onSearch={(value) => reload(1, pageSize, value)}
            >
                <SegmentedControl options={VIEW_MODES} value={viewMode} onChange={setViewMode} iconOnly />

                <Select
                    value={String(pageSize)}
                    onChange={(v) => reload(1, Number(v), search)}
                    options={PAGE_SIZES}
                    className="h-full"
                />

                {selected.size > 0 && (
                    <Button onClick={handleDelete} variant="danger" icon={Trash2} className="h-full">
                        Deletar ({selected.size})
                    </Button>
                )}

                {uploading && <Button disabled loading icon={Upload} className="h-full">Enviando...</Button>}
            </Toolbar>

            {error && (
                <ErrorAlert message={error} onDismiss={() => setError(null)} />
            )}

            {/* Content */}
            {loading ? (
                <GridSkeleton count={pageSize} />
            ) : media.length === 0 ? (
                <EmptyState icon={ImageIcon} title="Nenhum arquivo" />
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {media.map((item, index) => (
                        <MediaCard
                            key={item._id}
                            src={MediaController.getMediaUrl({ fileName: item.fileName })}
                            title={item.title}
                            selected={selected.has(item._id)}
                            onSelect={() => toggle(item._id)}
                            onView={() => setLightboxIndex(index)}
                            variant="grid"
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {media.map((item, index) => (
                        <MediaCard
                            key={item._id}
                            src={MediaController.getMediaUrl({ fileName: item.fileName })}
                            title={item.title}
                            selected={selected.has(item._id)}
                            onSelect={() => toggle(item._id)}
                            onView={() => setLightboxIndex(index)}
                            variant="list"
                        />
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && media[lightboxIndex] && (
                <ImageLightbox
                    src={MediaController.getMediaUrl({ fileName: media[lightboxIndex].fileName })}
                    alt={media[lightboxIndex].title}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={lightboxIndex > 0 ? () => setLightboxIndex(lightboxIndex - 1) : undefined}
                    onNext={lightboxIndex < media.length - 1 ? () => setLightboxIndex(lightboxIndex + 1) : undefined}
                />
            )}

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => reload(p)}
                className="pt-4"
            />
        </div>
    );
}
