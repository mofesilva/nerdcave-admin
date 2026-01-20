'use client';

import { LucideIcon } from 'lucide-react';
import IconContainer from '@/_components/IconContainer';
import { Switch } from '@/components/ui/switch';

interface SectionTitleProps {
    /** Título da seção */
    title: string;
    /** Descrição opcional */
    description?: string;
    /** Ícone opcional */
    icon?: LucideIcon;
    /** Se deve mostrar o switch de visibilidade */
    collapsible?: boolean;
    /** Estado de visibilidade (true = expandido, false = colapsado) */
    expanded?: boolean;
    /** Callback quando o estado de visibilidade mudar */
    onExpandedChange?: (expanded: boolean) => void;
    /** Classes adicionais */
    className?: string;
}

export default function SectionTitle({
    title,
    description,
    icon: Icon,
    collapsible = false,
    expanded = true,
    onExpandedChange,
    className = ''
}: SectionTitleProps) {
    return (
        <div className={`pt-4 pb-2 ${className}`}>
            <div className="flex items-center gap-3 mb-2">
                {Icon && (
                    <IconContainer icon={Icon} size="sm" />
                )}
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
                {collapsible && (
                    <Switch
                        checked={expanded}
                        onCheckedChange={onExpandedChange}
                        aria-label={expanded ? "Ocultar seção" : "Mostrar seção"}
                    />
                )}
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
