"use client";

import Link from "next/link";
import { Plus, FileText, Upload, Images, FolderTree, LucideIcon } from "lucide-react";

interface QuickAction {
    label: string;
    href: string;
    icon: LucideIcon;
    color: string;
}

const quickActions: QuickAction[] = [
    { label: "Novo Post", href: "/admin/compose/new", icon: FileText, color: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" },
    { label: "Upload", href: "/admin/media?upload=true", icon: Upload, color: "bg-green-500/20 text-green-400 hover:bg-green-500/30" },
    { label: "Novo Álbum", href: "/admin/albums/new", icon: Images, color: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30" },
    { label: "Nova Categoria", href: "/admin/categories?new=true", icon: FolderTree, color: "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" },
];

export default function QuickActions() {
    return (
        <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                    <Link
                        key={action.label}
                        href={action.href}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${action.color}`}
                    >
                        <Plus className="w-4 h-4" />
                        <span>{action.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
