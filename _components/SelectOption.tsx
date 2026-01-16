"use client";

import { Check, LucideIcon } from 'lucide-react';

interface SelectOptionProps {
    value: string;
    label: string;
    isSelected: boolean;
    onSelect: (value: string) => void;
    icon?: LucideIcon;
}

export default function SelectOption({ value, label, isSelected, onSelect, icon: Icon }: SelectOptionProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors cursor-pointer ${isSelected
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted-foreground/10'
                }`}
        >
            <span className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4" />}
                {label}
            </span>
            {isSelected && (
                <Check className="w-4 h-4" />
            )}
        </button>
    );
}
