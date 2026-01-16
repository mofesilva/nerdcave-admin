"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import * as SettingsController from "@/lib/settings/Settings.controller";
import type { Settings } from "@/lib/settings/Settings.model";
import { useAutoLogin } from "./AutoLoginContext";

interface SystemSettingsContextType {
    layoutSettings: Settings | null;
    fullWidthLayout: boolean;
    loading: boolean;
    updateFullWidthLayout: (value: boolean) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: ReactNode }) {
    const { isReady: isAuthReady } = useAutoLogin();
    const [layoutSettings, setLayoutSettings] = useState<Settings | null>(null);
    const [fullWidthLayout, setFullWidthLayout] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await SettingsController.getSettingsByCategory({ category: 'layout' });
            if (data) {
                setLayoutSettings(data);
                setFullWidthLayout(data.fullWidthLayout ?? false);
            }
        } catch (error) {
            console.error("[SystemSettingsContext] Erro ao carregar settings:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthReady) {
            fetchSettings();
        }
    }, [isAuthReady, fetchSettings]);

    const updateFullWidthLayout = async (value: boolean) => {
        try {
            const updated = await SettingsController.updateSettingsByCategory({
                category: 'layout',
                updates: { fullWidthLayout: value }
            });
            if (updated) {
                setLayoutSettings(updated);
                setFullWidthLayout(value);
            }
        } catch (error) {
            console.error("Erro ao atualizar layout:", error);
        }
    };

    const refreshSettings = async () => {
        await fetchSettings();
    };

    return (
        <SystemSettingsContext.Provider
            value={{
                layoutSettings,
                fullWidthLayout,
                loading,
                updateFullWidthLayout,
                refreshSettings,
            }}
        >
            {children}
        </SystemSettingsContext.Provider>
    );
}

export function useSystemSettings() {
    const context = useContext(SystemSettingsContext);
    if (context === undefined) {
        throw new Error("useSystemSettings must be used within a SystemSettingsProvider");
    }
    return context;
}
