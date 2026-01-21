"use client";

import { LucideIcon, Loader2 } from 'lucide-react';
import { useToolbarHeight } from './ToolbarContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'custom';
type ButtonSize = 'sm' | 'md' | 'lg' | 'auto';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: ButtonVariant;
    /** Tamanho do botão. Use 'auto' para herdar a altura da Toolbar pai */
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
    /** Classe Tailwind para border radius (ex: 'rounded-full', 'rounded-lg') */
    rounded?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-card border border-border text-foreground hover:bg-muted',
    ghost: 'bg-transparent text-foreground hover:bg-muted',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    custom: '', // Cores definidas via props
};

const sizeStyles: Record<Exclude<ButtonSize, 'auto'>, string> = {
    sm: 'h-6 px-2 text-[11px] gap-1',
    md: 'h-8 px-3 text-xs gap-1.5',
    lg: 'h-9 px-4 text-xs gap-2',
};

const iconSizes: Record<Exclude<ButtonSize, 'auto'>, string> = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
};

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'lg',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    bgColor,
    textColor,
    hoverColor,
    rounded = 'rounded-md',
}: ButtonProps) {
    const toolbarHeight = useToolbarHeight();
    const isDisabled = disabled || loading;

    // Se size='auto', usa a altura da toolbar
    const isAutoSize = size === 'auto';
    const effectiveSize: Exclude<ButtonSize, 'auto'> = isAutoSize ? 'md' : size;

    // Classes de altura: se auto, usa toolbarHeight; senão usa sizeStyles
    const heightClass = isAutoSize ? toolbarHeight : '';
    const sizeClass = isAutoSize ? 'px-3 text-xs gap-1.5' : sizeStyles[effectiveSize];

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
                inline-flex items-center justify-center font-semibold ${rounded}
                transition-all duration-200 ease-out
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer
                ${variantStyles[effectiveVariant]}
                ${customColors}
                ${heightClass}
                ${sizeClass}
                ${className}
            `}
        >
            {loading ? (
                <Loader2 className={`${iconSizes[effectiveSize]} animate-spin`} />
            ) : (
                Icon && iconPosition === 'left' && <Icon className={iconSizes[effectiveSize]} />
            )}

            <span>{children}</span>

            {!loading && Icon && iconPosition === 'right' && (
                <Icon className={iconSizes[effectiveSize]} />
            )}
        </button>
    );
}
