"use client";

import { useMemo, type ReactNode } from "react";
import { CappuccinoProvider } from "@cappuccino/web-sdk";

import { getCappuccinoClient } from "@/lib/cappuccino/client";
import ThemeProvider from "./ThemeProvider";
import { AutoLoginProvider, useAutoLogin } from "@/lib/contexts/AutoLoginContext";
import { SettingsProvider, useSettings } from "@/lib/contexts/SettingsContext";
import { SystemSettingsProvider } from "@/lib/contexts/SystemSettingsContext";
import DynamicFavicon from "@/_components/DynamicFavicon";

interface AppProvidersProps {
    children: ReactNode;
}

// Componente que aguarda tudo estar pronto antes de renderizar
function AppReady({ children }: { children: ReactNode }) {
    const { isReady: isAuthReady } = useAutoLogin();
    const { loading: settingsLoading } = useSettings();

    // Só mostra o conteúdo quando auth e settings estiverem prontos
    if (!isAuthReady || settingsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#171717' }}>
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}

export function AppProviders({ children }: AppProvidersProps) {
    const client = useMemo(() => getCappuccinoClient(), []);

    return (
        <ThemeProvider>
            <CappuccinoProvider
                apiClient={client.apiClient}
                authManager={client.authManager}
            >
                <AutoLoginProvider>
                    <SettingsProvider>
                        <SystemSettingsProvider>
                            <AppReady>
                                <DynamicFavicon />
                                {children}
                            </AppReady>
                        </SystemSettingsProvider>
                    </SettingsProvider>
                </AutoLoginProvider>
            </CappuccinoProvider>
        </ThemeProvider>
    );
}
