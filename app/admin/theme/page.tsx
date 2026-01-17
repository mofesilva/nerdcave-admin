"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, Shield, Globe } from "lucide-react";
import Button from "@/_components/Button";
import Toolbar from "@/_components/Toolbar";
import SegmentedControl from "@/_components/SegmentedControl";
import MediaPickerModal from "@/_components/MediaPickerModal";
import * as ThemeSettingsController from "@/lib/theme-settings/ThemeSettings.controller";
import type { ThemeSettings, ThemeType } from "@/lib/theme-settings/ThemeSettings.model";
import type { Media } from "@/lib/medias/Media.model";
import { useSettings } from "@/lib/contexts/SettingsContext";
import {
    AccentColorSection,
    LogosSection,
    BlogSettingsTab,
    ThemeColorsSection,
} from "./_components";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const TAB_OPTIONS = [
    { value: "admin" as const, label: "Painel Admin", icon: Shield },
    { value: "blog" as const, label: "Site Público", icon: Globe },
];

const COLOR_PRESETS = [
    "#0067ff", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316",
    "#f59e0b", "#84cc16", "#22c55e", "#10b981", "#14b8a6",
    "#06b6d4", "#0ea5e9", "#6366f1",
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

type LogoField = "loginPageLogo" | "sideBarLogoDark" | "sideBarLogoLight" | "adminFavicon";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ThemePage() {
    const { updateSettingsOptimistic } = useSettings();
    const [activeTab, setActiveTab] = useState<ThemeType>("admin");
    const [adminSettings, setAdminSettings] = useState<ThemeSettings | null>(null);
    const [blogSettings, setBlogSettings] = useState<ThemeSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Admin Form state
    const [accentColor, setAccentColor] = useState("#0067ff");
    const [accentTextColor, setAccentTextColor] = useState("#ffffff");
    const [loginPageLogo, setLoginPageLogo] = useState<Media | undefined>();
    const [sideBarLogoDark, setSideBarLogoDark] = useState<Media | undefined>();
    const [sideBarLogoLight, setSideBarLogoLight] = useState<Media | undefined>();
    const [adminFavicon, setAdminFavicon] = useState<Media | undefined>();

    // Theme colors state
    const [backgroundLight, setBackgroundLight] = useState<string | undefined>();
    const [sidebarBackgroundLight, setSidebarBackgroundLight] = useState<string | undefined>();
    const [textColorLight, setTextColorLight] = useState<string | undefined>();
    const [cardColorLight, setCardColorLight] = useState<string | undefined>();
    const [backgroundDark, setBackgroundDark] = useState<string | undefined>();
    const [sidebarBackgroundDark, setSidebarBackgroundDark] = useState<string | undefined>();
    const [textColorDark, setTextColorDark] = useState<string | undefined>();
    const [cardColorDark, setCardColorDark] = useState<string | undefined>();

    // Media picker
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<LogoField | null>(null);

    // ─── EFFECTS ─────────────────────────────────────────────────────────────

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (adminSettings) {
            setAccentColor((adminSettings.accentColor || "#0067ff").toLowerCase());
            setAccentTextColor((adminSettings.accentTextColor || "#ffffff").toLowerCase());
            setLoginPageLogo(adminSettings.loginPageLogo);
            setSideBarLogoDark(adminSettings.sideBarLogoDark);
            setSideBarLogoLight(adminSettings.sideBarLogoLight);
            setAdminFavicon(adminSettings.adminFavicon);
            // Theme colors
            setBackgroundLight(adminSettings.backgroundLight);
            setSidebarBackgroundLight(adminSettings.sidebarBackgroundLight);
            setTextColorLight(adminSettings.textColorLight);
            setCardColorLight(adminSettings.cardColorLight);
            setBackgroundDark(adminSettings.backgroundDark);
            setSidebarBackgroundDark(adminSettings.sidebarBackgroundDark);
            setTextColorDark(adminSettings.textColorDark);
            setCardColorDark(adminSettings.cardColorDark);
        }
    }, [adminSettings]);

    // ─── HANDLERS ────────────────────────────────────────────────────────────

    async function fetchSettings() {
        try {
            setLoading(true);
            const [admin, blog] = await Promise.all([
                ThemeSettingsController.getOrCreateThemeSettings('admin'),
                ThemeSettingsController.getOrCreateThemeSettings('blog'),
            ]);
            setAdminSettings(admin);
            setBlogSettings(blog);
        } catch (error) {
            console.error("Erro ao carregar settings:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveAdmin(updates: Partial<ThemeSettings>) {
        if (!adminSettings) return;

        setSaving(true);
        try {
            // Atualiza UI imediatamente (otimista) + salva no banco em background
            updateSettingsOptimistic(updates);
            setAdminSettings({ ...adminSettings, ...updates });
        } catch (error) {
            console.error("Erro ao salvar:", error);
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveBlog(updates: Partial<ThemeSettings>) {
        if (!blogSettings) return;

        setSaving(true);
        try {
            const updated = await ThemeSettingsController.updateThemeSettings({
                id: blogSettings._id,
                updates,
            });
            if (updated) {
                setBlogSettings(updated);
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
        } finally {
            setSaving(false);
        }
    }

    function handleOpenMediaPicker(target: LogoField) {
        setMediaPickerTarget(target);
        setMediaPickerOpen(true);
    }

    function handleMediaSelect(media: Media) {
        if (!mediaPickerTarget) return;

        switch (mediaPickerTarget) {
            case "loginPageLogo":
                setLoginPageLogo(media);
                break;
            case "sideBarLogoDark":
                setSideBarLogoDark(media);
                break;
            case "sideBarLogoLight":
                setSideBarLogoLight(media);
                break;
            case "adminFavicon":
                setAdminFavicon(media);
                break;
        }

        setMediaPickerOpen(false);
        setMediaPickerTarget(null);
    }

    function handleRemoveLogo(field: LogoField) {
        switch (field) {
            case "loginPageLogo":
                setLoginPageLogo(undefined);
                break;
            case "sideBarLogoDark":
                setSideBarLogoDark(undefined);
                break;
            case "sideBarLogoLight":
                setSideBarLogoLight(undefined);
                break;
            case "adminFavicon":
                setAdminFavicon(undefined);
                break;
        }
    }

    function handleThemeColorChange(field: string, value: string | undefined) {
        switch (field) {
            case "backgroundLight":
                setBackgroundLight(value);
                break;
            case "sidebarBackgroundLight":
                setSidebarBackgroundLight(value);
                break;
            case "textColorLight":
                setTextColorLight(value);
                break;
            case "cardColorLight":
                setCardColorLight(value);
                break;
            case "backgroundDark":
                setBackgroundDark(value);
                break;
            case "sidebarBackgroundDark":
                setSidebarBackgroundDark(value);
                break;
            case "textColorDark":
                setTextColorDark(value);
                break;
            case "cardColorDark":
                setCardColorDark(value);
                break;
        }
    }

    async function handleSaveAdminAll() {
        await handleSaveAdmin({
            accentColor,
            accentTextColor,
            loginPageLogo,
            sideBarLogoDark,
            sideBarLogoLight,
            adminFavicon,
            // Theme colors
            backgroundLight,
            sidebarBackgroundLight,
            textColorLight,
            cardColorLight,
            backgroundDark,
            sidebarBackgroundDark,
            textColorDark,
            cardColorDark,
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Toolbar com Tabs */}
            <Toolbar hideSearch>
                <SegmentedControl
                    options={TAB_OPTIONS}
                    value={activeTab}
                    onChange={setActiveTab}
                />
            </Toolbar>

            {/* Admin Tab */}
            {activeTab === "admin" && (
                <>
                    <div className="space-y-3">
                        <AccentColorSection
                            accentColor={accentColor}
                            accentTextColor={accentTextColor}
                            saving={saving}
                            colorPresets={COLOR_PRESETS}
                            onColorSelect={(hex: string) => setAccentColor(hex.toLowerCase())}
                            onTextColorSelect={(hex: string) => setAccentTextColor(hex.toLowerCase())}
                        />

                        <ThemeColorsSection
                            backgroundLight={backgroundLight}
                            sidebarBackgroundLight={sidebarBackgroundLight}
                            textColorLight={textColorLight}
                            cardColorLight={cardColorLight}
                            backgroundDark={backgroundDark}
                            sidebarBackgroundDark={sidebarBackgroundDark}
                            textColorDark={textColorDark}
                            cardColorDark={cardColorDark}
                            saving={saving}
                            onColorChange={handleThemeColorChange}
                        />

                        <LogosSection
                            loginPageLogo={loginPageLogo}
                            sideBarLogoDark={sideBarLogoDark}
                            sideBarLogoLight={sideBarLogoLight}
                            onOpenPicker={handleOpenMediaPicker}
                            onRemove={handleRemoveLogo}
                        />
                    </div>

                    {/* Botão Salvar Admin */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSaveAdminAll}
                            disabled={saving}
                            icon={saving ? Loader2 : Check}
                        >
                            {saving ? "Salvando..." : "Salvar Configurações"}
                        </Button>
                    </div>
                </>
            )}

            {/* Blog Tab */}
            {activeTab === "blog" && blogSettings && (
                <BlogSettingsTab
                    settings={blogSettings}
                    saving={saving}
                    colorPresets={COLOR_PRESETS}
                    onSave={handleSaveBlog}
                />
            )}

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
