interface PostCardTitleProps {
    title: string;
    variant: "list" | "grid";
}

export function PostCardTitle({ title, variant }: PostCardTitleProps) {
    if (variant === "list") {
        return (
            <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 sm:truncate">
                {title}
            </h3>
        );
    }

    return (
        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
            {title}
        </h3>
    );
}
