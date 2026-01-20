"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import * as SettingsController from "@/lib/settings/Settings.controller";
import type { AdminThemeSetting } from "@/lib/settings/Settings.model";
import type { ThemeMode } from "@/lib/settings/Settings.types";
import type { Media } from "@/lib/medias/Media.model";
import { useAutoLogin } from "./AutoLoginContext";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface SettingsContextType {
    settings: AdminThemeSetting | null;
    activeThemeMode: ThemeMode;
    accentColor: string;
    accentTextColor: string;
    sidebarLogo: Media | undefined;
    loginLogo: Media | undefined;
    favicon: Media | undefined;
    loading: boolean;
    updateAccentColor: (color: string) => Promise<void>;
    /**
     * Salva um tema no localStorage e aplica CSS se for o tema ativo.
     * @param data - Os dados do tema
     * @param mode - O modo do tema (light/dark) - OBRIGATÓRIO para garantir isolamento
     */
    applyThemeSettings: (data: AdminThemeSetting, mode: ThemeMode) => void;
    /**
     * Troca o modo ativo (light/dark) e aplica o tema correspondente.
     * Usado pelo toggle de tema no header ou configurações.
     */
    setActiveThemeModeAndApply: (mode: ThemeMode) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const LOCAL_STORAGE_LIGHT_KEY = "nerdcave_admin_theme_light";
const LOCAL_STORAGE_DARK_KEY = "nerdcave_admin_theme_dark";
const LOCAL_STORAGE_MODE_KEY = "nerdcave_admin_theme_mode";
const DEFAULT_ACCENT_COLOR = "#0067ff";
const DEFAULT_ACCENT_TEXT_COLOR = "#ffffff";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Salva tema no localStorage baseado no modo.
 * Light e Dark são armazenados separadamente para isolamento total.
 */
function saveThemeToLocalStorage(settings: AdminThemeSetting, mode: ThemeMode) {
    try {
        const key = mode === 'light' ? LOCAL_STORAGE_LIGHT_KEY : LOCAL_STORAGE_DARK_KEY;
        localStorage.setItem(key, JSON.stringify(settings));
        localStorage.setItem(LOCAL_STORAGE_MODE_KEY, mode);
    } catch (e) {
        // localStorage pode estar indisponível
    }
}

/**
 * Carrega tema do localStorage baseado no modo.
 */
function loadThemeFromLocalStorage(mode: ThemeMode): AdminThemeSetting | null {
    try {
        const key = mode === 'light' ? LOCAL_STORAGE_LIGHT_KEY : LOCAL_STORAGE_DARK_KEY;
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        // localStorage pode estar indisponível
    }
    return null;
}

/**
 * Carrega o modo ativo do localStorage.
 */
function loadActiveModeFromLocalStorage(): ThemeMode {
    try {
        const mode = localStorage.getItem(LOCAL_STORAGE_MODE_KEY);
        if (mode === 'light' || mode === 'dark') {
            return mode;
        }
    } catch (e) {
        // localStorage pode estar indisponível
    }
    return 'dark';
}

// Aplica TODAS as variáveis CSS do tema
function applyAllCssVariables(data: AdminThemeSetting) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Cores de destaque (accent) - usadas em botões e elementos de ação
    if (data.accentColor) {
        root.style.setProperty("--primary", data.accentColor);
        root.style.setProperty("--ring", data.accentColor);
    }
    if (data.accentTextColor) {
        root.style.setProperty("--primary-foreground", data.accentTextColor);
    }

    // Cores de layout
    if (data.backgroundColor) {
        root.style.setProperty("--background", data.backgroundColor);
    }
    if (data.foregroundColor) {
        root.style.setProperty("--foreground", data.foregroundColor);
    }

    // Cores de texto
    if (data.mutedColor) {
        root.style.setProperty("--muted", data.mutedColor);
    }
    if (data.mutedTextColor) {
        root.style.setProperty("--muted-foreground", data.mutedTextColor);
    }

    // Cores da sidebar
    if (data.sidebarBackgroundColor) {
        root.style.setProperty("--sidebar-background", data.sidebarBackgroundColor);
    }
    if (data.sidebarForegroundColor) {
        root.style.setProperty("--sidebar-foreground", data.sidebarForegroundColor);
    }
    // sidebarActiveColor = cor de fundo do item ativo na sidebar
    if (data.sidebarActiveColor) {
        root.style.setProperty("--sidebar-primary", data.sidebarActiveColor);
    } else if (data.accentColor) {
        // Fallback: usa accentColor se não tiver sidebarActiveColor
        root.style.setProperty("--sidebar-primary", data.accentColor);
    }
    if (data.accentTextColor) {
        root.style.setProperty("--sidebar-primary-foreground", data.accentTextColor);
    }
    // sidebarHoverColor = cor de fundo no hover
    if (data.sidebarHoverColor) {
        root.style.setProperty("--sidebar-accent", data.sidebarHoverColor);
    }
    if (data.sidebarForegroundColor) {
        root.style.setProperty("--sidebar-accent-foreground", data.sidebarForegroundColor);
    }

    // Cores dos cards
    if (data.cardBackgroundColor) {
        root.style.setProperty("--card", data.cardBackgroundColor);
    }
    if (data.cardForegroundColor) {
        root.style.setProperty("--card-foreground", data.cardForegroundColor);
    }
    if (data.cardBorderColor) {
        root.style.setProperty("--border", data.cardBorderColor);
    }
}

