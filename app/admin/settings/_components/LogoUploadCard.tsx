"use client";

import Image from "next/image";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/lib/medias/Media.controller";
import type { Media } from "@/lib/medias/Media.model";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface LogoUploadCardProps {
    label?: string;
    media: Media | undefined;
    variant: "dark" | "light";
    onSelect: () => void;
    onRemove: () => void;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LogoUploadCard({
    label,
    media,
    variant,
    onSelect,
    onRemove,
}: LogoUploadCardProps) {
    const isDark = variant === "dark";

    return (
        <div>
            {label && (
                <span className="text-xs text-muted-foreground mb-2 block">{label}</span>
            )}
            <div className="relative group w-fit">
                <button
                    onClick={onSelect}
                    className={cn(
                        "w-28 h-28 rounded-xl flex flex-col items-center justify-center transition-all",
                        isDark ? "bg-zinc-900" : "bg-white border-zinc-300",
                        media
                            ? "border border-border hover:border-primary"
                            : "border-2 border-dashed border-border hover:border-primary"
                    )}
                >
                    {media?.fileName ? (
                        <Image
                            src={getMediaUrl({ fileName: media.fileName })}
                            alt={label || "Logo"}
                            width={100}
                            height={100}
                            className="object-contain rounded-lg p-1"
                        />
                    ) : (
                        <>
                            <Upload className={cn(
                                "w-5 h-5 mb-1",
                                isDark ? "text-muted-foreground" : "text-zinc-400"
                            )} />
                            <span className={cn(
                                "text-xs",
                                isDark ? "text-muted-foreground" : "text-zinc-400"
                            )}>
                                Selecionar
                            </span>
                        </>
                    )}
                </button>
                {media && (
                    <button
                        onClick={onRemove}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}
