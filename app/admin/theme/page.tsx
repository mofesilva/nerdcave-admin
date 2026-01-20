"use client";
import { useState, useEffect } from "react";
import { Loader2, Check, Sun, Moon } from "lucide-react";
import Button from "@/_components/Button";
import Toolbar from "@/_components/Toolbar";
import SegmentedControl from "@/_components/SegmentedControl";
import MediaPickerModal from "@/_components/MediaPickerModal";
import * as SettingsController from "@/lib/settings/Settings.controller";
import type { AdminThemeSetting } from "@/lib/settings/Settings.model";
import type { ThemeMode, ThemeMedia } from "@/lib/settings/Settings.types";
import type { Media } from "@/lib/medias/Media.model";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { LogosSection, ThemePreview, ColorRow } from "./_components";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const MODE_OPTIONS = [
    { value: "light" as const, label: "Claro", icon: Sun },
    { value: "dark" as const, label: "Escuro", icon: Moon },
];

const ACCENT_PRESETS = [
    "#0067ff", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316",
    "#f59e0b", "#84cc16", "#22c55e", "#10b981", "#14b8a6",
    "#06b6d4", "#0ea5e9", "#6366f1",
];

const LIGHT_BG_PRESETS = ["#ffffff", "#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6", "#fffbeb", "#ecfdf5"];
const DARK_BG_PRESETS = ["#000000", "#070707", "#0a0a0a", "#111111", "#171717", "#1f1f1f", "#262626"];
const LIGHT_FG_PRESETS = ["#000000", "#212529", "#343a40", "#495057", "#6c757d"];
const DARK_FG_PRESETS = ["#ffffff", "#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6"];
const LIGHT_SIDEBAR_PRESETS = ["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da"];
const DARK_SIDEBAR_PRESETS = ["#000000", "#0a0a0a", "#111111", "#171717", "#1f1f1f", "#262626"];
const LIGHT_CARD_PRESETS = ["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6"];
const DARK_CARD_PRESETS = ["#000000", "#0a0a0a", "#111111", "#171717", "#1f1f1f"];

// ─── TYPES ───────────────────────────────────────────────────────────────────

