"use client";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface BlogInfoSectionProps {
    blogName: string;
    blogDescription: string;
    blogKeywords: string;
    onBlogNameChange: (value: string) => void;
    onBlogDescriptionChange: (value: string) => void;
    onBlogKeywordsChange: (value: string) => void;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function BlogInfoSection({
    blogName,
    blogDescription,
    blogKeywords,
    onBlogNameChange,
    onBlogDescriptionChange,
    onBlogKeywordsChange,
}: BlogInfoSectionProps) {
    return (
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-2">Informações do Blog</h2>
            <p className="text-muted-foreground mb-6">Dados exibidos no admin e metadados SEO</p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Nome do Blog
                    </label>
                    <input
                        type="text"
                        value={blogName}
                        onChange={(e) => onBlogNameChange(e.target.value)}
                        placeholder="Meu Blog"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Descrição do Blog
                    </label>
                    <textarea
                        value={blogDescription}
                        onChange={(e) => onBlogDescriptionChange(e.target.value)}
                        placeholder="Uma breve descrição do seu blog..."
                        rows={3}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50 resize-none"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                        Usado como meta description para SEO
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Palavras-chave
                    </label>
                    <input
                        type="text"
                        value={blogKeywords}
                        onChange={(e) => onBlogKeywordsChange(e.target.value)}
                        placeholder="blog, tecnologia, games, etc"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Separe as palavras por vírgula</p>
                </div>
            </div>
        </div>
    );
}
