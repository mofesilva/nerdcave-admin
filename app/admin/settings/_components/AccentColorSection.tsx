"use client";

import { Check, Loader2, Bell, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import ColorPicker from "@/_components/ColorPicker";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AccentColorSectionProps {
    accentColor: string;
    accentTextColor: string;
    saving: boolean;
    colorPresets: string[];
    onColorSelect: (hex: string) => void;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function AccentColorSection({
    accentColor,
    accentTextColor,
    saving,
    colorPresets,
    onColorSelect,
}: AccentColorSectionProps) {
    return (
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-2">Cor de Destaque</h2>
            <p className="text-muted-foreground mb-6">
                Cor principal usada em botões e elementos interativos
            </p>

            <div className="flex items-center gap-3">
                <div className="flex gap-2 flex-wrap items-center">
                    {colorPresets.map((hex) => (
                        <button
                            key={hex}
                            onClick={() => onColorSelect(hex)}
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
                    <ColorPicker value={accentColor} onChange={onColorSelect} />
                </div>
                {saving && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            </div>

            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-muted rounded-lg">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: accentColor }} />
                <span className="text-sm font-mono text-foreground">
                    {accentColor.toUpperCase()}
                </span>
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
                                className="px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
                                style={{ backgroundColor: accentColor, color: accentTextColor }}
                            >
                                Primário
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg font-medium border-2 transition-opacity hover:opacity-90"
                                style={{ borderColor: accentColor, color: accentColor }}
                            >
                                Outline
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
                                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                            >
                                Ghost
                            </button>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="space-y-3">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Badges</span>
                        <div className="flex flex-wrap gap-2">
                            <span
                                className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: accentColor, color: accentTextColor }}
                            >
                                Novo
                            </span>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                            >
                                Em destaque
                            </span>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                style={{ borderColor: accentColor, color: accentColor }}
                            >
                                Popular
                            </span>
                        </div>
                    </div>

                    {/* Toggle/Switch */}
                    <div className="space-y-3">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Toggle</span>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-11 h-6 rounded-full p-0.5 transition-colors"
                                style={{ backgroundColor: accentColor }}
                            >
                                <div className="w-5 h-5 rounded-full bg-white shadow translate-x-5 transition-transform" />
                            </div>
                            <div className="w-11 h-6 rounded-full p-0.5 bg-muted">
                                <div className="w-5 h-5 rounded-full bg-white shadow transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* Links e Textos */}
                    <div className="space-y-3">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Links</span>
                        <div className="flex flex-col gap-1">
                            <a href="#" className="text-sm hover:underline" style={{ color: accentColor }}>
                                Link de exemplo →
                            </a>
                            <span className="text-sm text-muted-foreground">
                                Texto com <span style={{ color: accentColor }} className="font-medium">destaque</span> colorido
                            </span>
                        </div>
                    </div>

                    {/* Input Focus */}
                    <div className="space-y-3">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Input (focus)</span>
                        <input
                            type="text"
                            placeholder="Digite algo..."
                            className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm outline-none ring-2"
                            style={{ boxShadow: `0 0 0 2px ${accentColor}` }}
                            readOnly
                        />
                    </div>

                    {/* Ícones */}
                    <div className="space-y-3">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Ícones</span>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: accentColor }}
                            >
                                <Bell className="w-5 h-5" style={{ color: accentTextColor }} />
                            </div>
                            <Star className="w-6 h-6" style={{ color: accentColor, fill: accentColor }} />
                            <Heart className="w-6 h-6" style={{ color: accentColor }} />
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ backgroundColor: accentColor, color: accentTextColor }}
                            >
                                3
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
