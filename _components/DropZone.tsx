"use client";

import { useRef } from "react";
import { Upload, LucideIcon } from "lucide-react";

interface DropZoneProps {
    /** Callback quando arquivos são selecionados */
    onFiles: (files: FileList) => void;
    /** Tipos de arquivo aceitos (default: "image/*") */
    accept?: string;
    /** Permitir múltiplos arquivos (default: true) */
    multiple?: boolean;
    /** Ícone customizado */
    icon?: LucideIcon;
    /** Texto principal */
    text?: string;
    /** Texto do link clicável */
    linkText?: string;
    /** Desabilitado */
    disabled?: boolean;
    /** Classes adicionais */
    className?: string;
}

/**
 * Área de drag & drop para upload de arquivos.
 * Suporta arrastar arquivos ou clicar para selecionar.
 */
export default function DropZone({
    onFiles,
    accept = "image/*",
    multiple = true,
    icon: Icon = Upload,
    text = "Arraste arquivos ou",
    linkText = "clique aqui",
    disabled = false,
    className = "",
}: DropZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (disabled) return;
        if (e.dataTransfer.files.length) {
            onFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            onFiles(e.target.files);
            // Limpa o input para permitir reselecionar o mesmo arquivo
            e.target.value = "";
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed border-card rounded-md p-8 text-center transition-colors ${disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-primary cursor-pointer"
                } ${className}`}
            onClick={() => !disabled && inputRef.current?.click()}
        >
            <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
                {text}{" "}
                <span className="text-primary hover:underline">
                    {linkText}
                </span>
            </p>
            <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                accept={accept}
                className="hidden"
                onChange={handleChange}
                disabled={disabled}
            />
        </div>
    );
}
