"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ArticleCardWithLoader } from "./components/ArticleCardWithLoader";
import { CategoryButton } from "./components/CategoryButton";
import { ViewModeToggle } from "./components/ViewModeToggle";
import { LayoutGrid, Gamepad2, Tv, Dices, Cpu, Star, Calendar, LucideIcon, ChevronDown, Search, X, Loader2 } from "lucide-react";
import { ArticlesController, CategoriesController, MediaController } from "@/lib/controllers";
import { ArticleModel } from "@/lib/models/Article.model";
import { CategoryModel } from "@/lib/models/Category.model";
import { MediaModel } from "@/lib/models/Media.model";
import { useAutoLogin } from "@/lib/contexts/AutoLoginContext";

// Mapeamento de ícones por slug/nome de categoria
const categoryIconMap: Record<string, LucideIcon> = {
    gaming: Gamepad2,
    anime: Tv,
    rpg: Dices,
    "rpg-de-mesa": Dices,
    hardware: Cpu,
    reviews: Star,
    eventos: Calendar,
};

interface CategoryWithIcon {
    id: string;
    name: string;
    color: string;
    icon: LucideIcon;
}

interface ArticleCardData {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    media?: MediaModel;
    categoryName: string;
    categoryColor: string;
    categoryId: string;
    publishedAt: string;
    readingTime: number;
}

