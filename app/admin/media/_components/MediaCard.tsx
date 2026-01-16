"use client";

import { Check } from "lucide-react";
import SkeletonImage from "@/_components/SkeletonImage";

interface MediaCardProps {
    src: string;
    title: string;
    selected?: boolean;
    onSelect?: () => void;
    onView?: () => void;
    variant?: "grid" | "list";
}

export default function MediaCard({
    src,
    title,
    selected = false,
    onSelect,
    onView,
    variant = "grid",
}: MediaCardProps) {
    const selectedClass = selected
        ? "border-primary ring-2 ring-primary/30"
        : "border-border hover:border-primary/50";

    if (variant === "list") {
        return (
            <div
                onClick={onView}
                className={`flex items-center gap-4 bg-card rounded-xl p-4 border cursor-pointer ${selectedClass}`}
            >
                {/* Checkbox */}
                {onSelect && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onSelect(); }}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selected
                                ? "bg-primary border-primary text-white"
                                : "border-muted-foreground/30 hover:border-primary"
                            }`}
                        aria-label={selected ? "Desselecionar" : "Selecionar"}
                    >
                        {selected && <Check className="w-4 h-4" />}
                    </button>
                )}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted relative">
                    {src && (
                        <SkeletonImage
                            src={src}
                            alt={title}
                            fill
                            sizes="64px"
                            className="object-cover"
                        />
                    )}
                </div>
                <p className="font-medium flex-1 truncate">{title}</p>
            </div>
        );
    }

    return (
        <div
            onClick={onView}
            className={`group relative bg-card rounded-xl overflow-hidden border cursor-pointer transition-colors ${selectedClass}`}
        >
            <div className="aspect-square relative bg-muted">
                {src && (
                    <SkeletonImage
                        src={src}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover"
                    />
                )}
                {/* Checkbox */}
                {onSelect && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onSelect(); }}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selected
                                ? "bg-primary border-primary text-white opacity-100"
                                : "border-white/70 bg-black/30 opacity-0 group-hover:opacity-100 hover:border-white"
                            }`}
                        aria-label={selected ? "Desselecionar" : "Selecionar"}
                    >
                        {selected && <Check className="w-4 h-4" />}
                    </button>
                )}
            </div>
            <div className="p-3">
                <p className="text-sm font-medium truncate">{title}</p>
            </div>
        </div>
    );
}
