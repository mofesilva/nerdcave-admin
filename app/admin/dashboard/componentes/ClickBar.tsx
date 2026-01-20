"use client";

interface ClickBarProps {
    clicks: number;
    maxClicks: number;
    label: string;
}

export default function ClickBar({ clicks, maxClicks, label }: ClickBarProps) {
    const height = (clicks / maxClicks) * 100;
    return (
        <div className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {clicks}
            </span>
            <div
                className="w-full bg-muted group-hover:bg-primary rounded-md transition-colors cursor-pointer"
                style={{ height: `${height}%`, minHeight: '8px' }}
            />
            <span className="text-xs text-muted-foreground font-medium">
                {label}
            </span>
        </div>
    );
}
