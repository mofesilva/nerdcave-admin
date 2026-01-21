"use client";

import { ImageIcon } from "lucide-react";
import SkeletonImage from "@/_components/SkeletonImage";

interface PostCoverImageProps {
    coverUrl: string;
    title: string;
    variant: "list" | "grid";
}

export function PostCoverImage({ coverUrl, title, variant }: PostCoverImageProps) {
    if (variant === "list") {
        return (
            <div className="w-[140px] sm:w-[180px] rounded-md overflow-hidden bg-muted flex items-center justify-center relative shrink-0 aspect-[4/3]">
                {coverUrl ? (
                    <SkeletonImage
                        src={coverUrl}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                )}
            </div>
        );
    }

    // Grid variant
    return (
        <div className="aspect-video bg-muted flex items-center justify-center relative">
            {coverUrl ? (
                <SkeletonImage
                    src={coverUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                />
            ) : (
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
            )}
        </div>
    );
}
