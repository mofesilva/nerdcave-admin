"use client";

import { createContext, useContext } from "react";

interface ToolbarContextValue {
    height: string;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

export function ToolbarProvider({
    children,
    height
}: {
    children: React.ReactNode;
    height: string;
}) {
    return (
        <ToolbarContext.Provider value={{ height }}>
            {children}
        </ToolbarContext.Provider>
    );
}

/**
 * Hook para obter a altura da toolbar pai.
 * Retorna a altura da toolbar se estiver dentro de uma, ou a altura padrão passada.
 */
export function useToolbarHeight(defaultHeight: string = "h-8"): string {
    const context = useContext(ToolbarContext);
    return context?.height ?? defaultHeight;
}
