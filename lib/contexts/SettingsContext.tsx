"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import * as ThemeSettingsController from "@/lib/theme-settings/ThemeSettings.controller";
import type { ThemeSettings } from "@/lib/theme-settings/ThemeSettings.model";
import type { Media } from "@/lib/medias/Media.model";
import { useAutoLogin } from "./AutoLoginContext";

interface SettingsContextType {
    settings: ThemeSettings | null;
    accentColor: string;
    accentTextColor: string;
    loginPageLogo: Media | undefined;
    sideBarLogoDark: Media | undefined;
    sideBarLogoLight: Media | undefined;
    loading: boolean;
    updateAccentColor: (color: string) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_ACCENT_COLOR = "#0067ff";
const DEFAULT_ACCENT_TEXT_COLOR = "#ffffff";

export function SettingsProvider({ children }: { children: ReactNode }) {
    const { isReady: isAuthReady } = useAutoLogin();
    const [settings, setSettings] = useState<ThemeSettings | null>(null);
    const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
    const [accentTextColor, setAccentTextColor] = useState(DEFAULT_ACCENT_TEXT_COLOR);
    const [loginPageLogo, setLoginPageLogo] = useState<Media | undefined>(undefined);
    const [sideBarLogoDark, setSideBarLogoDark] = useState<Media | undefined>(undefined);
    const [sideBarLogoLight, setSideBarLogoLight] = useState<Media | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const applyColors = useCallback((color: string, textColor: string) => {
        console.log('[SettingsContext] applyColors called with:', color, textColor);
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty("--primary", color);
            document.documentElement.style.setProperty("--primary-foreground", textColor);
            document.documentElement.style.setProperty("--ring", color);
            document.documentElement.style.setProperty("--sidebar-primary", color);
            document.documentElement.style.setProperty("--sidebar-ring", color);
            console.log('[SettingsContext] CSS variables set!');
        }
        setAccentColor(color);
        setAccentTextColor(textColor);
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            console.log('[SettingsContext] Fetching settings...');
            const data = await ThemeSettingsController.getOrCreateThemeSettings();
            console.log('[SettingsContext] Got data:', data);
            if (data) {
                setSettings(data);
                console.log('[SettingsContext] Applying colors:', data.accentColor, data.accentTextColor);
                console.log('[SettingsContext] Logos:', { loginPageLogo: data.loginPageLogo, sideBarLogoDark: data.sideBarLogoDark, sideBarLogoLight: data.sideBarLogoLight });
                applyColors(
                    data.accentColor || DEFAULT_ACCENT_COLOR,
                    data.accentTextColor || DEFAULT_ACCENT_TEXT_COLOR
                );
                setLoginPageLogo(data.loginPageLogo);
                setSideBarLogoDark(data.sideBarLogoDark);
                setSideBarLogoLight(data.sideBarLogoLight);
            } else {
                console.log('[SettingsContext] No data, using defaults');
                applyColors(DEFAULT_ACCENT_COLOR, DEFAULT_ACCENT_TEXT_COLOR);
            }
        } catch (error) {
            console.error("[SettingsContext] Erro ao carregar settings:", error);
            applyColors(DEFAULT_ACCENT_COLOR, DEFAULT_ACCENT_TEXT_COLOR);
        } finally {
            setLoading(false);
        }
    }, [applyColors]);

    useEffect(() => {
        // Só carrega settings após o guest login estar pronto
        if (isAuthReady) {
            fetchSettings();
        }
    }, [isAuthReady, fetchSettings]);

    // Re-aplica cores quando settings mudar
    useEffect(() => {
        if (settings?.accentColor) {
            console.log('[SettingsContext] Re-applying colors from settings:', settings.accentColor);
            applyColors(settings.accentColor, settings.accentTextColor || DEFAULT_ACCENT_TEXT_COLOR);
        }
    }, [settings, applyColors]);

    const updateAccentColor = async (color: string) => {
        if (!settings) return;

        try {
            await ThemeSettingsController.updateThemeSettings({
                id: settings._id,
                updates: { accentColor: color }
            });
            applyColors(color, accentTextColor);
            setSettings({ ...settings, accentColor: color });
        } catch (error) {
            console.error("Erro ao atualizar cor:", error);
        }
    };

    const refreshSettings = async () => {
        await fetchSettings();
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                accentColor,
                accentTextColor,
                loginPageLogo,
                sideBarLogoDark,
                sideBarLogoLight,
                loading,
                updateAccentColor,
                refreshSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
