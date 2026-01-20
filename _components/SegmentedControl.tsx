"use client";

import { useRef, useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SegmentOption<T extends string> {
    value: T;
    label: string;
    icon?: LucideIcon;
}

interface SegmentedControlProps<T extends string> {
    options: SegmentOption<T>[];
    value: T;
    onChange: (value: T) => void;
    iconOnly?: boolean;
    className?: string;
    bgColor?: string;
    mobileFullWidth?: boolean;
}

export default function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    iconOnly = false,
    className,
    bgColor,
    mobileFullWidth = false,
}: SegmentedControlProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const activeIndex = options.findIndex(opt => opt.value === value);
        const buttons = container.querySelectorAll('button');
        const activeButton = buttons[activeIndex];

        if (activeButton) {
            setIndicatorStyle({
                left: activeButton.offsetLeft,
                width: activeButton.offsetWidth,
            });
        }
    }, [value, options]);

    function handleChange(newValue: T) {
        setHasInteracted(true);
        onChange(newValue);
    }

    return (
        <div
            ref={containerRef}
            className={cn("relative inline-flex items-center px-1 border border-border rounded-md", !bgColor && "bg-card", mobileFullWidth && "w-full sm:w-auto", className)}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
        >
            {/* Sliding indicator */}
            <div
                className={`absolute top-1 bottom-1 bg-primary rounded-sm ${hasInteracted ? 'transition-all duration-300 ease-out' : ''}`}
                style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                }}
            />

            {/* Buttons */}
            {options.map((option) => {
                const Icon = option.icon;
                return (
                    <button
                        key={option.value}
                        onClick={() => handleChange(option.value)}
                        title={iconOnly ? option.label : undefined}
                        className={`relative z-10 ${iconOnly ? 'w-8 h-8' : 'px-3 h-8'} text-sm font-medium rounded-sm transition-colors duration-200 ${value === option.value
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            } cursor-pointer flex items-center justify-center gap-2 ${mobileFullWidth ? 'flex-1 sm:flex-none' : ''}`}
                    >
                        {Icon && <Icon className="w-4 h-4" />}
                        {!iconOnly && option.label}
                    </button>
                );
            })}
        </div>
    );
}
