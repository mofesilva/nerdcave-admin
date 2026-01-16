"use client";

import { useEffect, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageLightboxProps {
    /** URL da imagem */
    src: string;
    /** Texto alternativo */
    alt: string;
    /** Callback para fechar */
    onClose: () => void;
    /** Callback para ir para anterior (opcional) */
    onPrev?: () => void;
    /** Callback para ir para próximo (opcional) */
    onNext?: () => void;
}

/**
 * Lightbox para visualizar imagens em tela cheia.
 * Suporta navegação por teclado (ESC, setas).
 */
export default function ImageLightbox({
    src,
    alt,
    onClose,
    onPrev,
    onNext,
}: ImageLightboxProps) {
    const [loading, setLoading] = useState(true);

    // Reset loading quando muda de imagem
    useEffect(() => {
        setLoading(true);
    }, [src]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case "Escape":
                onClose();
                break;
            case "ArrowLeft":
                onPrev?.();
                break;
            case "ArrowRight":
                onNext?.();
                break;
        }
    }, [onClose, onPrev, onNext]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [handleKeyDown]);

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/95 flex items-center justify-center"
            style={{ height: '100dvh', width: '100dvw' }}
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Fechar"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Previous button */}
            {onPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}

            {/* Image container */}
            <div
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Loading spinner */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                )}
                <Image
                    src={src}
                    alt={alt}
                    width={1920}
                    height={1080}
                    className={`max-w-full max-h-[90vh] w-auto h-auto object-contain transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
                    priority
                    onLoad={() => setLoading(false)}
                />
            </div>

            {/* Next button */}
            {onNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Próximo"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            {/* Help text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
                ESC para fechar • Setas para navegar
            </div>
        </div>
    );
}
