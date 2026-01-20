/**
 * ⚠️ NÃO MEXA NESSE COMPONENTE ⚠️
 * 
 * Este componente está funcionando corretamente.
 * Qualquer alteração pode quebrar o layout em múltiplas páginas.
 */

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
    height = "h-10",
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
        <div className={`flex items-stretch gap-2 sm:gap-3 ${height} ${className}`}>
            {!hideSearch && (
                <div className={`flex items-center gap-2 bg-card rounded-md px-3 min-w-[200px] flex-1 sm:max-w-md border border-border focus-within:border-primary transition-colors`}>
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={searchPlaceholder}
                        className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground flex-1 min-w-0"
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
