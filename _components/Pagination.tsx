"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "./IconButton";

interface PaginationProps {
    /** Página atual (1-indexed) */
    page: number;
    /** Total de páginas */
    totalPages: number;
    /** Callback quando muda de página */
    onPageChange: (page: number) => void;
    /** Quantidade de páginas visíveis antes do "..." (default: 5) */
    visiblePages?: number;
    /** Classes adicionais */
    className?: string;
}

/**
 * Componente de paginação reutilizável.
 * Exibe: < [página anterior] [páginas] ... [última página] >
 */
export default function Pagination({
    page,
    totalPages,
    onPageChange,
    visiblePages = 5,
    className = "",
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Gera os números de página para exibir
    function getPageNumbers(): (number | "...")[] {
        const pages: (number | "...")[] = [];

        // Página anterior (se existir)
        const start = Math.max(1, page - 1);
        // N páginas a partir da anterior
        const end = Math.min(start + visiblePages, totalPages);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Se há mais páginas, adiciona ... e a última múltipla de 10 (ou última página)
        if (end < totalPages) {
            pages.push("...");
            // Próxima múltipla de 10 ou última página
            const nextTen = Math.ceil(totalPages / 10) * 10;
            const lastPage = nextTen > totalPages ? totalPages : nextTen;
            if (!pages.includes(lastPage)) {
                pages.push(lastPage);
            }
        }

        return pages;
    }

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <IconButton
                icon={<ChevronLeft />}
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            />

            {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                    <span key={`dots-${idx}`} className="px-2 text-muted-foreground">
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`min-w-[36px] h-9 rounded-md text-sm font-medium transition-colors ${p === page
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {p}
                    </button>
                )
            )}

            <IconButton
                icon={<ChevronRight />}
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            />
        </div>
    );
}
