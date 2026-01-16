"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sublabel?: string;
    trend?: string;
    href?: string;
}

export default function StatCard({
    icon: Icon,
    label,
    value,
    sublabel,
    trend,
    href
}: StatCardProps) {
    const content = (
        <div className={`bg-card rounded-md border border-border p-4 hover:border-primary/30 transition-all h-full flex flex-col ${href ? 'cursor-pointer hover:shadow-lg' : ''}`}>
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="mt-auto pt-1 min-h-[20px]">
                {sublabel && (
                    <p className="text-xs text-muted-foreground/70">{sublabel}</p>
                )}
                {trend && (
                    <div className="flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-emerald-500 font-medium">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}
