import ScrollIndicator from "@/_components/ScrollIndicator";

interface FloatingScrollIndicatorsProps {
    canScrollUp: boolean;
    canScrollDown: boolean;
}

export default function FloatingScrollIndicators({
    canScrollUp,
    canScrollDown,
}: FloatingScrollIndicatorsProps) {
    return (
        <>
            {canScrollUp && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 md:left-[calc(50%+2.5rem)]">
                    <ScrollIndicator direction="up" fixed />
                </div>
            )}
            {canScrollDown && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:left-[calc(50%+2.5rem)]">
                    <ScrollIndicator direction="down" fixed />
                </div>
            )}
        </>
    );
}
