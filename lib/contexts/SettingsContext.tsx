"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import * as SettingsController from "@/lib/settings/Settings.controller";
import type { Settings } from "@/lib/settings/Settings.model";

interface SettingsContextType {
    settings: Settings | null;
    primaryColor: string;
    loading: boolean;
    updatePrimaryColor: (color: string) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_PRIMARY_COLOR = "#0067ff";

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY_COLOR);
    const [loading, setLoading] = useState(true);

    const applyPrimaryColor = useCallback((color: string) => {
        // Aplica a cor como CSS variable no :root
        document.documentElement.style.setProperty("--primary", color);
        document.documentElement.style.setProperty("--ring", color);
        document.documentElement.style.setProperty("--sidebar-primary", color);
        document.documentElement.style.setProperty("--sidebar-ring", color);
        setPrimaryColor(color);
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await SettingsController.getSettings();
            if (data) {
                setSettings(data);
                applyPrimaryColor(data.primaryColor);
            } else {
                // Settings não existe ainda - usa valores padrão
                // (será criado quando admin acessar pela primeira vez)
                applyPrimaryColor(DEFAULT_PRIMARY_COLOR);
            }
        } catch (error) {
            console.error("Erro ao carregar settings:", error);
            applyPrimaryColor(DEFAULT_PRIMARY_COLOR);
        } finally {
            setLoading(false);
        }
    }, [applyPrimaryColor]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updatePrimaryColor = async (color: string) => {
        if (!settings) return;

        try {
            await SettingsController.updatePrimaryColor({ color });
            applyPrimaryColor(color);
            setSettings({ ...settings, primaryColor: color });
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
                primaryColor,
                loading,
                updatePrimaryColor,
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
