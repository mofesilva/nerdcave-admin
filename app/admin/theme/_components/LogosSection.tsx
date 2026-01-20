"use client";

import LogoUploadCard from "./LogoUploadCard";
import type { Media } from "@/lib/medias/Media.model";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type MediaField = "sidebarLogo" | "loginLogo" | "favicon";

interface LogosSectionProps {
    sidebarLogo: Media | undefined;
    loginLogo: Media | undefined;
    favicon: Media | undefined;
    onOpenPicker: (field: MediaField) => void;
    onRemove: (field: MediaField) => void;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LogosSection({
    sidebarLogo,
    loginLogo,
    favicon,
    onOpenPicker,
    onRemove,
}: LogosSectionProps) {
    return (
        <div className="bg-card rounded-md p-8 shadow-sm border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-2">Logos e Ícones</h2>
            <p className="text-muted-foreground mb-6">
                Configure as logos e ícones do painel administrativo
            </p>

            <div className="space-y-8">
                {/* Login Logo */}
                <div>
                    <h3 className="font-medium text-foreground mb-1">Logo da Página de Login</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Exibida na tela de login do admin
                    </p>
                    <LogoUploadCard
                        media={loginLogo}
                        variant="dark"
                        onSelect={() => onOpenPicker("loginLogo")}
                        onRemove={() => onRemove("loginLogo")}
                    />
                </div>

                {/* Sidebar Logo */}
                <div>
                    <h3 className="font-medium text-foreground mb-1">Logo da Sidebar</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Exibida no topo da barra lateral
                    </p>
                    <LogoUploadCard
                        media={sidebarLogo}
                        variant="dark"
                        onSelect={() => onOpenPicker("sidebarLogo")}
                        onRemove={() => onRemove("sidebarLogo")}
                    />
                </div>

                {/* Favicon */}
                <div>
                    <h3 className="font-medium text-foreground mb-1">Favicon</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Ícone exibido na aba do navegador
                    </p>
                    <LogoUploadCard
                        media={favicon}
                        variant="dark"
                        onSelect={() => onOpenPicker("favicon")}
                        onRemove={() => onRemove("favicon")}
                    />
                </div>
            </div>
        </div>
    );
}
