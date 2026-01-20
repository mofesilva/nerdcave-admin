"use client";

import { PieChart } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CardTitle from "@/_components/CardTitle";
import ProgressBar from "./ProgressBar";

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
        <Card>
            <CardHeader className="pb-2">
                <CardTitle
                    title="Dispositivos"
                    subtitle="Por tipo de acesso"
                    trailing={<PieChart className="w-5 h-5 text-muted-foreground" />}
                />
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-4">
                    {devices.map((device) => (
                        <ProgressBar
                            key={device.label}
                            label={device.label}
                            value={device.value}
                            total={total}
                            color={device.color}
                        />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <div className="w-full">
                    <Separator className="mb-4" />
                    <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                            {formatNumber(totalClicks)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total de cliques</p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
