"use client";

import { Search, X } from "lucide-react";
import IconButton from "./IconButton";

interface ToolbarProps {
    /** Valor do campo de busca */
    search?: string;
    /** Callback quando o valor da busca muda */
    onSearchChange?: (value: string) => void;
    /** Callback quando o usuário pressiona Enter ou clica em buscar */
    onSearch?: (value: string) => void;
    /** Placeholder do campo de busca */
    searchPlaceholder?: string;
    /** Altura da toolbar (default: h-12) */
    height?: string;
    /** Esconde o campo de busca */
    hideSearch?: boolean;
    /** Componentes adicionais (botões, selects, etc.) */
    children?: React.ReactNode;
    /** Classes adicionais */
    className?: string;
}

export default function Toolbar({
    search = "",
    onSearchChange,
    onSearch,
    searchPlaceholder = "Buscar... (Enter)",
    height = "h-13",
    hideSearch = false,
    children,
    className = "",
}: ToolbarProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(search);
        }
    };

    const handleClear = () => {
        onSearchChange?.("");
        onSearch?.("");
    };

    return (
        <div className={`flex items-stretch gap-3 ${height} ${className}`}>
            {!hideSearch && (
                <div className="flex items-center gap-3 bg-card rounded-xl px-4 flex-1 min-w-[200px] max-w-md border border-border">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={searchPlaceholder}
                        className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground flex-1"
                    />
                    {search && (
                        <IconButton icon={<X />} onClick={handleClear} />
                    )}
                </div>
            )}
            {children}
        </div>
    );
}
