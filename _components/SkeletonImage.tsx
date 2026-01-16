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
 * Mostra um placeholder com efeito shimmer enquanto a imagem carrega.
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
                <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
                    {/* Efeito foil - brilho diagonal sutil */}
                    <div
                        className="absolute inset-0 animate-shimmer"
                        style={{
                            background: `linear-gradient(
                                110deg,
                                transparent 20%,
                                rgba(255, 255, 255, 0.03) 35%,
                                rgba(255, 255, 255, 0.08) 45%,
                                rgba(255, 255, 255, 0.12) 50%,
                                rgba(255, 255, 255, 0.08) 55%,
                                rgba(255, 255, 255, 0.03) 65%,
                                transparent 80%
                            )`,
                            backgroundSize: '200% 100%',
                        }}
                    />
                </div>
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
