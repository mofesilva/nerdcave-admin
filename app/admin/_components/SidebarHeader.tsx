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

    // Sidebar fechada = 56px (w-14) em telas menores, 80px (w-20) em 2xl+
    // Botão ~32px, então centro = (56-32)/2 = 12px em md, (80-32)/2 = 24px em 2xl
    return (
        <div className="mb-4 2xl:mb-6 flex flex-col gap-3 2xl:gap-4">
            {/* Toggle button - posição relativa com left animado */}
            {!hideToggle && (
                <div className="relative h-8 2xl:h-10 flex items-center">
                    <div
                        className={`absolute transition-all duration-300 ease-in-out ${isExpanded ? 'right-3' : 'left-1/2 -translate-x-1/2'}`}
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
                    className={`object-contain transition-all duration-300 ease-in-out ${isExpanded ? 'w-20 h-20 2xl:w-24 2xl:h-24' : 'w-8 h-8 2xl:w-10 2xl:h-10'}`}
                />
            </div>
        </div>
    );
}
