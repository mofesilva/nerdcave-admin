"use client";

import { GridIcon, ListIcon } from "./icons";

type ViewMode = "grid" | "list";

interface ViewModeToggleProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
    return (
        <div className="flex items-center gap-1 flex-shrink-0">
            <button
                onClick={() => onViewModeChange("grid")}
                className={`h-11 w-11 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${viewMode === "grid"
                    ? "bg-nerdcave-lime border-nerdcave-lime text-nerdcave-dark"
                    : "bg-nerdcave-light/10 border-nerdcave-light/20 text-nerdcave-light hover:border-nerdcave-lime/50"
                    }`}
                title="Visualização em grid"
            >
                <GridIcon />
            </button>
            <button
                onClick={() => onViewModeChange("list")}
                className={`h-11 w-11 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${viewMode === "list"
                    ? "bg-nerdcave-lime border-nerdcave-lime text-nerdcave-dark"
                    : "bg-nerdcave-light/10 border-nerdcave-light/20 text-nerdcave-light hover:border-nerdcave-lime/50"
                    }`}
                title="Visualização em lista"
            >
                <ListIcon />
            </button>
        </div>
    );
}
