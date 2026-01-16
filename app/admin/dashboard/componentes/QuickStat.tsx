"use client";

interface QuickStatProps {
    icon: React.ElementType;
    label: string;
    value: number;
}

export default function QuickStat({ icon: Icon, label, value }: QuickStatProps) {
    return (
        <div className="bg-card/50 rounded-md border border-border/50 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}
