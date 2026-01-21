interface PageTitleProps {
    title: string;
    description?: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
    return (
        <div>
            <h1 className="text-base sm:text-lg 2xl:text-2xl font-semibold text-foreground">{title}</h1>
            {description && (
                <p className="text-muted-foreground text-[11px] sm:text-xs hidden sm:block">{description}</p>
            )}
        </div>
    );
}
