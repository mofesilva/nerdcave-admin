"use client";

import { ReactNode } from "react";

interface CardTitleProps {
    /** Título principal do card */
    title: string;
    /** Subtítulo/descrição do card */
    subtitle?: string;
    /** Conteúdo adicional à direita (ícone, link, etc) */
    trailing?: ReactNode;
    /** Margin bottom customizada (default: mb-6) */
    className?: string;
}

export default function CardTitle({
    title,
    subtitle,
    trailing,
    className = "mb-6"
}: CardTitleProps) {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                {subtitle && (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
            </div>
            {trailing}
        </div>
    );
}
