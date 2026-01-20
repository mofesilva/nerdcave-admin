"use client";

import { useState } from "react";
import { Sun, Moon, Check } from "lucide-react";
import ColorPicker from "@/_components/ColorPicker";
import ColorRow from "./ColorRow";
import SegmentedControl from "@/_components/SegmentedControl";
import { cn } from "@/lib/utils";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ThemeColorsSectionProps {
    // Accent colors
    accentColor: string;
    accentTextColor: string;
    colorPresets: string[];
    // Light mode colors
    backgroundColorLight?: string;
    sidebarBackgroundColorLight?: string;
    foregroundColorLight?: string;
    cardBackgroundColorLight?: string;
    // Dark mode colors
    backgroundColorDark?: string;
    sidebarBackgroundColorDark?: string;
    foregroundColorDark?: string;
    cardBackgroundColorDark?: string;
    // Handlers
    saving: boolean;
    onAccentColorChange: (hex: string) => void;
    onAccentTextColorChange: (hex: string) => void;
    onColorChange: (field: string, value: string | undefined) => void;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const DEFAULTS = {
    light: {
        background: "#f8f9fa",
        sidebarBackground: "#DEE2E6",
        foreground: "#212529",
        cardBackground: "#DEE2E6",
    },
    dark: {
        background: "#070707",
        sidebarBackground: "#111111",
        foreground: "#f8f9fa",
        cardBackground: "#111111",
    },
};

const PRESETS = {
    light: {
        background: ["#ffffff", "#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6", "#fffbeb", "#fef3c7", "#ecfdf5", "#d1fae5"],
        sidebar: ["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#fef3c7", "#d1fae5", "#dbeafe"],
        foreground: ["#000000", "#212529", "#343a40", "#495057", "#6c757d", "#1f2937", "#111827", "#0f172a"],
        card: ["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#fef3c7", "#d1fae5", "#dbeafe", "#fce7f3"],
    },
    dark: {
        background: ["#000000", "#070707", "#0a0a0a", "#111111", "#171717", "#1a1a1a", "#1f1f1f", "#262626"],
        sidebar: ["#000000", "#0a0a0a", "#111111", "#171717", "#1f1f1f", "#262626", "#2d2d2d", "#333333"],
        foreground: ["#ffffff", "#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#9ca3af"],
        card: ["#000000", "#0a0a0a", "#111111", "#171717", "#1f1f1f", "#262626", "#2d2d2d", "#333333"],
    },
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ThemeColorsSection({
    accentColor,
    accentTextColor,
    colorPresets,
    backgroundColorLight,
    sidebarBackgroundColorLight,
    foregroundColorLight,
    cardBackgroundColorLight,
    backgroundColorDark,
    sidebarBackgroundColorDark,
    foregroundColorDark,
    cardBackgroundColorDark,
    saving,
    onAccentColorChange,
    onAccentTextColorChange,
    onColorChange,
}: ThemeColorsSectionProps) {
    const [selectedMode, setSelectedMode] = useState<"light" | "dark">("dark");

    return (
        <div className="bg-card rounded-md p-8 shadow-sm border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-2">Cores do Tema</h2>
            <p className="text-muted-foreground mb-6">
                Personalize as cores de destaque e do layout
            </p>

            {/* Cor de Destaque */}
            <div className="mb-8 pb-6 border-b border-border">
                <h3 className="font-semibold text-foreground mb-1">Cor de Destaque</h3>
                <p className="text-sm text-muted-foreground mb-4">Botões e elementos interativos</p>

                <div className="flex gap-2 flex-wrap mb-4">
                    {colorPresets.map((hex) => (
                        <button
                            key={hex}
                            onClick={() => onAccentColorChange(hex)}
                            disabled={saving}
                            className={cn(
                                "w-8 h-8 rounded-md transition-all hover:scale-110 border-2",
                                accentColor.toLowerCase() === hex.toLowerCase()
                                    ? "border-foreground scale-110"
                                    : "border-transparent"
                            )}
                            style={{ backgroundColor: hex }}
                        >
                            {accentColor.toLowerCase() === hex.toLowerCase() && (
                                <Check className="w-4 h-4 text-white mx-auto drop-shadow" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-10 h-10 rounded-md border border-border"
                            style={{ backgroundColor: accentColor }}
                        />
                        <ColorPicker value={accentColor} onChange={onAccentColorChange} />
                        <span className="text-sm font-mono text-muted-foreground">
                            {accentColor.toUpperCase()}
                        </span>
                    </div>

                    <div className="h-8 w-px bg-border" />

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Texto:</span>
                        {[
                            { hex: "#ffffff", label: "Branco" },
                            { hex: "#000000", label: "Preto" },
                        ].map(({ hex, label }) => {
                            const isSelected = accentTextColor.toLowerCase() === hex.toLowerCase();
                            return (
                                <button
                                    key={hex}
                                    onClick={() => onAccentTextColorChange(hex)}
                                    disabled={saving}
                                    className={cn(
                                        "w-8 h-8 rounded-md border transition-all hover:scale-105",
                                        isSelected ? "ring-2 ring-primary ring-offset-2" : "border-border"
                                    )}
                                    style={{ backgroundColor: hex }}
                                    title={label}
                                >
                                    {isSelected && (
                                        <Check className={cn("w-4 h-4 mx-auto", hex === "#ffffff" ? "text-black" : "text-white")} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mode Selector */}
            <SegmentedControl
                options={[
                    { value: "light", label: "Modo Claro", icon: Sun },
                    { value: "dark", label: "Modo Escuro", icon: Moon },
                ]}
                value={selectedMode}
                onChange={setSelectedMode}
            />

            {/* Layout Colors */}
            <div className="mt-6">
                {selectedMode === "light" && (
                    <>
                        <ColorRow
                            label="Cor de Fundo"
                            description="Fundo principal das páginas"
                            value={backgroundColorLight}
                            defaultValue={DEFAULTS.light.background}
                            presets={PRESETS.light.background}
                            onChange={(v) => onColorChange("backgroundColorLight", v)}
                        />
                        <ColorRow
                            label="Sidebar"
                            description="Cor de fundo da barra lateral"
                            value={sidebarBackgroundColorLight}
                            defaultValue={DEFAULTS.light.sidebarBackground}
                            presets={PRESETS.light.sidebar}
                            onChange={(v) => onColorChange("sidebarBackgroundColorLight", v)}
                        />
                        <ColorRow
                            label="Texto Principal"
                            description="Cor do texto principal"
                            value={foregroundColorLight}
                            defaultValue={DEFAULTS.light.foreground}
                            presets={PRESETS.light.foreground}
                            onChange={(v) => onColorChange("foregroundColorLight", v)}
                        />
                        <ColorRow
                            label="Cards"
                            description="Cor de fundo dos cards"
                            value={cardBackgroundColorLight}
                            defaultValue={DEFAULTS.light.cardBackground}
                            presets={PRESETS.light.card}
                            onChange={(v) => onColorChange("cardBackgroundColorLight", v)}
                        />
                    </>
                )}

                {selectedMode === "dark" && (
                    <>
                        <ColorRow
                            label="Cor de Fundo"
                            description="Fundo principal das páginas"
                            value={backgroundColorDark}
                            defaultValue={DEFAULTS.dark.background}
                            presets={PRESETS.dark.background}
                            onChange={(v) => onColorChange("backgroundColorDark", v)}
                        />
                        <ColorRow
                            label="Sidebar"
                            description="Cor de fundo da barra lateral"
                            value={sidebarBackgroundColorDark}
                            defaultValue={DEFAULTS.dark.sidebarBackground}
                            presets={PRESETS.dark.sidebar}
                            onChange={(v) => onColorChange("sidebarBackgroundColorDark", v)}
                        />
                        <ColorRow
                            label="Texto Principal"
                            description="Cor do texto principal"
                            value={foregroundColorDark}
                            defaultValue={DEFAULTS.dark.foreground}
                            presets={PRESETS.dark.foreground}
                            onChange={(v) => onColorChange("foregroundColorDark", v)}
                        />
                        <ColorRow
                            label="Cards"
                            description="Cor de fundo dos cards"
                            value={cardBackgroundColorDark}
                            defaultValue={DEFAULTS.dark.cardBackground}
                            presets={PRESETS.dark.card}
                            onChange={(v) => onColorChange("cardBackgroundColorDark", v)}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
