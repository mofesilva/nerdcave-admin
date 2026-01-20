"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import ScrollIndicator from "@/_components/ScrollIndicator";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface NavigationSection {
    name: string;
    icon: LucideIcon;
    items: NavigationItem[];
}

type NavigationEntry = NavigationItem | NavigationSection;

interface NavigationMenuProps {
    items: NavigationEntry[];
    isExpanded: boolean;
}

function isSection(entry: NavigationEntry): entry is NavigationSection {
    return 'items' in entry;
}

export default function NavigationMenu({ items, isExpanded }: NavigationMenuProps) {
    const pathname = usePathname();
    const { settings } = useSettings();
    const navRef = useRef<HTMLElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    // Cores da sidebar do contexto
    const activeColor = settings?.sidebarActiveColor || settings?.accentColor || "#0067ff";
    const activeTextColor = settings?.accentTextColor || "#ffffff";
    const hoverColor = settings?.sidebarHoverColor || "#262626";
    const textColor = settings?.sidebarForegroundColor || "#e5e5e5";

    // Verifica se há scroll disponível
    useEffect(() => {
        const checkScroll = () => {
            if (navRef.current) {
                const { scrollHeight, clientHeight, scrollTop } = navRef.current;
                const hasMoreBelow = scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 10;
                const hasMoreAbove = scrollTop > 10;
                setCanScrollDown(hasMoreBelow);
                setCanScrollUp(hasMoreAbove);
            }
        };

        // Check inicial com delay para garantir que o layout está pronto
        const timeout = setTimeout(checkScroll, 100);

        const nav = navRef.current;
        nav?.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        return () => {
            clearTimeout(timeout);
            nav?.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [items]);

    const renderItem = (item: NavigationItem, nested = false) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
        const isHovered = hoveredItem === item.href;
        const Icon = item.icon;

        // Estilos inline baseados no estado
        const style: React.CSSProperties = isActive
            ? { backgroundColor: activeColor, color: activeTextColor }
            : isHovered
                ? { backgroundColor: hoverColor, color: textColor }
                : { color: `${textColor}B3` }; // B3 = 70% opacity

        return (
            <Link
                key={item.name}
                href={item.href}
                title={!isExpanded ? item.name : undefined}
                className="flex items-center rounded-md h-12 transition-colors"
                style={style}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <div className="w-14 h-11 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-40 opacity-100' : 'w-0 opacity-0'
                    }`}>
                    <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                </div>
            </Link>
        );
    };

    const renderSection = (section: NavigationSection, isLastSection: boolean) => {
        return (
            <div key={section.name}>
                {/* Divider antes */}
                <div className="my-3 mx-2 border-t" style={{ borderColor: `${textColor}33` }} />

                {/* Section title - só aparece quando expandido */}
                {isExpanded && (
                    <div className="px-4 py-2">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: `${textColor}80` }}>
                            {section.name}
                        </span>
                    </div>
                )}

                {/* Section items */}
                <div className="space-y-1">
                    {section.items.map(item => renderItem(item, isExpanded))}
                </div>

                {/* Divider depois (se for a última seção e houver items depois) */}
                {isLastSection && (
                    <div className="my-3 mx-2 border-t" style={{ borderColor: `${textColor}33` }} />
                )}
            </div>
        );
    };

    // Encontra o índice da última seção
    const lastSectionIndex = items.reduce((lastIdx, entry, idx) =>
        isSection(entry) ? idx : lastIdx, -1
    );

    // Verifica se há items após a última seção
    const hasItemsAfterLastSection = lastSectionIndex < items.length - 1;

    return (
        <div className="relative flex-1 w-full flex flex-col overflow-hidden">
            <nav
                ref={navRef}
                className="flex-1 w-full px-3 space-y-1 flex flex-col overflow-y-auto scrollbar-hide overscroll-contain"
            >
                {items.map((entry, index) =>
                    isSection(entry)
                        ? renderSection(entry, index === lastSectionIndex && hasItemsAfterLastSection)
                        : renderItem(entry)
                )}
            </nav>

            {/* Scroll indicators */}
            {canScrollUp && <ScrollIndicator direction="up" />}
            {canScrollDown && <ScrollIndicator direction="down" />}
        </div>
    );
}
