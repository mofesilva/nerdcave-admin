"use client";

interface ProgressBarProps {
    label: string;
    value: number;
    total: number;
    color: string;
}

export default function ProgressBar({ label, value, total, color }: ProgressBarProps) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground font-medium">{label}</span>
                <span className="text-muted-foreground">{percent}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-700`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
