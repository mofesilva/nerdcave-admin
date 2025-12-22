"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type StatCardColor = 'blue' | 'emerald' | 'purple' | 'orange' | 'pink' | 'cyan';

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sublabel?: string;
    trend?: string;
    color?: StatCardColor;
    href?: string;
}

const colorClasses: Record<StatCardColor, string> = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600',
};

export default function StatCard({
    icon: Icon,
    label,
    value,
    sublabel,
    trend,
    color = 'blue',
    href
}: StatCardProps) {
    const content = (
        <div className={`bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all h-full flex flex-col ${href ? 'cursor-pointer hover:shadow-lg' : ''}`}>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
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
