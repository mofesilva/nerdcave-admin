"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { getCappuccinoClient } from "@/lib/cappuccino/client";
import type { CappuccinoClient } from "@cappuccino/web-sdk";

interface CappuccinoContextValue {
    app: CappuccinoClient;
}

const CappuccinoContext = createContext<CappuccinoContextValue | null>(null);

export function CappuccinoProvider({ children }: { children: ReactNode }) {
    const app = useMemo(() => getCappuccinoClient(), []);

    return (
        <CappuccinoContext.Provider value={{ app }}>
            {children}
        </CappuccinoContext.Provider>
    );
}

export function useCappuccino(): CappuccinoContextValue {
    const context = useContext(CappuccinoContext);
    if (!context) {
        throw new Error("useCappuccino must be used within a CappuccinoProvider");
    }
    return context;
}