export default function ArtigosPage() {
    const { isReady: isLoginReady } = useAutoLogin();

    // Data states
    const [articles, setArticles] = useState<ArticleModel[]>([]);
    const [dbCategories, setDbCategories] = useState<CategoryModel[]>([]);
    const [mediaMap, setMediaMap] = useState<Record<string, MediaModel>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI states
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Buscar dados do banco
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [articlesData, categoriesData] = await Promise.all([
                ArticlesController.getPublished(),
                CategoriesController.getAll(),
            ]);

            setArticles(articlesData);
            setDbCategories(categoriesData);

            // Carregar media das capas
            const coverIds = articlesData
                .map(a => a.coverMediaId)
                .filter((id): id is string => !!id);

            if (coverIds.length > 0) {
                const mediaItems = await MediaController.getByIds(coverIds);
                const map: Record<string, MediaModel> = {};
                mediaItems.forEach(m => { map[m._id] = m; });
                setMediaMap(map);
            }

            setError(null);
        } catch (err) {
            setError("Falha ao carregar artigos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch inicial - aguarda login estar pronto
    useEffect(() => {
        if (isLoginReady) {
            fetchData();
        }
    }, [isLoginReady, fetchData]);

    // Categorias formatadas para exibição (com ícones)
    const categories: CategoryWithIcon[] = useMemo(() => {
        const allCategory: CategoryWithIcon = { id: "all", name: "Todos", color: "#6e5fa6", icon: LayoutGrid };
        const mappedCategories: CategoryWithIcon[] = dbCategories.map(cat => {
            // Gerar slug a partir do nome para buscar ícone
            const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
            return {
                id: cat._id,
                name: cat.name,
                color: cat.color || "#6e5fa6",
                icon: categoryIconMap[slug] || LayoutGrid,
            };
        });
        return [allCategory, ...mappedCategories];
    }, [dbCategories]);

    const visibleCategories = categories.slice(0, 4);
    const hiddenCategories = categories.slice(4);

    // Obter dados de categoria
    const getCategoryData = useCallback((categoryId?: string) => {
        const cat = dbCategories.find(c => c._id === categoryId);
        return {
            name: cat?.name || "Sem categoria",
            color: cat?.color || "#6e5fa6"
        };
    }, [dbCategories]);

    // Mapear artigos para o formato do card
    const mappedArticles: ArticleCardData[] = useMemo(() => {
        return articles.map(article => {
            const catData = getCategoryData(article.categoryId);
            const media = article.coverMediaId ? mediaMap[article.coverMediaId] : undefined;
            return {
                _id: article._id,
                title: article.title,
                slug: article.slug,
                excerpt: article.getExcerpt(150),
                media,
                categoryName: catData.name,
                categoryColor: catData.color,
                categoryId: article.categoryId || "",
                publishedAt: article.publishedAt || "",
                readingTime: article.readingTime || 5,
            };
        });
    }, [articles, getCategoryData, mediaMap]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowMoreCategories(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const filteredArticles = mappedArticles.filter((article) => {
        const matchesCategory =
            selectedCategory === "all" || article.categoryId === selectedCategory;
        const matchesSearch =
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen">
            {/* Header - contínuo com navbar */}
            <section className="bg-nerdcave-dark px-4 sm:px-6 pt-28 pb-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-nerdcave-light outfit outfit-700 mb-3">
                        Artigos
                    </h1>
                    <p className="text-nerdcave-light/60 outfit outfit-400 max-w-xl">
                        Conteúdo sobre games, tecnologia e cultura geek.
                    </p>
                </div>
            </section>

            {/* Filters - contínuo com header */}
            <section className={`bg-nerdcave-dark px-4 sm:px-6 py-4 sticky z-40 transition-all duration-300 ${isScrolled ? "top-[72px]" : "top-24"
                }`}>
                <div className="max-w-6xl mx-auto flex items-center gap-1">
                    {isSearchOpen ? (
                        /* Search Input Expanded */
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nerdcave-light/50" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar artigos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-nerdcave-light/10 border border-nerdcave-light/20 text-nerdcave-light placeholder:text-nerdcave-light/40 focus:outline-none focus:border-nerdcave-lime transition-colors outfit outfit-400"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery("");
                                }}
                                className="h-11 w-11 rounded-lg border border-nerdcave-light/20 bg-nerdcave-light/10 text-nerdcave-light hover:border-nerdcave-lime/50 transition-colors cursor-pointer flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        /* Categories + Search Button + View Mode Toggle */
                        <>
                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="h-11 w-11 rounded-lg border border-nerdcave-light/20 bg-nerdcave-light/10 text-nerdcave-light hover:border-nerdcave-lime/50 transition-colors cursor-pointer flex items-center justify-center"
                            >
                                <Search className="w-4 h-4" />
                            </button>

                            {/* Categories + View Mode Toggle */}
                            <div className="flex items-center gap-1 flex-1">
                                <div className="flex items-center gap-1">
                                    {visibleCategories.map((category) => (
                                        <CategoryButton
                                            key={category.id}
                                            id={category.id}
                                            name={category.name}
                                            icon={category.icon}
                                            isSelected={selectedCategory === category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                        />
                                    ))}

                                    {/* More Categories Dropdown */}
                                    {hiddenCategories.length > 0 && (
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={() => setShowMoreCategories(!showMoreCategories)}
                                                className={`h-11 w-11 lg:w-auto lg:px-4 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors outfit outfit-500 cursor-pointer flex items-center justify-center gap-2 ${hiddenCategories.some(c => c.id === selectedCategory)
                                                    ? "bg-nerdcave-lime border-nerdcave-lime text-nerdcave-dark"
                                                    : "bg-nerdcave-light/10 border-nerdcave-light/20 text-nerdcave-light hover:border-nerdcave-lime/50"
                                                    }`}
                                            >
                                                <ChevronDown className={`w-4 h-4 transition-transform ${showMoreCategories ? "rotate-180" : ""}`} />
                                                <span className="hidden lg:inline">Mais</span>
                                            </button>

                                            {showMoreCategories && (
                                                <div className="absolute top-full left-0 mt-2 bg-nerdcave-dark border border-nerdcave-light/20 rounded-lg shadow-lg z-50 min-w-40">
                                                    {hiddenCategories.map((category) => {
                                                        const Icon = category.icon;
                                                        return (
                                                            <button
                                                                key={category.id}
                                                                onClick={() => {
                                                                    setSelectedCategory(category.id);
                                                                    setShowMoreCategories(false);
                                                                }}
                                                                className={`w-full px-4 py-2.5 text-left text-sm font-medium outfit outfit-500 transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${selectedCategory === category.id
                                                                    ? "bg-nerdcave-lime text-nerdcave-dark"
                                                                    : "text-nerdcave-light hover:bg-nerdcave-light/10"
                                                                    }`}
                                                            >
                                                                <Icon className="w-4 h-4" />
                                                                {category.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* View Mode Toggle */}
                                <div className="ml-auto">
                                    <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Articles Grid/List */}
            <section className="px-4 sm:px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-nerdcave-lime animate-spin mb-4" />
                            <p className="text-muted-foreground outfit outfit-400">
                                Carregando artigos...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <X className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-foreground outfit outfit-600 mb-1">Erro ao carregar</p>
                            <p className="text-muted-foreground text-sm outfit outfit-400 mb-4">{error}</p>
                            <button
                                onClick={fetchData}
                                className="px-4 py-2 bg-nerdcave-lime text-nerdcave-dark rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : filteredArticles.length > 0 ? (
                        <>
                            <p className="text-muted-foreground text-sm outfit outfit-400 mb-6">
                                {filteredArticles.length} resultado{filteredArticles.length !== 1 ? "s" : ""}
                            </p>
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredArticles.map((article) => (
                                        <ArticleCardWithLoader key={article._id} {...article} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {filteredArticles.map((article) => (
                                        <ArticleCardWithLoader key={article._id} {...article} variant="horizontal" />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-foreground outfit outfit-600 mb-1">
                                Nenhum artigo encontrado
                            </p>
                            <p className="text-muted-foreground text-sm outfit outfit-400">
                                Tente ajustar os filtros ou termos de busca.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
