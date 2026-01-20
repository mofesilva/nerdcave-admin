"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import NavigationMenu from "./NavigationMenu";
import UserProfileCard from "./UserProfileCard";
import type { DBUser } from "@cappuccino/web-sdk";
import { useSettings } from "@/lib/contexts/SettingsContext";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
    description?: string;
}

export interface NavigationSection {
    name: string;
    icon: LucideIcon;
    description?: string;
    items: NavigationItem[];
}

export type NavigationEntry = NavigationItem | NavigationSection;

interface SidebarProps {
    /** Itens de navegação */
    navigation: NavigationEntry[];
    /** Usuário logado */
    user?: DBUser;
    /** Se a sidebar está fixada (expandida) */
    isPinned: boolean;
    /** Callback para toggle do pin */
    onTogglePin: () => void;
    /** Se o drawer mobile está aberto */
    isDrawerOpen: boolean;
    /** Callback para fechar o drawer */
    onCloseDrawer: () => void;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Sidebar({
    navigation,
    user,
    isPinned,
    onTogglePin,
    isDrawerOpen,
    onCloseDrawer,
}: SidebarProps) {
    const pathname = usePathname();
    const { settings } = useSettings();

    // Cores da sidebar do contexto
    const sidebarBg = settings?.sidebarBackgroundColor || "#111111";
    const sidebarText = settings?.sidebarForegroundColor || "#e5e5e5";

    // Fecha drawer ao mudar de rota
    useEffect(() => {
        onCloseDrawer();
    }, [pathname, onCloseDrawer]);

    // Fecha drawer ao pressionar ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseDrawer();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onCloseDrawer]);

    // Bloqueia scroll quando drawer está aberta
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isDrawerOpen]);

    return (
        <>
            <aside
                className={`hidden md:flex ${isPinned ? 'w-72' : 'w-20'
                    } h-screen flex-col py-6 pb-4 transition-[width] duration-300 ease-in-out shrink-0 overflow-hidden sticky top-0`}
                style={{ backgroundColor: sidebarBg, color: sidebarText }}
            >
                <SidebarHeader
                    isExpanded={isPinned}
                    isPinned={isPinned}
                    onTogglePin={onTogglePin}
                />
                <NavigationMenu items={navigation} isExpanded={isPinned} />

                {/* Seção inferior com usuário */}
                <UserProfileCard
                    user={user}
                    isExpanded={isPinned}
                />
            </aside>

            {/* Drawer Mobile - Overlay */}
            {isDrawerOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-[100]"
                    onClick={onCloseDrawer}
                />
            )}

            {/* Drawer Mobile - Sidebar */}
            <aside
                className={`md:hidden fixed top-0 left-0 h-screen w-72 flex flex-col py-6 pb-4 z-[101] transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ backgroundColor: sidebarBg, color: sidebarText }}
            >
                {/* Botão fechar no topo */}
                <button
                    onClick={onCloseDrawer}
                    className="absolute top-4 right-4 p-2 rounded-md hover:bg-white/10"
                    style={{ color: sidebarText }}
                    aria-label="Fechar menu"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo centralizada */}
                <div className="flex justify-center mb-6">
                    <SidebarHeader
                        isExpanded={true}
                        isPinned={true}
                        onTogglePin={() => { }}
                        hideToggle
                    />
                </div>

                {/* Navegação */}
                <NavigationMenu items={navigation} isExpanded={true} />

                {/* Seção inferior com usuário */}
                <UserProfileCard
                    user={user}
                    isExpanded={true}
                />
            </aside>
        </>
    );
}
