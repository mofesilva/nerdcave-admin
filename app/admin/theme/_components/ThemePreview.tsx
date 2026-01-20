"use client";

interface ThemePreviewProps {
    backgroundColor: string;
    foregroundColor: string;
    accentColor: string;
    accentTextColor: string;
    sidebarBackgroundColor: string;
    sidebarForegroundColor: string;
    sidebarActiveColor: string;
    sidebarHoverColor: string;
    cardBackgroundColor: string;
    cardForegroundColor: string;
    cardBorderColor: string;
    mutedTextColor: string;
    mutedColor: string;
}

export default function ThemePreview({
    backgroundColor,
    foregroundColor,
    accentColor,
    accentTextColor,
    sidebarBackgroundColor,
    sidebarForegroundColor,
    sidebarActiveColor,
    sidebarHoverColor,
    cardBackgroundColor,
    cardForegroundColor,
    cardBorderColor,
    mutedTextColor,
    mutedColor,
}: ThemePreviewProps) {
    return (
        <div className="bg-card rounded-md p-6 shadow-sm border border-border/50 sticky top-6">
            <h2 className="text-lg font-bold text-foreground mb-1">Preview</h2>
            <p className="text-sm text-muted-foreground mb-4">Visualização do contraste</p>

            {/* Mini App Preview */}
            <div
                className="rounded-lg overflow-hidden border shadow-sm"
                style={{ backgroundColor, borderColor: mutedColor }}
            >
                <div className="flex">
                    {/* Sidebar */}
                    <div
                        className="w-16 min-h-[220px] p-2 flex flex-col gap-1"
                        style={{ backgroundColor: sidebarBackgroundColor }}
                    >
                        {/* Active item */}
                        <div
                            className="w-full aspect-square rounded flex items-center justify-center"
                            style={{ backgroundColor: sidebarActiveColor }}
                        >
                            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: accentTextColor }} />
                        </div>
                        {/* Hover item */}
                        <div
                            className="w-full aspect-square rounded flex items-center justify-center"
                            style={{ backgroundColor: sidebarHoverColor }}
                        >
                            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: sidebarForegroundColor }} />
                        </div>
                        {/* Normal items */}
                        <div className="w-full aspect-square rounded flex items-center justify-center">
                            <div className="w-4 h-4 rounded-sm opacity-60" style={{ backgroundColor: sidebarForegroundColor }} />
                        </div>
                        <div className="w-full aspect-square rounded flex items-center justify-center">
                            <div className="w-4 h-4 rounded-sm opacity-40" style={{ backgroundColor: sidebarForegroundColor }} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 space-y-2">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div
                                className="h-3 w-20 rounded"
                                style={{ backgroundColor: foregroundColor }}
                            />
                            <div
                                className="px-2 py-1 rounded text-[8px] font-medium"
                                style={{ backgroundColor: accentColor, color: accentTextColor }}
                            >
                                Botão
                            </div>
                        </div>

                        {/* Card */}
                        <div
                            className="p-2 rounded"
                            style={{
                                backgroundColor: cardBackgroundColor,
                                borderWidth: 1,
                                borderColor: cardBorderColor,
                            }}
                        >
                            <div
                                className="h-2 w-16 rounded mb-1"
                                style={{ backgroundColor: cardForegroundColor }}
                            />
                            <div
                                className="h-2 w-24 rounded"
                                style={{ backgroundColor: mutedTextColor }}
                            />
                        </div>

                        {/* Card 2 */}
                        <div
                            className="p-2 rounded"
                            style={{
                                backgroundColor: cardBackgroundColor,
                                borderWidth: 1,
                                borderColor: cardBorderColor,
                            }}
                        >
                            <div
                                className="h-2 w-12 rounded mb-1"
                                style={{ backgroundColor: cardForegroundColor }}
                            />
                            <div
                                className="h-2 w-20 rounded"
                                style={{ backgroundColor: mutedTextColor }}
                            />
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full" style={{ backgroundColor: mutedColor }} />

                        {/* Muted text sample */}
                        <div className="flex gap-2">
                            <div className="h-2 w-8 rounded" style={{ backgroundColor: mutedTextColor }} />
                            <div className="h-2 w-12 rounded" style={{ backgroundColor: mutedTextColor }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Color Swatches Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor }}
                    />
                    <span className="text-muted-foreground">Fundo</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: foregroundColor }}
                    />
                    <span className="text-muted-foreground">Texto</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: accentColor }}
                    />
                    <span className="text-muted-foreground">Destaque</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: sidebarBackgroundColor }}
                    />
                    <span className="text-muted-foreground">Sidebar</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: cardBackgroundColor }}
                    />
                    <span className="text-muted-foreground">Card</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: mutedTextColor }}
                    />
                    <span className="text-muted-foreground">Mudo</span>
                </div>
            </div>
        </div>
    );
}
