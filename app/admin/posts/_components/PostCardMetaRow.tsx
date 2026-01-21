import { Calendar, Clock } from "lucide-react";
import IconContainer from "@/_components/IconContainer";

interface PostCardMetaRowProps {
    status: string;
    publishedAt?: string;
    readingTime: number;
    formatDate: (dateStr?: string) => string;
    variant: "list" | "grid";
}

export function PostCardMetaRow({
    status,
    publishedAt,
    readingTime,
    formatDate,
    variant,
}: PostCardMetaRowProps) {
    const isPublished = status === 'published';
    const gap = variant === "list" ? "gap-2" : "gap-3";
    const marginBottom = variant === "grid" ? "mb-2" : "";

    return (
        <div className={`flex items-center ${gap} text-xs text-muted-foreground ${marginBottom}`}>
            <span className="flex items-center gap-1">
                <IconContainer icon={Calendar} size="xs" variant="accent" className="rounded" />
                {isPublished ? formatDate(publishedAt) : 'Rascunho'}
            </span>
            <span className="flex items-center gap-1">
                <IconContainer icon={Clock} size="xs" variant="accent" className="rounded" />
                {readingTime} min
            </span>
        </div>
    );
}
