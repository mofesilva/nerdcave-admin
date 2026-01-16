"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Image as ImageIcon, X, Bell, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/_components/Button";
import ColorPicker from "@/_components/ColorPicker";
import MediaPickerModal from "@/_components/MediaPickerModal";
import type { ThemeSettings } from "@/lib/theme-settings/ThemeSettings.model";
import type { Media } from "@/lib/medias/Media.model";
import { getMediaUrl } from "@/lib/medias/Media.controller";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface BlogSettingsTabProps {
    settings: ThemeSettings;
    saving: boolean;
    colorPresets: string[];
    onSave: (updates: Partial<ThemeSettings>) => Promise<void>;
}

type BlogLogoField = "blogLogo" | "blogFavicon";

const HEADER_STYLE_OPTIONS = [
    { value: 'minimal' as const, label: 'Minimalista' },
    { value: 'full' as const, label: 'Completo' },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function BlogSettingsTab({
    settings,
    saving,
    colorPresets,
    onSave,
}: BlogSettingsTabProps) {
    // Form state
    const [accentColor, setAccentColor] = useState("#0067ff");
    const [accentTextColor, setAccentTextColor] = useState("#ffffff");
    const [backgroundColor, setBackgroundColor] = useState("#171717");
    const [blogName, setBlogName] = useState("");
    const [blogDescription, setBlogDescription] = useState("");
    const [blogKeywords, setBlogKeywords] = useState("");
    const [blogFooterText, setBlogFooterText] = useState("");
    const [blogHeaderStyle, setBlogHeaderStyle] = useState<'minimal' | 'full'>('minimal');
    const [blogLogo, setBlogLogo] = useState<Media | undefined>();
    const [blogFavicon, setBlogFavicon] = useState<Media | undefined>();

    // Media picker
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<BlogLogoField | null>(null);

    // Sync with settings
    useEffect(() => {
        setAccentColor((settings.accentColor || "#0067ff").toLowerCase());
        setAccentTextColor((settings.accentTextColor || "#ffffff").toLowerCase());
        setBackgroundColor((settings.backgroundColor || "#171717").toLowerCase());
        setBlogName(settings.blogName || "");
        setBlogDescription(settings.blogDescription || "");
        setBlogKeywords(settings.blogKeywords || "");
        setBlogFooterText(settings.blogFooterText || "");
        setBlogHeaderStyle(settings.blogHeaderStyle || 'minimal');
        setBlogLogo(settings.blogLogo);
        setBlogFavicon(settings.blogFavicon);
    }, [settings]);

    function handleMediaSelect(media: Media) {
        if (!mediaPickerTarget) return;
        if (mediaPickerTarget === "blogLogo") setBlogLogo(media);
        if (mediaPickerTarget === "blogFavicon") setBlogFavicon(media);
        setMediaPickerOpen(false);
        setMediaPickerTarget(null);
    }

    async function handleSaveAll() {
        await onSave({
            accentColor,
            accentTextColor,
            backgroundColor,
            blogName: blogName || undefined,
            blogDescription: blogDescription || undefined,
            blogKeywords: blogKeywords || undefined,
            blogFooterText: blogFooterText || undefined,
            blogHeaderStyle,
            blogLogo,
            blogFavicon,
        });
    }

    return (
        <>
            <div className="space-y-3">
                {/* Cor de Destaque */}
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50">
                    <h2 className="text-xl font-bold text-foreground mb-2">Cor de Destaque</h2>
                    <p className="text-muted-foreground mb-6">
                        Cor principal usada em botões e links no site público
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="flex gap-2 flex-wrap items-center">
                            {colorPresets.map((hex) => (
                                <button
                                    key={hex}
                                    onClick={() => setAccentColor(hex.toLowerCase())}
                                    disabled={saving}
                                    className={cn(
                                        "w-8 h-8 rounded-lg transition-transform hover:scale-110",
                                        accentColor.toLowerCase() === hex.toLowerCase() &&
                                        "ring-2 ring-white ring-offset-2 ring-offset-card"
                                    )}
                                    style={{ backgroundColor: hex }}
                                >
                                    {accentColor.toLowerCase() === hex.toLowerCase() && (
                                        <Check className="w-4 h-4 text-white mx-auto drop-shadow" />
                                    )}
                                </button>
                            ))}
                            <ColorPicker value={accentColor} onChange={(c) => setAccentColor(c.toLowerCase())} />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-muted rounded-lg">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: accentColor }} />
                        <span className="text-sm font-mono text-foreground">{accentColor.toUpperCase()}</span>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 pt-6 border-t border-border/50">
                        <span className="text-sm text-muted-foreground mb-4 block">Pré-visualização</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Botões */}
                            <div className="space-y-3">
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Botões</span>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className="px-4 py-2 rounded-lg font-medium"
                                        style={{ backgroundColor: accentColor, color: accentTextColor }}
                                    >
                                        Primário
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-lg font-medium border-2"
                                        style={{ borderColor: accentColor, color: accentColor }}
                                    >
                                        Outline
                                    </button>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-3">
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Links</span>
                                <div className="flex flex-col gap-1">
                                    <a href="#" className="text-sm hover:underline" style={{ color: accentColor }}>
                                        Link de exemplo →
                                    </a>
                                    <span className="text-sm text-muted-foreground">
                                        Texto com <span style={{ color: accentColor }} className="font-medium">destaque</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cor do Texto */}
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50">
                    <h2 className="text-xl font-bold text-foreground mb-2">Cor do Texto de Destaque</h2>
                    <p className="text-muted-foreground mb-6">
                        Cor do texto sobre a cor de destaque
                    </p>

                    <div className="flex gap-2">
                        {[{ hex: "#ffffff", label: "Branco" }, { hex: "#070707", label: "Preto" }].map(({ hex, label }) => (
                            <button
                                key={hex}
                                onClick={() => setAccentTextColor(hex.toLowerCase())}
                                disabled={saving}
                                className={cn(
                                    "w-8 h-8 rounded-lg transition-transform hover:scale-110 border border-border",
                                    accentTextColor.toLowerCase() === hex.toLowerCase() &&
                                    "ring-2 ring-primary ring-offset-2 ring-offset-card"
                                )}
                                style={{ backgroundColor: hex }}
                                title={label}
                            >
                                {accentTextColor.toLowerCase() === hex.toLowerCase() && (
                                    <Check className={cn("w-4 h-4 mx-auto", hex === "#ffffff" ? "text-black" : "text-white")} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cor de Fundo */}
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50">
                    <h2 className="text-xl font-bold text-foreground mb-2">Cor de Fundo</h2>
                    <p className="text-muted-foreground mb-6">
                        Cor de fundo principal do site público
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="flex gap-2 flex-wrap items-center">
                            {["#171717", "#0a0a0a", "#1a1a2e", "#16213e", "#0f0f0f", "#1e1e1e"].map((hex) => (
                                <button
                                    key={hex}
                                    onClick={() => setBackgroundColor(hex.toLowerCase())}
                                    disabled={saving}
                                    className={cn(
                                        "w-8 h-8 rounded-lg transition-transform hover:scale-110 border border-border/50",
                                        backgroundColor.toLowerCase() === hex.toLowerCase() &&
                                        "ring-2 ring-white ring-offset-2 ring-offset-card"
                                    )}
                                    style={{ backgroundColor: hex }}
                                >
                                    {backgroundColor.toLowerCase() === hex.toLowerCase() && (
                                        <Check className="w-4 h-4 text-white mx-auto drop-shadow" />
                                    )}
                                </button>
                            ))}
                            <ColorPicker value={backgroundColor} onChange={(c) => setBackgroundColor(c.toLowerCase())} />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-muted rounded-lg">
                        <div className="w-4 h-4 rounded border border-border/50" style={{ backgroundColor }} />
                        <span className="text-sm font-mono text-foreground">{backgroundColor.toUpperCase()}</span>
                    </div>
                </div>

                {/* Logos */}
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50">
                    <h2 className="text-xl font-bold text-foreground mb-2">Logo e Favicon</h2>
                    <p className="text-muted-foreground mb-6">
                        Imagens do site público
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Blog Logo */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Logo do Site</label>
                            <div className="relative">
                                {blogLogo ? (
                                    <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden group">
                                        <img
                                            src={getMediaUrl({ fileName: blogLogo.fileName })}
                                            alt="Logo"
                                            className="w-full h-full object-contain p-2"
                                        />
                                        <button
                                            onClick={() => setBlogLogo(undefined)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setMediaPickerTarget("blogLogo"); setMediaPickerOpen(true); }}
                                        className="w-full h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                        <span className="text-sm">Selecionar Logo</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Favicon */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Favicon</label>
                            <div className="relative">
                                {blogFavicon ? (
                                    <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden group">
                                        <img
                                            src={getMediaUrl({ fileName: blogFavicon.fileName })}
                                            alt="Favicon"
                                            className="w-full h-full object-contain p-2"
                                        />
                                        <button
                                            onClick={() => setBlogFavicon(undefined)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setMediaPickerTarget("blogFavicon"); setMediaPickerOpen(true); }}
                                        className="w-full h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                        <span className="text-sm">Selecionar Favicon</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informações do Blog */}
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50">
                    <h2 className="text-xl font-bold text-foreground mb-2">Informações do Site</h2>
                    <p className="text-muted-foreground mb-6">
                        Metadados e SEO do site público
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Nome do Site</label>
                            <input
                                type="text"
                                value={blogName}
                                onChange={(e) => setBlogName(e.target.value)}
                                placeholder="Meu Blog"
                                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
                            <textarea
                                value={blogDescription}
                                onChange={(e) => setBlogDescription(e.target.value)}
                                placeholder="Uma breve descrição do seu site..."
                                rows={3}
                                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Palavras-chave (SEO)</label>
                            <input
                                type="text"
                                value={blogKeywords}
                                onChange={(e) => setBlogKeywords(e.target.value)}
                                placeholder="blog, tecnologia, games, ..."
                                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Texto do Rodapé</label>
                            <input
                                type="text"
                                value={blogFooterText}
                                onChange={(e) => setBlogFooterText(e.target.value)}
                                placeholder="© 2026 Todos os direitos reservados"
                                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSaveAll}
                    disabled={saving}
                    icon={saving ? Loader2 : Check}
                >
                    {saving ? "Salvando..." : "Salvar Configurações"}
                </Button>
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={mediaPickerOpen}
                onClose={() => { setMediaPickerOpen(false); setMediaPickerTarget(null); }}
                onSelect={handleMediaSelect}
            />
        </>
    );
}
