"use client";

import { AlertCircle, X, LucideIcon } from "lucide-react";

interface ErrorAlertProps {
    /** Mensagem de erro */
    message: string;
    /** Callback para fechar/dispensar o alerta */
    onDismiss?: () => void;
    /** Ícone customizado */
    icon?: LucideIcon;
    /** Variante de cor */
    variant?: "error" | "warning" | "info";
    /** Classes adicionais */
    className?: string;
}

const variantStyles = {
    error: "bg-red-500/10 border-red-500/20 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

/**
 * Alerta de erro/aviso reutilizável.
 */
export default function ErrorAlert({
    message,
    onDismiss,
    icon: Icon = AlertCircle,
    variant = "error",
    className = "",
}: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${variantStyles[variant]} ${className}`}>
            <Icon className="w-5 h-5 shrink-0" />
            <span className="flex-1">{message}</span>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
