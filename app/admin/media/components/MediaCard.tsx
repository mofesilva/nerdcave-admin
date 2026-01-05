"use client";

import { Check } from "lucide-react";
import SkeletonImage from "@/components/SkeletonImage";

interface MediaCardProps {
    src: string;
    title: string;
    selected?: boolean;
    onClick?: () => void;
    variant?: "grid" | "list";
}

export default function MediaCard({
    src,
    title,
    selected = false,
    onClick,
    variant = "grid",
}: MediaCardProps) {
    const selectedClass = selected
        ? "border-primary ring-2 ring-primary/30"
        : "border-border hover:border-primary/50";

    if (variant === "list") {
        return (
            <div
                onClick={onClick}
                className={`flex items-center gap-4 bg-card rounded-xl p-4 border cursor-pointer ${selectedClass}`}
            >
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
                {selected && <Check className="w-6 h-6 text-primary" />}
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
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
                {selected && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                )}
            </div>
            <div className="p-3">
                <p className="text-sm font-medium truncate">{title}</p>
            </div>
        </div>
    );
}
