"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUpDown, LucideIcon, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { useToolbarHeight } from './ToolbarContext';

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
    /** Ícone customizado para o botão trigger (padrão: ArrowUpDown) */
    icon?: LucideIcon;
}

export default function FilterDropdown({ value, onChange, options, label = "Ordenar", icon: TriggerIcon = ArrowUpDown }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const toolbarHeight = useToolbarHeight("h-8");

    const selectedOption = options.find(opt => opt.value === value);
    const needsScroll = options.length > 6; // Só precisa de scroll se tiver mais de 6 opções

    const checkScroll = useCallback(() => {
        if (listRef.current && needsScroll) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            setCanScrollUp(scrollTop > 0);
            setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
        } else {
            setCanScrollUp(false);
            setCanScrollDown(false);
        }
    }, [needsScroll]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Pequeno delay para garantir que o DOM está renderizado
            setTimeout(checkScroll, 10);
        }
    }, [isOpen, checkScroll]);

    function handleSelect(optionValue: string) {
        onChange(optionValue);
        setIsOpen(false);
    }

    function scrollList(direction: 'up' | 'down') {
        if (listRef.current && needsScroll) {
            const scrollAmount = 80; // pixels por clique
            listRef.current.scrollBy({
                top: direction === 'up' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger - segue o estilo do SegmentedControl */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                title={selectedOption?.label || label}
                className={`flex items-center justify-center ${toolbarHeight} aspect-square bg-card border border-border rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${isOpen
                    ? 'border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                    }`}
            >
                <TriggerIcon className="w-4 h-4" />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 left-0 mt-2 min-w-[200px] bg-card border border-border rounded-md overflow-hidden shadow-lg animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider border-b border-border">
                        {label}
                    </div>

                    {/* Seta para cima - só aparece quando pode rolar */}
                    {canScrollUp && (
                        <button
                            type="button"
                            onClick={() => scrollList('up')}
                            className="w-full flex items-center justify-center py-1 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 cursor-pointer"
                        >
                            <ChevronUp className="w-4 h-4 animate-bounce" />
                        </button>
                    )}

                    <div
                        ref={listRef}
                        onScroll={needsScroll ? checkScroll : undefined}
                        className={needsScroll ? "max-h-48 overflow-y-auto scrollbar-none" : ""}
                        style={needsScroll ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : undefined}
                    >
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

                    {/* Seta para baixo - só aparece quando pode rolar */}
                    {canScrollDown && (
                        <button
                            type="button"
                            onClick={() => scrollList('down')}
                            className="w-full flex items-center justify-center py-1 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 cursor-pointer"
                        >
                            <ChevronDown className="w-4 h-4 animate-bounce" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
