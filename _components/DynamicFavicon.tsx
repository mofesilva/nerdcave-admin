"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getMediaUrl } from "@/lib/medias/Media.controller";

/**
 * Componente que aplica dinamicamente o favicon do tema.
 * Deve ser renderizado uma vez no layout principal.
 */
export default function DynamicFavicon() {
    const { favicon } = useSettings();

    useEffect(() => {
        // Remove favicons existentes
        const existingLinks = document.querySelectorAll("link[rel*='icon']");
        existingLinks.forEach((link) => link.remove());

        // Cria novo favicon
        const link = document.createElement("link");
        link.rel = "icon";

        if (favicon?.fileName) {
            const url = getMediaUrl({ fileName: favicon.fileName });
            // Detecta tipo baseado na extensão
            const lowerUrl = url.toLowerCase();
            if (lowerUrl.endsWith(".png")) {
                link.type = "image/png";
            } else if (lowerUrl.endsWith(".svg")) {
                link.type = "image/svg+xml";
            } else {
                link.type = "image/x-icon";
            }
            link.href = url;
        } else {
            // Fallback para favicon padrão
            link.type = "image/x-icon";
            link.href = "/favicon.ico";
        }

        document.head.appendChild(link);

        // Cleanup ao desmontar
        return () => {
            link.remove();
        };
    }, [favicon]);

    return null;
}
