"use client";

import React from "react";
import Image from "next/image";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import IconButton from "@/_components/IconButton";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getMediaUrl } from "@/lib/medias/Media.controller";

interface SidebarHeaderProps {
    isExpanded: boolean;
    isPinned?: boolean;
    onTogglePin?: () => void;
    hideToggle?: boolean;
}

export default function SidebarHeader({ isExpanded, isPinned = false, onTogglePin, hideToggle = false }: SidebarHeaderProps) {
    const { sidebarLogo } = useSettings();

    const logoUrl = sidebarLogo
        ? getMediaUrl({ fileName: sidebarLogo.fileName })
        : "/images/logos/nerdcave-white.png";

    // Sidebar fechada = 80px (w-20), botão = 36px
    // Centro fechado = (80 - 36) / 2 = 22px
    return (
        <div className="mb-6 flex flex-col gap-4">
            {/* Toggle button - posição relativa com left animado */}
            {!hideToggle && (
                <div className="relative h-10 flex items-center">
                    <div
                        className="absolute transition-all duration-300 ease-in-out"
                        style={{
                            left: isExpanded ? 'calc(100% - 48px)' : '22px'
                        }}
                    >
                        <IconButton
                            icon={isPinned ? <PanelLeftClose /> : <PanelLeft />}
                            onClick={onTogglePin}
                            title={isPinned ? 'Fechar menu' : 'Fixar menu aberto'}
                        />
                    </div>
                </div>
            )}

            {/* Logo */}
            <div className="flex items-center justify-center">
                <Image
                    src={logoUrl}
                    alt="Logo"
                    width={100}
                    height={100}
                    className={`object-contain transition-all duration-300 ease-in-out ${isExpanded ? 'w-24 h-24' : 'w-10 h-10'}`}
                />
            </div>
        </div>
    );
}
