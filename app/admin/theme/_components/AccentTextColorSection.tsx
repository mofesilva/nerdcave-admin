"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AccentTextColorSectionProps {
    accentTextColor: string;
    saving: boolean;
    onColorSelect: (hex: string) => void;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const TEXT_COLOR_OPTIONS = [
    { hex: "#ffffff", label: "Branco" },
    { hex: "#070707", label: "Preto" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function AccentTextColorSection({
    accentTextColor,
    saving,
    onColorSelect,
}: AccentTextColorSectionProps) {
    return (
        <div className="bg-card rounded-md p-8 shadow-sm border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-2">Cor do Texto de Destaque</h2>
            <p className="text-muted-foreground mb-6">
                Cor do texto sobre a cor de destaque (botões, badges, etc)
            </p>

            <div className="flex items-center gap-3">
                <div className="flex gap-2 flex-wrap items-center">
                    {TEXT_COLOR_OPTIONS.map(({ hex, label }) => {
                        const isSelected = accentTextColor.toLowerCase() === hex.toLowerCase();
                        return (
                            <button
                                key={hex}
                                onClick={() => onColorSelect(hex)}
                                disabled={saving}
                                className={cn(
                                    "w-8 h-8 rounded-md transition-transform hover:scale-110 border border-border",
                                    isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                                )}
                                style={{ backgroundColor: hex }}
                                title={label}
                            >
                                {isSelected && (
                                    <Check
                                        className={cn(
                                            "w-4 h-4 mx-auto drop-shadow",
                                            hex === "#ffffff" ? "text-black" : "text-white"
                                        )}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
                {saving && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            </div>
        </div>
    );
}
