"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LucideIcon, Check } from 'lucide-react';

interface SelectOptionType {
    value: string;
    label: string;
    icon?: LucideIcon;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOptionType[];
    placeholder?: string;
    className?: string;
    /** Mostra apenas o ícone no trigger (sem texto) */
    iconOnly?: boolean;
    /** Ícone customizado para o trigger (usado quando iconOnly=true) */
    triggerIcon?: LucideIcon;
    /** Label do grupo no dropdown */
    label?: string;
}

export default function Select({
    value,
    onChange,
    options,
    placeholder = "Selecione...",
    className = "",
    iconOnly = false,
    triggerIcon,
    label
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const TriggerIcon = triggerIcon || selectedOption?.icon;

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
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                title={iconOnly ? (selectedOption?.label || placeholder) : undefined}
                className={`flex items-center justify-center gap-2 bg-card border border-border rounded-md text-sm font-medium transition-all duration-200 cursor-pointer h-full ${iconOnly
                    ? 'px-4'
                    : 'px-4'
                    } ${isOpen
                        ? 'border-primary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                    }`}
            >
                {iconOnly ? (
                    TriggerIcon && <TriggerIcon className="w-5 h-5" />
                ) : (
                    <>
                        <span className="flex items-center gap-2">
                            {TriggerIcon && <TriggerIcon className="w-5 h-5" />}
                            <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
                                {selectedOption?.label || placeholder}
                            </span>
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className={`absolute z-50 mt-2 min-w-[200px] py-1 bg-card border border-border rounded-md overflow-hidden shadow-lg animate-in fade-in-0 zoom-in-95 duration-150 ${iconOnly ? 'right-0' : 'left-0'
                    }`}>
                    {label && (
                        <div className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider border-b border-border">
                            {label}
                        </div>
                    )}
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
