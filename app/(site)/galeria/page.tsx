"use client";

import { useState } from "react";
import { AlbumCard } from "../../components/blog/AlbumCard";

// Mock data - será substituído pela integração com Cappuccino
const categories = [
    { id: "all", name: "Todos" },
    { id: "eventos", name: "Eventos" },
    { id: "setups", name: "Setups" },
    { id: "colecoes", name: "Coleções" },
    { id: "meetups", name: "Meetups" },
    { id: "unboxing", name: "Unboxing" },
];

const allAlbums = [
    {
        _id: "1",
        title: "CCXP 2024 - Dia 1",
        slug: "ccxp-2024-dia-1",
        description: "Os melhores cosplays e painéis do primeiro dia da maior convenção de cultura pop do Brasil.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 48,
        categoryId: "eventos",
    },
    {
        _id: "2",
        title: "CCXP 2024 - Dia 2",
        slug: "ccxp-2024-dia-2",
        description: "Mais cosplays incríveis e painéis emocionantes.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 52,
        categoryId: "eventos",
    },
    {
        _id: "3",
        title: "Setup Tour: Dezembro 2024",
        slug: "setup-tour-dezembro-2024",
        description: "Os melhores setups enviados pela comunidade neste mês.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 24,
        categoryId: "setups",
    },
    {
        _id: "4",
        title: "Setup Tour: Novembro 2024",
        slug: "setup-tour-novembro-2024",
        description: "Setups incríveis da comunidade Nerdcave.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 18,
        categoryId: "setups",
    },
    {
        _id: "5",
        title: "Coleção Marvel: Action Figures",
        slug: "colecao-marvel-action-figures",
        description: "Nossa coleção completa de action figures Marvel.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 32,
        categoryId: "colecoes",
    },
    {
        _id: "6",
        title: "Coleção Star Wars",
        slug: "colecao-star-wars",
        description: "Colecionáveis de Star Wars da galáxia muito, muito distante.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 28,
        categoryId: "colecoes",
    },
    {
        _id: "7",
        title: "Meetup Nerdcave SP - Dezembro",
        slug: "meetup-nerdcave-sp-dezembro",
        description: "Encontro da comunidade em São Paulo.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 45,
        categoryId: "meetups",
    },
    {
        _id: "8",
        title: "Unboxing: PlayStation 5 Pro",
        slug: "unboxing-ps5-pro",
        description: "Unboxing completo do novo console da Sony.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 16,
        categoryId: "unboxing",
    },
    {
        _id: "9",
        title: "Unboxing: RTX 4090",
        slug: "unboxing-rtx-4090",
        description: "A placa de vídeo mais poderosa do mercado.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 12,
        categoryId: "unboxing",
    },
];

export default function GaleriaPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredAlbums = allAlbums.filter(
        (album) => selectedCategory === "all" || album.categoryId === selectedCategory
    );

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="px-4 sm:px-6 pt-12 pb-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground outfit outfit-700 mb-3">
                        Galeria
                    </h1>
                    <p className="text-muted-foreground outfit outfit-400 max-w-xl">
                        Fotos de eventos, setups e coleções da comunidade.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="px-4 sm:px-6 py-4 border-y border-border sticky top-16 z-40 bg-background/95 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all outfit outfit-500 ${selectedCategory === category.id
                                        ? "bg-nerdcave-lime text-nerdcave-dark"
                                        : "bg-card border border-border text-foreground hover:border-nerdcave-purple/50"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Albums Grid */}
            <section className="px-4 sm:px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    {filteredAlbums.length > 0 ? (
                        <>
                            <p className="text-muted-foreground text-sm outfit outfit-400 mb-6">
                                {filteredAlbums.length} álbu{filteredAlbums.length !== 1 ? "ns" : "m"}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAlbums.map((album) => (
                                    <AlbumCard key={album._id} {...album} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-foreground outfit outfit-600 mb-1">
                                Nenhum álbum encontrado
                            </p>
                            <p className="text-muted-foreground text-sm outfit outfit-400">
                                Tente ajustar os filtros.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
