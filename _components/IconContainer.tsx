"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconContainerProps {
    icon: LucideIcon | React.ElementType;
    size?: "xs" | "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "muted" | "success" | "warning" | "destructive" | "accent";
    className?: string;
}

const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
};

const iconSizeClasses = {
    xs: "w-2.5 h-2.5",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
};

const variantClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    muted: "bg-muted text-muted-foreground",
    success: "bg-emerald-500 text-white dark:bg-emerald-600",
    warning: "bg-amber-500 text-white dark:bg-amber-600",
    destructive: "bg-destructive text-destructive-foreground",
    accent: "bg-primary/20 text-primary",
};

export default function IconContainer({
    icon: Icon,
    size = "md",
    variant = "accent",
    className,
}: IconContainerProps) {
    return (
        <div
            className={cn(
                "rounded-md flex items-center justify-center",
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
        >
            <Icon className={iconSizeClasses[size]} />
        </div>
    );
}
