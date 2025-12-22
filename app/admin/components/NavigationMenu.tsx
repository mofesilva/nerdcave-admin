"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, Plus } from "lucide-react";

interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface NavigationMenuProps {
    items: NavigationItem[];
    isExpanded: boolean;
}

export default function NavigationMenu({ items, isExpanded }: NavigationMenuProps) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 w-full px-3 space-y-2 flex flex-col overflow-y-auto scrollbar-hide">
            {/* Quick Add button
            <Link
                href="/admin/links"
                title={!isExpanded ? 'Novo Link' : undefined}
                className={`h-11 flex items-center rounded-xl transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-white`}
            >
                <div className="w-14 h-11 flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5" />
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
                    <span className="text-sm font-medium whitespace-nowrap">Novo Link</span>
                </div>
            </Link> */}
            {items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        title={!isExpanded ? item.name : undefined}
                        className={`h-11 flex items-center rounded-xl transition-colors ${isActive
                            ? 'bg-primary text-white'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }`}
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
            })}


        </nav>
    );
}
