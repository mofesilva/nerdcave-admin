"use client";

import { useRef, useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";

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
}

export default function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    iconOnly = false,
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
            className="relative flex items-center gap-1 px-1.5 bg-card border border-border rounded-xl h-full"
        >
            {/* Sliding indicator */}
            <div
                className={`absolute top-1.5 bottom-1.5 bg-primary rounded-xl ${hasInteracted ? 'transition-all duration-300 ease-out' : ''}`}
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
                        className={`relative z-10 ${iconOnly ? 'p-2.5' : 'px-4 py-2'} text-sm font-medium rounded-xl transition-colors duration-200 ${value === option.value
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            } cursor-pointer flex items-center gap-2`}
                    >
                        {Icon && <Icon className="w-5 h-5" />}
                        {!iconOnly && option.label}
                    </button>
                );
            })}
        </div>
    );
}
