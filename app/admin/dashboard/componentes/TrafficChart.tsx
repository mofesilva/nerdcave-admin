"use client";

import CardTitle from "@/_components/CardTitle";
import ChartLegend from "@/_components/ChartLegend";
import { Card, CardHeader, CardContent } from "@/components/ui/card";


interface TrafficChartProps {
    data: Array<{ date: string; clicks: number }>;
}

export default function TrafficChart({ data }: TrafficChartProps) {
    const maxClicks = Math.max(...data.map(d => d.clicks), 1);

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle
                    title="Tráfego"
                    subtitle="Últimos 7 dias"
                    trailing={
                        <ChartLegend
                            items={[
                                { label: "Clicks", color: "primary" },
                                { label: "Views", color: "emerald" },
                            ]}
                        />
                    }
                />
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-end gap-2 h-48">
                    {data.slice(-7).map((day, i) => {
                        const height = (day.clicks / maxClicks) * 100;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col justify-end items-center h-40">
                                    <div
                                        className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden transition-all duration-500"
                                        style={{ height: `${height}%`, minHeight: day.clicks > 0 ? '8px' : '4px' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/60" />
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                </span>
                            </div>
                        );
                    })}
                    {data.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Sem dados ainda
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
