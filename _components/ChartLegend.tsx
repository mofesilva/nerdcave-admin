"use client";

import { cn } from "@/lib/utils";

interface LegendItem {
    label: string;
    color: "primary" | "emerald" | "amber" | "destructive" | "muted";
}

interface ChartLegendProps {
    items: LegendItem[];
    className?: string;
}

const colorClasses = {
    primary: "bg-primary",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    destructive: "bg-destructive",
    muted: "bg-muted-foreground",
};

export default function ChartLegend({ items, className }: ChartLegendProps) {
    return (
        <div className={cn("flex items-center gap-4 text-sm", className)}>
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", colorClasses[item.color])} />
                    <span className="text-muted-foreground">{item.label}</span>
                </div>
            ))}
        </div>
    );
}
