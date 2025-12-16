'use client';

interface DeviceStatsProps {
    mobile: number;
    desktop: number;
    tablet: number;
}

export function DeviceStats({ mobile, desktop, tablet }: DeviceStatsProps) {
    return (
        <div className="bg-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-5">Trafego por Dispositivo</h3>
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-base font-semibold text-muted-foreground">Mobile</span>
                        <span className="text-base font-black text-foreground">{mobile}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${mobile}%` }}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-base font-semibold text-muted-foreground">Desktop</span>
                        <span className="text-base font-black text-foreground">{desktop}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${desktop}%` }}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-base font-semibold text-muted-foreground">Tablet</span>
                        <span className="text-base font-black text-foreground">{tablet}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${tablet}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
