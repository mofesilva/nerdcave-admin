"use client";

import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon: ReactNode;
    iconBgColor?: string;
    iconColor?: string;
}

export function StatsCard({
    title,
    value,
    change,
    icon,
    iconBgColor = "bg-orange-100",
    iconColor = "text-orange-600"
}: StatCardProps) {
    return (
        <div className="bg-card rounded-md p-6 border border-border cursor-pointer">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-md flex items-center justify-center bg-primary`}>
                    <div className={'text-primary-foreground'}>{icon}</div>
                </div>
                {change && (
                    <span className="text-sm text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
                        {change}
                    </span>
                )}
            </div>
            <p className="text-3xl font-black text-foreground">
                {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p className="text-base text-muted-foreground font-medium mt-1">{title}</p>
        </div>
    );
}
