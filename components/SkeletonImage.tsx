"use client";

import { useState } from "react";
import Image from "next/image";

interface SkeletonImageProps {
    /** URL da imagem */
    src: string;
    /** Texto alternativo */
    alt: string;
    /** Usar fill (ocupa container pai) */
    fill?: boolean;
    /** Width (quando não usa fill) */
    width?: number;
    /** Height (quando não usa fill) */
    height?: number;
    /** Sizes para responsividade */
    sizes?: string;
    /** Classes CSS */
    className?: string;
    /** Prioridade de carregamento */
    priority?: boolean;
}

/**
 * Componente de imagem com skeleton de loading.
 * Mostra um placeholder animado enquanto a imagem carrega.
 */
export default function SkeletonImage({
    src,
    alt,
    fill,
    width,
    height,
    sizes,
    className = "",
    priority = false,
}: SkeletonImageProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {!loaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <Image
                src={src}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                sizes={sizes}
                className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                loading={priority ? undefined : "lazy"}
                priority={priority}
                onLoad={() => setLoaded(true)}
            />
        </>
    );
}
