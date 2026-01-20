'use client';
import CardTitle from "@/_components/CardTitle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ClickBar from "./ClickBar";


interface ClickData {
    date: string;
    clicks: number;
}

interface ClickTrendsProps {
    data: ClickData[];
}

export function ClickTrends({ data }: ClickTrendsProps) {
    const maxClicks = Math.max(...data.map(d => d.clicks), 1);

    return (
        <Card className="bg-card rounded-md p-6">
            <CardHeader>
                <CardTitle title="Tendencia de Clicks (Ultimos 7 Dias)" />
            </CardHeader>
            <CardContent>
                <div className="h-48 flex items-end justify-between gap-3">
                    {data.map((day, index) => (
                        <ClickBar
                            key={index}
                            clicks={day.clicks}
                            maxClicks={maxClicks}
                            label={new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
