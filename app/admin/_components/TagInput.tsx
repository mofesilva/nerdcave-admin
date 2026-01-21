"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import type { Tag } from "@/lib/tags/Tag.model";
import * as TagsController from "@/lib/tags/Tag.controller";

interface TagInputProps {
    selectedTags: Tag[];
    onTagsChange: (tags: Tag[]) => void;
}

export default function TagInput({ selectedTags, onTagsChange }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Tag[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Carrega todas as tags disponíveis
    useEffect(() => {
        async function loadTags() {
            const tags = await TagsController.getAllTags();
            setAllTags(tags);
        }
        loadTags();
    }, []);

    // Filtra sugestões baseado no input
    useEffect(() => {
        if (inputValue.trim()) {
            const filtered = allTags.filter(tag =>
                tag.name.toLowerCase().includes(inputValue.toLowerCase().trim()) &&
                !selectedTags.some(selected => selected._id === tag._id)
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [inputValue, allTags, selectedTags]);

    const addTag = async (tagName: string) => {
        const trimmed = tagName.trim();
        if (!trimmed) return;

        // Verifica se já está selecionada
        if (selectedTags.some(tag => tag.name.toLowerCase() === trimmed.toLowerCase())) {
            setInputValue('');
            return;
        }

        // Busca ou cria a tag
        const tag = await TagsController.getOrCreateTag({ name: trimmed });
        onTagsChange([...selectedTags, tag]);
        setInputValue('');
        setShowSuggestions(false);

        // Atualiza lista de tags
        const updatedTags = await TagsController.getAllTags();
        setAllTags(updatedTags);
    };

    const removeTag = (tagId: string) => {
        onTagsChange(selectedTags.filter(tag => tag._id !== tagId));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            // Remove última tag se input vazio e apertar backspace
            removeTag(selectedTags[selectedTags.length - 1]._id);
        }
    };

    const selectSuggestion = (tag: Tag) => {
        onTagsChange([...selectedTags, tag]);
        setInputValue('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    return (
        <div className="bg-card rounded-md border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Tags</h3>

            <div className="relative">
                {/* Tags selecionadas + Input */}
                <div className="flex flex-wrap gap-2 p-2 border border-border rounded-md bg-background min-h-[42px] focus-within:border-primary transition-colors">
                    {selectedTags.map(tag => (
                        <span
                            key={tag._id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                        >
                            {tag.name}
                            <button
                                onClick={() => removeTag(tag._id)}
                                className="hover:bg-primary-foreground/20 rounded-sm p-0.5 transition-colors"
                                type="button"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedTags.length === 0 ? "Digite e pressione vírgula ou Enter..." : ""}
                        className="flex-1 min-w-[150px] bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
                    />
                </div>

                {/* Sugestões */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                        {suggestions.map(tag => (
                            <button
                                key={tag._id}
                                onClick={() => selectSuggestion(tag)}
                                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center justify-between"
                                type="button"
                            >
                                <span>{tag.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {tag.usageCount} {tag.usageCount === 1 ? 'uso' : 'usos'}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
                Digite o nome da tag e pressione vírgula ou Enter para adicionar
            </p>
        </div>
    );
}
