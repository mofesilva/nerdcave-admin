"use client";

interface TrafficChartProps {
    data: Array<{ date: string; clicks: number }>;
}

export default function TrafficChart({ data }: TrafficChartProps) {
    const maxClicks = Math.max(...data.map(d => d.clicks), 1);

    return (
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-foreground">Tráfego</h2>
                    <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">Views</span>
                    </div>
                </div>
            </div>

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
        </div>
    );
}
