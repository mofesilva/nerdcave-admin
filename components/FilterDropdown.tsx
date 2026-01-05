"use client";

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, LucideIcon, Check } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
    icon?: LucideIcon;
}

interface FilterDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    label?: string;
}

export default function FilterDropdown({ value, onChange, options, label = "Ordenar" }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleSelect(optionValue: string) {
        onChange(optionValue);
        setIsOpen(false);
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger - segue o estilo do SegmentedControl */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                title={selectedOption?.label || label}
                className={`flex items-center justify-center p-4 bg-card border border-border rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${isOpen
                    ? 'border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                    }`}
            >
                <ArrowUpDown className="w-5 h-5" />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 right-0 mt-2 min-w-[200px] py-1 bg-card border border-border rounded-xl overflow-hidden shadow-lg animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider border-b border-border">
                        {label}
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                        {options.map((option) => {
                            const Icon = option.icon;
                            const isSelected = option.value === value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground hover:bg-muted-foreground/10'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        {Icon && <Icon className="w-4 h-4" />}
                                        <span className="text-sm">{option.label}</span>
                                    </span>
                                    {isSelected && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