type MediaField = "sidebarLogo" | "loginLogo" | "favicon";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ThemePage() {
    const { activeThemeMode, applyThemeSettings } = useSettings();

    // UI State - qual tema está sendo EDITADO (NÃO muda o tema ativo do sistema)
    const [selectedMode, setSelectedMode] = useState<ThemeMode>("dark");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State - 2 registros separados
    const [lightTheme, setLightTheme] = useState<AdminThemeSetting | null>(null);
    const [darkTheme, setDarkTheme] = useState<AdminThemeSetting | null>(null);

    // Media picker
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<MediaField | null>(null);

    // Tema atual baseado na seleção
    const currentTheme = selectedMode === "light" ? lightTheme : darkTheme;

    // Atualiza um campo do tema atual (SÓ NO STATE, não aplica no app ainda)
    const updateField = <K extends keyof AdminThemeSetting>(
        field: K,
        value: AdminThemeSetting[K]
    ) => {
        if (selectedMode === "light") {
            setLightTheme(prev => prev ? { ...prev, [field]: value } : prev);
        } else {
            setDarkTheme(prev => prev ? { ...prev, [field]: value } : prev);
        }
    };

    // Atualiza uma media dentro de themeMedia
    const updateThemeMedia = (field: MediaField, value: Media | undefined) => {
        if (selectedMode === "light") {
            setLightTheme(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    themeMedia: {
                        ...prev.themeMedia,
                        [field]: value,
                    },
                };
            });
        } else {
            setDarkTheme(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    themeMedia: {
                        ...prev.themeMedia,
                        [field]: value,
                    },
                };
            });
        }
    };

    // Carregar ambos os temas
    useEffect(() => {
        async function fetchSettings() {
            try {
                setLoading(true);
                const { light, dark } = await SettingsController.getAllAdminThemeSettings();
                setLightTheme(light);
                setDarkTheme(dark);
            } catch (error) {
                console.error("Erro ao carregar settings:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    // Salvar tema atual
    async function handleSave() {
        if (!currentTheme?._id) {
            alert("Erro: configurações não carregadas. Recarregue a página.");
            return;
        }

        setSaving(true);

        try {
            // 1. Salva no banco de dados (sempre)
            await SettingsController.updateThemeSetting({
                id: currentTheme._id,
                updates: currentTheme,
            });

            // 2. Salva no localStorage e aplica CSS SOMENTE se selectedMode === activeThemeMode
            applyThemeSettings(currentTheme, selectedMode);
        } catch (err) {
            console.error("Erro ao salvar no banco:", err);
            alert("Erro ao salvar. Tente novamente.");
        }

        setSaving(false);
    }

    // Resetar tema atual para defaults
    async function handleReset() {
        if (!confirm(`Resetar o ${selectedMode === 'light' ? 'Tema Claro' : 'Tema Escuro'} para os valores padrão?`)) {
            return;
        }

        setSaving(true);
        try {
            const resetTheme = await SettingsController.resetThemeSetting({ themeMode: selectedMode });

            // Atualiza o state correto baseado no modo
            if (selectedMode === 'light') {
                setLightTheme(resetTheme);
            } else {
                setDarkTheme(resetTheme);
            }

            // Salva no localStorage e aplica CSS se for o tema ativo
            applyThemeSettings(resetTheme, selectedMode);
        } catch (error) {
            console.error("Erro ao resetar tema:", error);
            alert("Erro ao resetar tema. Tente novamente.");
        } finally {
            setSaving(false);
        }
    }

    function handleMediaSelect(media: Media) {
        if (mediaPickerTarget) {
            updateThemeMedia(mediaPickerTarget, media);
        }
        setMediaPickerOpen(false);
        setMediaPickerTarget(null);
    }

    if (loading || !currentTheme) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const isLight = selectedMode === "light";
    const bgPresets = isLight ? LIGHT_BG_PRESETS : DARK_BG_PRESETS;
    const fgPresets = isLight ? LIGHT_FG_PRESETS : DARK_FG_PRESETS;
    const sidebarPresets = isLight ? LIGHT_SIDEBAR_PRESETS : DARK_SIDEBAR_PRESETS;
    const cardPresets = isLight ? LIGHT_CARD_PRESETS : DARK_CARD_PRESETS;
    const defaultBg = isLight ? "#f8f9fa" : "#070707";
    const defaultFg = isLight ? "#212529" : "#f8f9fa";
    const defaultSidebar = isLight ? "#DEE2E6" : "#111111";
    const defaultCard = isLight ? "#DEE2E6" : "#111111";

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <Toolbar hideSearch>
                <SegmentedControl
                    options={MODE_OPTIONS}
                    value={selectedMode}
                    onChange={setSelectedMode}
                    mobileFullWidth
                />
            </Toolbar>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Configurações de Cores */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Cor de Destaque */}
                    <div className="bg-card rounded-md p-6 shadow-sm border border-border/50">
                        <h2 className="text-lg font-bold text-foreground mb-1">Cor de Destaque</h2>
                        <p className="text-sm text-muted-foreground mb-4">Botões e elementos interativos</p>
                        <ColorRow
                            label="Cor Principal"
                            description="Cor usada em botões, links e elementos de ação"
                            value={currentTheme.accentColor}
                            defaultValue="#0067ff"
                            presets={ACCENT_PRESETS}
                            onChange={(v) => updateField("accentColor", v)}
                        />
                        <ColorRow
                            label="Texto sobre Destaque"
                            description="Cor do texto sobre elementos de destaque"
                            value={currentTheme.accentTextColor}
                            defaultValue="#ffffff"
                            presets={["#ffffff", "#000000"]}
                            onChange={(v) => updateField("accentTextColor", v)}
                        />
                    </div>

                    {/* Cores de Layout */}
                    <div className="bg-card rounded-md p-6 shadow-sm border border-border/50">
                        <h2 className="text-lg font-bold text-foreground mb-1">Cores do Layout</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Configurações para o tema {isLight ? "claro" : "escuro"}
                        </p>
                        <ColorRow
                            label="Cor de Fundo"
                            description="Fundo principal das páginas"
                            value={currentTheme.backgroundColor}
                            defaultValue={defaultBg}
                            presets={bgPresets}
                            onChange={(v) => updateField("backgroundColor", v)}
                        />
                        <ColorRow
                            label="Cor do Texto Principal"
                            description="Cor principal do texto"
                            value={currentTheme.foregroundColor}
                            defaultValue={defaultFg}
                            presets={fgPresets}
                            onChange={(v) => updateField("foregroundColor", v)}
                        />
                    </div>

                    {/* Cores de Texto */}
                    <div className="bg-card rounded-md p-6 shadow-sm border border-border/50">
                        <h2 className="text-lg font-bold text-foreground mb-1">Cores de Texto</h2>
                        <p className="text-sm text-muted-foreground mb-4">Hierarquia visual do texto</p>
                        <ColorRow
                            label="Texto Primário"
                            description="Títulos e texto principal"
                            value={currentTheme.primaryTextColor}
                            defaultValue={defaultFg}
                            presets={fgPresets}
                            onChange={(v) => updateField("primaryTextColor", v)}
                        />
                        <ColorRow
                            label="Texto Secundário"
                            description="Subtítulos e texto de apoio"
                            value={currentTheme.secondaryTextColor}
                            defaultValue={isLight ? "#495057" : "#e9ecef"}
                            presets={fgPresets}
                            onChange={(v) => updateField("secondaryTextColor", v)}
                        />
                        <ColorRow
                            label="Texto Mudo"
                            description="Labels, placeholders e texto discreto"
                            value={currentTheme.mutedTextColor}
                            defaultValue={isLight ? "#6c757d" : "#a3a3a3"}
                            presets={isLight ? ["#6c757d", "#868e96", "#adb5bd"] : ["#737373", "#a3a3a3", "#d4d4d4"]}
                            onChange={(v) => updateField("mutedTextColor", v)}
                        />
                        <ColorRow
                            label="Texto Destacado"
                            description="Texto com ênfase especial"
                            value={currentTheme.highlightedTextColor}
                            defaultValue={isLight ? "#000000" : "#ffffff"}
                            presets={["#ffffff", "#000000"]}
                            onChange={(v) => updateField("highlightedTextColor", v)}
                        />
                        <ColorRow
                            label="Cor Muda"
                            description="Elementos visuais discretos (bordas, separadores)"
                            value={currentTheme.mutedColor}
                            defaultValue={isLight ? "#dee2e6" : "#404040"}
                            presets={isLight ? ["#ced4da", "#dee2e6", "#e9ecef"] : ["#262626", "#404040", "#525252"]}
                            onChange={(v) => updateField("mutedColor", v)}
                        />
                    </div>

                    {/* Cores da Sidebar */}
                    <div className="bg-card rounded-md p-6 shadow-sm border border-border/50">
                        <h2 className="text-lg font-bold text-foreground mb-1">Cores da Sidebar</h2>
                        <p className="text-sm text-muted-foreground mb-4">Menu lateral de navegação</p>
                        <ColorRow
                            label="Fundo da Sidebar"
                            description="Cor de fundo da barra lateral"
                            value={currentTheme.sidebarBackgroundColor}
                            defaultValue={defaultSidebar}
                            presets={sidebarPresets}
                            onChange={(v) => updateField("sidebarBackgroundColor", v)}
                        />
                        <ColorRow
                            label="Texto da Sidebar"
                            description="Cor do texto e ícones"
                            value={currentTheme.sidebarForegroundColor}
                            defaultValue={isLight ? "#495057" : "#e5e5e5"}
                            presets={fgPresets}
                            onChange={(v) => updateField("sidebarForegroundColor", v)}
                        />
                        <ColorRow
                            label="Item Ativo"
                            description="Cor do item de menu selecionado"
                            value={currentTheme.sidebarActiveColor}
                            defaultValue="#0067ff"
                            presets={ACCENT_PRESETS}
                            onChange={(v) => updateField("sidebarActiveColor", v)}
                        />
                        <ColorRow
                            label="Item Hover"
                            description="Cor ao passar o mouse"
                            value={currentTheme.sidebarHoverColor}
                            defaultValue={isLight ? "#e9ecef" : "#262626"}
                            presets={isLight ? ["#e9ecef", "#f1f3f5", "#dee2e6"] : ["#1f1f1f", "#262626", "#333333"]}
                            onChange={(v) => updateField("sidebarHoverColor", v)}
                        />
                    </div>

                    {/* Cores dos Cards */}
                    <div className="bg-card rounded-md p-6 shadow-sm border border-border/50">
                        <h2 className="text-lg font-bold text-foreground mb-1">Cores dos Cards</h2>
                        <p className="text-sm text-muted-foreground mb-4">Painéis e containers</p>
                        <ColorRow
                            label="Fundo do Card"
                            description="Cor de fundo dos cards"
                            value={currentTheme.cardBackgroundColor}
                            defaultValue={defaultCard}
                            presets={cardPresets}
                            onChange={(v) => updateField("cardBackgroundColor", v)}
                        />
                        <ColorRow
                            label="Texto do Card"
                            description="Cor do texto dentro dos cards"
                            value={currentTheme.cardForegroundColor}
                            defaultValue={defaultFg}
                            presets={fgPresets}
                            onChange={(v) => updateField("cardForegroundColor", v)}
                        />
                        <ColorRow
                            label="Borda do Card"
                            description="Cor da borda dos cards"
                            value={currentTheme.cardBorderColor}
                            defaultValue={isLight ? "#dee2e6" : "#262626"}
                            presets={isLight ? ["#ced4da", "#dee2e6", "#e9ecef"] : ["#1f1f1f", "#262626", "#333333"]}
                            onChange={(v) => updateField("cardBorderColor", v)}
                        />
                    </div>

                    {/* Logos */}
                    <LogosSection
                        sidebarLogo={currentTheme.themeMedia?.sidebarLogo}
                        loginLogo={currentTheme.themeMedia?.loginLogo}
                        favicon={currentTheme.themeMedia?.favicon}
                        onOpenPicker={(field) => {
                            setMediaPickerTarget(field as MediaField);
                            setMediaPickerOpen(true);
                        }}
                        onRemove={(field) => updateThemeMedia(field as MediaField, undefined)}
                    />
                </div>

                {/* Preview */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="lg:sticky lg:top-3">
                        <ThemePreview
                            backgroundColor={currentTheme.backgroundColor || defaultBg}
                            foregroundColor={currentTheme.foregroundColor || defaultFg}
                            accentColor={currentTheme.accentColor || "#0067ff"}
                            accentTextColor={currentTheme.accentTextColor || "#ffffff"}
                            sidebarBackgroundColor={currentTheme.sidebarBackgroundColor || defaultSidebar}
                            sidebarForegroundColor={currentTheme.sidebarForegroundColor || (isLight ? "#495057" : "#e5e5e5")}
                            sidebarActiveColor={currentTheme.sidebarActiveColor || "#0067ff"}
                            sidebarHoverColor={currentTheme.sidebarHoverColor || (isLight ? "#e9ecef" : "#262626")}
                            cardBackgroundColor={currentTheme.cardBackgroundColor || defaultCard}
                            cardForegroundColor={currentTheme.cardForegroundColor || defaultFg}
                            cardBorderColor={currentTheme.cardBorderColor || (isLight ? "#dee2e6" : "#262626")}
                            mutedTextColor={currentTheme.mutedTextColor || (isLight ? "#6c757d" : "#a3a3a3")}
                            mutedColor={currentTheme.mutedColor || (isLight ? "#dee2e6" : "#404040")}
                        />

                        {/* Botões Salvar e Resetar - Desktop */}
                        <div className="hidden lg:flex flex-col gap-2 mt-6">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                icon={saving ? Loader2 : Check}
                            >
                                {saving ? "Salvando..." : "Salvar Configurações"}
                            </Button>
                            <Button
                                onClick={handleReset}
                                disabled={saving}
                                variant="secondary"
                            >
                                Resetar para Padrão
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botões Salvar e Resetar - Mobile */}
            <div className="flex lg:hidden justify-end gap-3">
                <Button
                    onClick={handleReset}
                    disabled={saving}
                    variant="secondary"
                >
                    Resetar para Padrão
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    icon={saving ? Loader2 : Check}
                >
                    {saving ? "Salvando..." : "Salvar Configurações"}
                </Button>
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={mediaPickerOpen}
                onClose={() => {
                    setMediaPickerOpen(false);
                    setMediaPickerTarget(null);
                }}
                onSelect={handleMediaSelect}
            />
        </div>
    );
}
