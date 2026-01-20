"use client";

import { Check } from "lucide-react";
import ColorPicker from "@/_components/ColorPicker";
import Button from "@/_components/Button";
import { cn } from "@/lib/utils";

interface ColorRowProps {
    label: string;
    description: string;
    value?: string;
    defaultValue: string;
    presets?: string[];
    onChange: (value: string | undefined) => void;
}

// Verifica se uma cor é clara (para ajustar contraste)
function isLightColor(hex: string): boolean {
    const color = hex.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    // Fórmula de luminância relativa
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

export default function ColorRow({ label, description, value, defaultValue, presets, onChange }: ColorRowProps) {
    const displayValue = value || defaultValue;
    const isCustom = !!value;

    return (
        <div className="py-4 border-b border-border last:border-0">
            {/* Header: Label, Descrição e Resetar */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                {isCustom && (
                    <Button
                        size="sm"
                        onClick={() => onChange(undefined)}
                        className="text-xs"
                    >
                        Resetar
                    </Button>
                )}
            </div>

            {/* Presets + Color Picker - coluna no mobile, row no desktop */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                {/* Presets */}
                {presets && presets.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {presets.map((hex) => {
                            const isSelected = displayValue.toLowerCase() === hex.toLowerCase();
                            const isLight = isLightColor(hex);
                            return (
                                <button
                                    key={hex}
                                    onClick={() => onChange(hex)}
                                    className={cn(
                                        "w-8 h-8 rounded-sm transition-all hover:scale-110 border-2",
                                        isSelected
                                            ? isLight ? "border-neutral-400 scale-110" : "border-white scale-110"
                                            : isLight ? "border-neutral-300" : "border-transparent"
                                    )}
                                    style={{ backgroundColor: hex }}
                                >
                                    {isSelected && (
                                        <Check className={cn(
                                            "w-3 h-3 mx-auto drop-shadow",
                                            isLight ? "text-neutral-700" : "text-white"
                                        )} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-sm shadow-sm border border-border"
                        style={{ backgroundColor: displayValue }}
                    />
                    <ColorPicker
                        value={displayValue}
                        onChange={(hex) => onChange(hex)}
                    />
                    <span className="text-xs font-mono w-16 text-muted-foreground">
                        {displayValue.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
}
