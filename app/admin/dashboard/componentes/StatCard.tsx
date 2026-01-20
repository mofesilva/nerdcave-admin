"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import IconContainer from "@/_components/IconContainer";

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
        <Card className={cn(
            "h-full transition-all",
            href && "cursor-pointer hover:shadow-md hover:border-primary/30"
        )}>
            <CardContent className="p-4 flex flex-col h-full">
                <IconContainer icon={Icon} className="mb-3" />
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="mt-auto pt-1 min-h-5">
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
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}
