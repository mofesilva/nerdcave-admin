"use client";

import LogoUploadCard from "./LogoUploadCard";
import type { Media } from "@/lib/medias/Media.model";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type LogoField = "loginPageLogo" | "sideBarLogoDark" | "sideBarLogoLight";

interface LogosSectionProps {
    loginPageLogo: Media | undefined;
    sideBarLogoDark: Media | undefined;
    sideBarLogoLight: Media | undefined;
    onOpenPicker: (field: LogoField) => void;
    onRemove: (field: LogoField) => void;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LogosSection({
    loginPageLogo,
    sideBarLogoDark,
    sideBarLogoLight,
    onOpenPicker,
    onRemove,
}: LogosSectionProps) {
    return (
        <div className="bg-card rounded-md p-8 shadow-sm border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-2">Logos</h2>
            <p className="text-muted-foreground mb-6">
                Configure as logos do painel administrativo para temas claro e escuro
            </p>

            <div className="space-y-8">
                {/* Login Page Logo */}
                <div>
                    <h3 className="font-medium text-foreground mb-1">Logo da Página de Login</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Exibida na tela de login do admin
                    </p>
                    <LogoUploadCard
                        media={loginPageLogo}
                        variant="dark"
                        onSelect={() => onOpenPicker("loginPageLogo")}
                        onRemove={() => onRemove("loginPageLogo")}
                    />
                </div>

                {/* Sidebar Logos */}
                <div>
                    <h3 className="font-medium text-foreground mb-1">Logo da Sidebar</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Exibida no topo da barra lateral (versões para tema claro e escuro)
                    </p>

                    <div className="flex gap-6">
                        <LogoUploadCard
                            label="Tema Escuro"
                            media={sideBarLogoDark}
                            variant="dark"
                            onSelect={() => onOpenPicker("sideBarLogoDark")}
                            onRemove={() => onRemove("sideBarLogoDark")}
                        />
                        <LogoUploadCard
                            label="Tema Claro"
                            media={sideBarLogoLight}
                            variant="light"
                            onSelect={() => onOpenPicker("sideBarLogoLight")}
                            onRemove={() => onRemove("sideBarLogoLight")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
