"use client";

import { LucideIcon, FileQuestion } from "lucide-react";

interface EmptyStateProps {
    /** Ícone a exibir */
    icon?: LucideIcon;
    /** Título/mensagem principal */
    title?: string;
    /** Descrição secundária */
    description?: string;
    /** Ação opcional (botão, link, etc.) */
    action?: React.ReactNode;
    /** Classes adicionais */
    className?: string;
}

/**
 * Estado vazio padrão para listagens sem dados.
 */
export default function EmptyState({
    icon: Icon = FileQuestion,
    title = "Nenhum item encontrado",
    description,
    action,
    className = "",
}: EmptyStateProps) {
    return (
        <div className={`text-center py-16 bg-card rounded-2xl border border-border ${className}`}>
            <Icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">{title}</p>
            {description && (
                <p className="text-sm text-muted-foreground/70 mt-2">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
