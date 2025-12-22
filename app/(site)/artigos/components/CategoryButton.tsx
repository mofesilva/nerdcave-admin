"use client";

import { LucideIcon } from "lucide-react";

interface CategoryButtonProps {
    id: string;
    name: string;
    icon?: LucideIcon;
    isSelected: boolean;
    onClick: () => void;
}

export function CategoryButton({ name, icon: Icon, isSelected, onClick }: CategoryButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`h-11 w-11 lg:w-auto lg:px-4 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors outfit outfit-500 cursor-pointer flex items-center justify-center gap-2 ${isSelected
                ? "bg-nerdcave-lime border-nerdcave-lime text-nerdcave-dark"
                : "bg-nerdcave-light/10 border-nerdcave-light/20 text-nerdcave-light hover:border-nerdcave-lime/50"
                }`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="hidden lg:inline">{name}</span>
        </button>
    );
}
