"use client";

import { Sun, Moon } from "lucide-react";
import ColorPicker from "@/_components/ColorPicker";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ThemeColorsSectionProps {
    // Light colors
    backgroundLight?: string;
    sidebarBackgroundLight?: string;
    textColorLight?: string;
    cardColorLight?: string;
    // Dark colors
    backgroundDark?: string;
    sidebarBackgroundDark?: string;
    textColorDark?: string;
    cardColorDark?: string;
    // Handlers
    saving: boolean;
    onColorChange: (field: string, value: string | undefined) => void;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const DEFAULTS = {
    light: {
        background: "#f8f9fa",
        sidebarBackground: "#DEE2E6",
        textColor: "#212529",
        cardColor: "#DEE2E6",
    },
    dark: {
        background: "#070707",
        sidebarBackground: "#111111",
        textColor: "#f8f9fa",
        cardColor: "#111111",
    },
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

interface ColorRowProps {
    label: string;
    description: string;
    value?: string;
    defaultValue: string;
    onChange: (value: string | undefined) => void;
    isDark?: boolean;
    previewTextColor?: string;
}

function ColorRow({ label, description, value, defaultValue, onChange, isDark, previewTextColor }: ColorRowProps) {
    const displayValue = value || defaultValue;
    const isCustom = !!value;

    // Usa previewTextColor se fornecido, senão usa cores padrão baseado em isDark
    const textColor = previewTextColor || (isDark ? '#f4f4f5' : '#18181b');
    const mutedColor = previewTextColor ? `${previewTextColor}99` : (isDark ? '#a1a1aa' : '#71717a');

    return (
        <div
            className="flex items-center justify-between py-3 border-b last:border-0"
            style={{ borderColor: isDark ? 'rgba(63,63,70,0.3)' : 'rgba(212,212,216,0.5)' }}
        >
            <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: textColor }}>{label}</p>
                <p className="text-xs" style={{ color: mutedColor }}>{description}</p>
            </div>
            <div className="flex items-center gap-2">
                {isCustom && (
                    <button
                        onClick={() => onChange(undefined)}
                        className="text-xs transition-colors hover:opacity-80"
                        style={{ color: mutedColor }}
                    >
                        Resetar
                    </button>
                )}
                <div
                    className="w-8 h-8 rounded shadow-sm border"
                    style={{
                        backgroundColor: displayValue,
                        borderColor: isDark ? '#52525b' : '#d4d4d8'
                    }}
                />
                <ColorPicker
                    value={displayValue}
                    onChange={(hex) => onChange(hex)}
                />
                <span
                    className="text-xs font-mono w-16"
                    style={{ color: mutedColor }}
                >
                    {displayValue.toUpperCase()}
                </span>
            </div>
        </div>
    );
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ThemeColorsSection({
    backgroundLight,
    sidebarBackgroundLight,
    textColorLight,
    cardColorLight,
    backgroundDark,
    sidebarBackgroundDark,
    textColorDark,
    cardColorDark,
    saving,
    onColorChange,
}: ThemeColorsSectionProps) {
    // Cores atuais para preview
    const lightBg = backgroundLight || DEFAULTS.light.background;
    const lightText = textColorLight || DEFAULTS.light.textColor;
    const lightBorder = sidebarBackgroundLight || DEFAULTS.light.sidebarBackground;

    const darkBg = backgroundDark || DEFAULTS.dark.background;
    const darkText = textColorDark || DEFAULTS.dark.textColor;
    const darkBorder = sidebarBackgroundDark || DEFAULTS.dark.sidebarBackground;

    return (
        <div className="bg-card rounded-md p-8 shadow-sm border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-2">Cores do Tema</h2>
            <p className="text-muted-foreground mb-6">
                Personalize as cores de fundo, sidebar, texto e cards para cada modo
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Light Mode - Preview com cores selecionadas */}
                <div
                    className="rounded-lg p-4"
                    style={{
                        backgroundColor: lightBg,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: lightBorder
                    }}
                >
                    <div
                        className="flex items-center gap-2 mb-4 pb-3"
                        style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: lightBorder }}
                    >
                        <Sun className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold" style={{ color: lightText }}>Modo Claro</h3>
                    </div>

                    <ColorRow
                        label="Cor de Fundo"
                        description="Fundo principal das páginas"
                        value={backgroundLight}
                        defaultValue={DEFAULTS.light.background}
                        onChange={(v) => onColorChange("backgroundLight", v)}
                        previewTextColor={lightText}
                    />
                    <ColorRow
                        label="Sidebar"
                        description="Cor de fundo da barra lateral"
                        value={sidebarBackgroundLight}
                        defaultValue={DEFAULTS.light.sidebarBackground}
                        onChange={(v) => onColorChange("sidebarBackgroundLight", v)}
                        previewTextColor={lightText}
                    />
                    <ColorRow
                        label="Texto"
                        description="Cor do texto principal"
                        value={textColorLight}
                        defaultValue={DEFAULTS.light.textColor}
                        onChange={(v) => onColorChange("textColorLight", v)}
                        previewTextColor={lightText}
                    />
                    <ColorRow
                        label="Cards"
                        description="Cor de fundo dos cards"
                        value={cardColorLight}
                        defaultValue={DEFAULTS.light.cardColor}
                        onChange={(v) => onColorChange("cardColorLight", v)}
                        previewTextColor={lightText}
                    />
                </div>

                {/* Dark Mode - Preview com cores selecionadas */}
                <div
                    className="rounded-lg p-4"
                    style={{
                        backgroundColor: darkBg,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: darkBorder
                    }}
                >
                    <div
                        className="flex items-center gap-2 mb-4 pb-3"
                        style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: darkBorder }}
                    >
                        <Moon className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold" style={{ color: darkText }}>Modo Escuro</h3>
                    </div>

                    <ColorRow
                        label="Cor de Fundo"
                        description="Fundo principal das páginas"
                        value={backgroundDark}
                        defaultValue={DEFAULTS.dark.background}
                        onChange={(v) => onColorChange("backgroundDark", v)}
                        isDark
                        previewTextColor={darkText}
                    />
                    <ColorRow
                        label="Sidebar"
                        description="Cor de fundo da barra lateral"
                        value={sidebarBackgroundDark}
                        defaultValue={DEFAULTS.dark.sidebarBackground}
                        onChange={(v) => onColorChange("sidebarBackgroundDark", v)}
                        isDark
                        previewTextColor={darkText}
                    />
                    <ColorRow
                        label="Texto"
                        description="Cor do texto principal"
                        value={textColorDark}
                        defaultValue={DEFAULTS.dark.textColor}
                        onChange={(v) => onColorChange("textColorDark", v)}
                        isDark
                        previewTextColor={darkText}
                    />
                    <ColorRow
                        label="Cards"
                        description="Cor de fundo dos cards"
                        value={cardColorDark}
                        defaultValue={DEFAULTS.dark.cardColor}
                        onChange={(v) => onColorChange("cardColorDark", v)}
                        isDark
                        previewTextColor={darkText}
                    />
                </div>
            </div>
        </div>
    );
}
