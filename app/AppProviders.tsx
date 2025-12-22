"use client";

import { useMemo, type ReactNode } from "react";
import { CappuccinoProvider } from "@cappuccino/web-sdk";

import { getCappuccinoClient } from "@/lib/cappuccino/client";
import ThemeProvider from "./ThemeProvider";
import { AutoLoginProvider } from "@/lib/contexts/AutoLoginContext";

interface AppProvidersProps {
    children: ReactNode;
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
                    {children}
                </AutoLoginProvider>
            </CappuccinoProvider>
        </ThemeProvider>
    );
}
