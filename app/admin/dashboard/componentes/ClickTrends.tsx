'use client';

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
        <div className="bg-card rounded-md p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Tendencia de Clicks (Ultimos 7 Dias)</h3>
            <div className="h-48 flex items-end justify-between gap-3">
                {data.map((day, index) => {
                    const height = (day.clicks / maxClicks) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                {day.clicks}
                            </span>
                            <div
                                className="w-full bg-muted group-hover:bg-primary rounded-md transition-colors cursor-pointer"
                                style={{ height: `${height}%`, minHeight: '8px' }}
                            />
                            <span className="text-xs text-muted-foreground font-medium">
                                {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
