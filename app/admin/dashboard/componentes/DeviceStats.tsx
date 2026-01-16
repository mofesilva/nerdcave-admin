"use client";

import { PieChart } from "lucide-react";
import CardTitleSection from "@/_components/CardTitleSection";

interface DeviceStatsProps {
    desktop: number;
    mobile: number;
    tablet: number;
    totalClicks: number;
}

export default function DeviceStats({ desktop, mobile, tablet, totalClicks }: DeviceStatsProps) {
    const total = desktop + mobile + tablet;

    const devices = [
        { label: 'Desktop', value: desktop, color: 'bg-blue-500' },
        { label: 'Mobile', value: mobile, color: 'bg-purple-500' },
        { label: 'Tablet', value: tablet, color: 'bg-emerald-500' },
    ];

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    return (
        <div className="bg-card rounded-md border border-border p-6">
            <CardTitleSection
                title="Dispositivos"
                subtitle="Por tipo de acesso"
                trailing={<PieChart className="w-5 h-5 text-muted-foreground" />}
            />

            <div className="space-y-4">
                {devices.map((device) => {
                    const percent = total > 0 ? Math.round((device.value / total) * 100) : 0;

                    return (
                        <div key={device.label}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground font-medium">{device.label}</span>
                                <span className="text-muted-foreground">{percent}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${device.color} rounded-full transition-all duration-700`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                        {formatNumber(totalClicks)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total de cliques</p>
                </div>
            </div>
        </div>
    );
}
