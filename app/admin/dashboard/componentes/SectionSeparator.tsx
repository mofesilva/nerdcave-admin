'use client';

import { LucideIcon } from 'lucide-react';

interface SectionSeparatorProps {
    /** Título da seção */
    title: string;
    /** Descrição opcional */
    description?: string;
    /** Ícone opcional */
    icon?: LucideIcon;
    /** Classes adicionais */
    className?: string;
}

export default function SectionSeparator({ title, description, icon: Icon, className = '' }: SectionSeparatorProps) {
    return (
        <div className={`pt-4 pb-2 ${className}`}>
            <div className="flex items-center gap-3 mb-2">
                {Icon && (
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
            </div>
            <div
                className="w-full h-px"
                style={{
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.08) 90%, transparent)'
                }}
            />
        </div>
    );
}
