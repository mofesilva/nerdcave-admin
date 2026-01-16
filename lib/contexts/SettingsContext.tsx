"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import * as ThemeSettingsController from "@/lib/theme-settings/ThemeSettings.controller";
import type { ThemeSettings } from "@/lib/theme-settings/ThemeSettings.model";
import type { Media } from "@/lib/medias/Media.model";
import { useAutoLogin } from "./AutoLoginContext";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface SettingsContextType {
    settings: ThemeSettings | null;
    accentColor: string;
    accentTextColor: string;
    loginPageLogo: Media | undefined;
    sideBarLogoDark: Media | undefined;
    sideBarLogoLight: Media | undefined;
    loading: boolean;
    updateAccentColor: (color: string) => Promise<void>;
    updateSettingsOptimistic: (updates: Partial<ThemeSettings>) => void;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const LOCAL_STORAGE_KEY = "nerdcave_theme_settings";
const DEFAULT_ACCENT_COLOR = "#0067ff";
const DEFAULT_ACCENT_TEXT_COLOR = "#ffffff";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function saveToLocalStorage(settings: ThemeSettings) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        // localStorage pode estar indisponível
    }
}

function loadFromLocalStorage(): ThemeSettings | null {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        // localStorage pode estar indisponível
    }
    return null;
}

// ─── PROVIDER ────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: ReactNode }) {
    const { isReady: isAuthReady } = useAutoLogin();
    const [settings, setSettings] = useState<ThemeSettings | null>(null);
    const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
    const [accentTextColor, setAccentTextColor] = useState(DEFAULT_ACCENT_TEXT_COLOR);
    const [loginPageLogo, setLoginPageLogo] = useState<Media | undefined>(undefined);
    const [sideBarLogoDark, setSideBarLogoDark] = useState<Media | undefined>(undefined);
    const [sideBarLogoLight, setSideBarLogoLight] = useState<Media | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const initialLoadDone = useRef(false);

    const applyColors = useCallback((color: string, textColor: string) => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty("--primary", color);
            document.documentElement.style.setProperty("--primary-foreground", textColor);
            document.documentElement.style.setProperty("--ring", color);
            document.documentElement.style.setProperty("--sidebar-primary", color);
            document.documentElement.style.setProperty("--sidebar-ring", color);
        }
        setAccentColor(color);
        setAccentTextColor(textColor);
    }, []);

    // Aplica settings de um objeto (usado por cache e fetch)
    const applySettingsData = useCallback((data: ThemeSettings) => {
        setSettings(data);
        applyColors(
            data.accentColor || DEFAULT_ACCENT_COLOR,
            data.accentTextColor || DEFAULT_ACCENT_TEXT_COLOR
        );
        setLoginPageLogo(data.loginPageLogo);
        setSideBarLogoDark(data.sideBarLogoDark);
        setSideBarLogoLight(data.sideBarLogoLight);
    }, [applyColors]);

    const fetchSettings = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await ThemeSettingsController.getOrCreateThemeSettings();
            if (data) {
                applySettingsData(data);
                saveToLocalStorage(data);
            } else {
                applyColors(DEFAULT_ACCENT_COLOR, DEFAULT_ACCENT_TEXT_COLOR);
            }
        } catch (error) {
            console.error("[SettingsContext] Erro ao carregar settings:", error);
            applyColors(DEFAULT_ACCENT_COLOR, DEFAULT_ACCENT_TEXT_COLOR);
        } finally {
            setLoading(false);
        }
    }, [applyColors, applySettingsData]);

    // Carrega do localStorage PRIMEIRO (instantâneo), depois sincroniza com banco
    useEffect(() => {
        if (initialLoadDone.current) return;
        initialLoadDone.current = true;

        // 1. Aplica cache do localStorage imediatamente (sem flash)
        const cached = loadFromLocalStorage();
        if (cached) {
            applySettingsData(cached);
            setLoading(false);
        }
    }, [applySettingsData]);

    // Depois do auth, sincroniza com banco em background
    useEffect(() => {
        if (isAuthReady) {
            // Se já tem cache, faz fetch silencioso (sem loading)
            const hasCache = loadFromLocalStorage() !== null;
            fetchSettings(!hasCache);
        }
    }, [isAuthReady, fetchSettings]);

    // ─── ATUALIZAÇÃO OTIMISTA ────────────────────────────────────────────────

    const updateSettingsOptimistic = useCallback((updates: Partial<ThemeSettings>) => {
        if (!settings) return;

        // 1. Atualiza estado local IMEDIATAMENTE
        const newSettings = { ...settings, ...updates };
        applySettingsData(newSettings);

        // 2. Salva no localStorage
        saveToLocalStorage(newSettings);

        // 3. Salva no banco em BACKGROUND (não bloqueia UI)
        ThemeSettingsController.updateThemeSettings({
            id: settings._id,
            updates,
        }).catch((error) => {
            console.error("[SettingsContext] Erro ao salvar no banco:", error);
            // Em caso de erro, poderia reverter... mas mantemos simples por enquanto
        });
    }, [settings, applySettingsData]);

    const updateAccentColor = async (color: string) => {
        if (!settings) return;
        updateSettingsOptimistic({ accentColor: color });
    };

    const refreshSettings = async () => {
        await fetchSettings(false); // Não mostra loading no refresh
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
                updateSettingsOptimistic,
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