// ─── PROVIDER ────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: ReactNode }) {
    const { isReady: isAuthReady } = useAutoLogin();
    const [settings, setSettings] = useState<AdminThemeSetting | null>(null);
    const [activeThemeMode, setActiveThemeMode] = useState<ThemeMode>('dark');
    const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
    const [accentTextColor, setAccentTextColor] = useState(DEFAULT_ACCENT_TEXT_COLOR);
    const [sidebarLogo, setSidebarLogo] = useState<Media | undefined>(undefined);
    const [loginLogo, setLoginLogo] = useState<Media | undefined>(undefined);
    const [favicon, setFavicon] = useState<Media | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const initialLoadDone = useRef(false);

    /**
     * Aplica settings no CSS e state.
     * Chamado APENAS quando o tema passado deve ser exibido na tela.
     */
    const applySettingsData = useCallback((data: AdminThemeSetting) => {
        setSettings(data);
        setAccentColor(data.accentColor || DEFAULT_ACCENT_COLOR);
        setAccentTextColor(data.accentTextColor || DEFAULT_ACCENT_TEXT_COLOR);

        // Aplica TODAS as variáveis CSS
        applyAllCssVariables(data);

        // Extrai medias do themeMedia
        setSidebarLogo(data.themeMedia?.sidebarLogo);
        setLoginLogo(data.themeMedia?.loginLogo);
        setFavicon(data.themeMedia?.favicon);
    }, []);

    /**
     * Busca o tema do modo especificado do banco.
     */
    const fetchThemeByMode = useCallback(async (mode: ThemeMode): Promise<AdminThemeSetting | null> => {
        try {
            return await SettingsController.getOrCreateThemeSettingByMode({ themeMode: mode });
        } catch (error) {
            console.error(`[SettingsContext] Erro ao carregar tema ${mode}:`, error);
            return null;
        }
    }, []);

    /**
     * Carrega e aplica o tema do modo ativo.
     */
    const fetchAndApplyActiveTheme = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);

            const data = await fetchThemeByMode(activeThemeMode);
            if (data) {
                applySettingsData(data);
                saveThemeToLocalStorage(data, activeThemeMode);
            }
        } catch (error) {
            console.error("[SettingsContext] Erro ao carregar settings:", error);
        } finally {
            setLoading(false);
        }
    }, [activeThemeMode, fetchThemeByMode, applySettingsData]);

    // ─── INITIALIZATION ──────────────────────────────────────────────────────

    // 1. Carrega do localStorage PRIMEIRO (instantâneo, sem flash)
    useEffect(() => {
        if (initialLoadDone.current) return;
        initialLoadDone.current = true;

        // Detecta o modo atual baseado na classe 'dark' no HTML
        const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
        const mode: ThemeMode = isDark ? 'dark' : 'light';
        setActiveThemeMode(mode);

        // Aplica cache do localStorage imediatamente (sem flash)
        const cached = loadThemeFromLocalStorage(mode);
        if (cached) {
            applySettingsData(cached);
            setLoading(false);
        }
    }, [applySettingsData]);

    // 2. Depois do auth, sincroniza com banco em background
    useEffect(() => {
        if (isAuthReady) {
            // Se já tem cache, faz fetch silencioso (sem loading)
            const hasCache = loadThemeFromLocalStorage(activeThemeMode) !== null;
            fetchAndApplyActiveTheme(!hasCache);
        }
    }, [isAuthReady, activeThemeMode, fetchAndApplyActiveTheme]);

    // ─── PUBLIC API ──────────────────────────────────────────────────────────

    /**
     * Salva um tema no localStorage e aplica CSS se for o tema ativo.
     * @param data - Os dados do tema
     * @param mode - O modo do tema (light/dark) - OBRIGATÓRIO para garantir isolamento
     */
    const applyThemeSettings = useCallback((data: AdminThemeSetting, mode: ThemeMode) => {
        // Salva no localStorage do modo correto (isolado)
        saveThemeToLocalStorage(data, mode);

        // SÓ aplica CSS se for o tema ativo
        if (mode === activeThemeMode) {
            applySettingsData(data);
        }
    }, [activeThemeMode, applySettingsData]);

    /**
     * Troca o modo ativo e carrega o tema correspondente.
     * Usado pelo toggle de tema no header.
     */
    const setActiveThemeModeAndApply = useCallback(async (mode: ThemeMode) => {
        if (mode === activeThemeMode) return;

        // 1. Muda a classe no HTML
        if (typeof document !== 'undefined') {
            if (mode === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        // 2. Atualiza state e localStorage
        setActiveThemeMode(mode);
        localStorage.setItem(LOCAL_STORAGE_MODE_KEY, mode);
        localStorage.setItem('theme', mode); // Para o ThemeProvider também

        // 3. Aplica cores do cache (instantâneo)
        const cached = loadThemeFromLocalStorage(mode);
        if (cached) {
            applySettingsData(cached);
        } else {
            // Se não tem cache, busca do banco
            const data = await fetchThemeByMode(mode);
            if (data) {
                applySettingsData(data);
                saveThemeToLocalStorage(data, mode);
            }
        }
    }, [activeThemeMode, applySettingsData, fetchThemeByMode]);

    const updateAccentColor = async (color: string) => {
        if (!settings) return;
        const newSettings = { ...settings, accentColor: color };
        applySettingsData(newSettings);
        saveThemeToLocalStorage(newSettings, activeThemeMode);
    };

    const refreshSettings = async () => {
        await fetchAndApplyActiveTheme(false);
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                activeThemeMode,
                accentColor,
                accentTextColor,
                sidebarLogo,
                loginLogo,
                favicon,
                loading,
                updateAccentColor,
                applyThemeSettings,
                setActiveThemeModeAndApply,
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
