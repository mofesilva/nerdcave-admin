"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

interface ScrollIndicatorProps {
    direction: "up" | "down";
    className?: string;
    fixed?: boolean;
}

/**
 * Indicador visual de scroll disponível.
 * Mostra uma seta animada quando há mais conteúdo para scrollar.
 */
export default function ScrollIndicator({ direction, className = "", fixed = false }: ScrollIndicatorProps) {
    const Icon = direction === "up" ? ChevronUp : ChevronDown;

    if (fixed) {
        return (
            <div className={`flex justify-center pointer-events-none ${className}`}>
                <div className="animate-bounce text-zinc-400">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        );
    }

    const position = direction === "up" ? "top-0" : "bottom-0";

    return (
        <div className={`absolute ${position} left-0 right-0 flex justify-center py-1 pointer-events-none ${className}`}>
            <div className="animate-bounce text-zinc-400">
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );
}
