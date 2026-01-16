"use client";

import { LucideIcon, Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'custom';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    /** Classe Tailwind para cor de fundo (ex: 'bg-nerdcave-purple') */
    bgColor?: string;
    /** Classe Tailwind para cor do texto (ex: 'text-white') */
    textColor?: string;
    /** Classe Tailwind para hover (ex: 'hover:bg-nerdcave-lime') */
    hoverColor?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-card border border-border text-foreground hover:bg-muted',
    ghost: 'bg-transparent text-foreground hover:bg-muted',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    custom: '', // Cores definidas via props
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
};

const iconSizes: Record<ButtonSize, string> = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
};

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    bgColor,
    textColor,
    hoverColor,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    // Se cores customizadas forem passadas, usa variant='custom'
    const isCustom = !!(bgColor || textColor || hoverColor);
    const effectiveVariant = isCustom ? 'custom' : variant;

    // Classes Tailwind para cores customizadas
    const customColors = isCustom
        ? `${bgColor || ''} ${textColor || ''} ${hoverColor || ''}`
        : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                inline-flex items-center justify-center font-semibold rounded-xl
                transition-all duration-200 ease-out
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer
                ${variantStyles[effectiveVariant]}
                ${customColors}
                ${sizeStyles[size]}
                ${className}
            `}
        >
            {loading ? (
                <Loader2 className={`${iconSizes[size]} animate-spin`} />
            ) : (
                Icon && iconPosition === 'left' && <Icon className={iconSizes[size]} />
            )}

            <span>{children}</span>

            {!loading && Icon && iconPosition === 'right' && (
                <Icon className={iconSizes[size]} />
            )}
        </button>
    );
}
