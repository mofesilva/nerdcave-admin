"use client";

import type { Tag } from "@/lib/tags/Tag.model";

interface TagSelectorProps {
    tags: Tag[];
    selectedTagIds: string[];
    onToggle: (tagId: string) => void;
}

export default function TagSelector({ tags, selectedTagIds, onToggle }: TagSelectorProps) {
    return (
        <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <button
                        key={tag._id}
                        onClick={() => onToggle(tag._id)}
                        className={`px-3 py-1 rounded-full text-sm transition cursor-pointer ${selectedTagIds.includes(tag._id)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                    >
                        {tag.name}
                    </button>
                ))}
                {tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma tag criada</p>
                )}
            </div>
        </div>
    );
}
