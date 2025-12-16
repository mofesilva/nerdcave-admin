"use client";

import { createContext, useContext, useMemo, ReactNode, useCallback } from "react";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import { resolveCappuccinoConfig } from "@/lib/cappuccino/config";
import type { CappuccinoClient } from "@cappuccino/web-sdk";

const APP_NAME = "nerdcave";

interface CappuccinoContextValue {
    client: CappuccinoClient;
    getMediaUrl: (fileName: string) => string;
    uploadMedia: (file: File) => Promise<{ fileName: string; url: string }>;
}

const CappuccinoContext = createContext<CappuccinoContextValue | null>(null);

export function CappuccinoProvider({ children }: { children: ReactNode }) {
    const client = useMemo(() => getCappuccinoClient(), []);
    const config = useMemo(() => resolveCappuccinoConfig(), []);

    const getMediaUrl = useCallback((fileName: string): string => {
        return `${config.baseUrl}/mediastorage/${APP_NAME}/${fileName}`;
    }, [config.baseUrl]);

    const uploadMedia = useCallback(async (file: File): Promise<{ fileName: string; url: string }> => {
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `media/${timestamp}-${cleanName}`;

        const result = await client.modules.mediastorage.upload({
            file,
            app: APP_NAME,
            fileName,
            fileType: file.type,
        });

        return {
            fileName: result.data.fileName,
            url: getMediaUrl(result.data.fileName),
        };
    }, [client, getMediaUrl]);

    return (
        <CappuccinoContext.Provider value={{ client, getMediaUrl, uploadMedia }}>
            {children}
        </CappuccinoContext.Provider>
    );
}

export function useCappuccino(): CappuccinoContextValue {
    const context = useContext(CappuccinoContext);
    if (!context) {
        throw new Error("useCappuccino must be used within a CappuccinoProvider");
    }
    return context;
}
