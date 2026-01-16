"use client";

interface GridSkeletonProps {
    /** Quantidade de items skeleton */
    count?: number;
    /** Classes do grid (colunas, gap, etc.) */
    gridClassName?: string;
    /** Classes de cada item */
    itemClassName?: string;
    /** Aspect ratio do item (default: square) */
    aspectRatio?: "square" | "video" | "portrait";
    /** Classes adicionais do container */
    className?: string;
}

const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
};

/**
 * Skeleton de loading para grids de cards/items.
 */
export default function GridSkeleton({
    count = 12,
    gridClassName = "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4",
    itemClassName = "",
    aspectRatio = "square",
    className = "",
}: GridSkeletonProps) {
    return (
        <div className={`${gridClassName} ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`bg-card rounded-md overflow-hidden border border-border ${itemClassName}`}
                >
                    <div className={`${aspectClasses[aspectRatio]} bg-muted animate-pulse`} />
                </div>
            ))}
        </div>
    );
}
