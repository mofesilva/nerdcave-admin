"use client";

import { FeaturedCarousel } from "../components/blog/FeaturedCarousel";
import { ArticleCard } from "../components/blog/ArticleCard";
import { AlbumCard } from "../components/blog/AlbumCard";
import { SectionHeader } from "../components/blog/SectionHeader";

// Mock data para demonstração - será substituído pela integração com Cappuccino
const featuredArticles = [
    {
        _id: "1",
        title: "O Guia Definitivo para Montar seu Setup Gamer em 2024",
        slug: "guia-setup-gamer-2024",
        excerpt: "Descubra como montar o setup perfeito para gaming com as melhores dicas de hardware, periféricos e organização.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        categoryName: "Gaming",
    },
    {
        _id: "2",
        title: "Análise: Os Melhores Jogos de RPG do Ano",
        slug: "melhores-rpg-2024",
        excerpt: "Uma análise completa dos RPGs que dominaram o ano, desde clássicos remasterizados até novidades surpreendentes.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        categoryName: "Reviews",
    },
    {
        _id: "3",
        title: "Nerdcave na CCXP 2024: Tudo que Vimos",
        slug: "nerdcave-ccxp-2024",
        excerpt: "Cobertura completa da maior convenção de cultura pop do mundo. Confira os melhores momentos!",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        categoryName: "Eventos",
    },
];

const recentArticles = [
    {
        _id: "4",
        title: "10 Easter Eggs que Você Perdeu em GTA VI",
        slug: "easter-eggs-gta-vi",
        excerpt: "Rockstar escondeu dezenas de referências no trailer. Veja as mais surpreendentes que encontramos.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        categoryName: "Gaming",
        categoryColor: "#abca4a",
        publishedAt: "2024-12-15",
        readingTime: 8,
    },
    {
        _id: "5",
        title: "Por Que Dungeons & Dragons Nunca Foi Tão Popular",
        slug: "dungeons-dragons-popular",
        excerpt: "O renascimento do RPG de mesa e como a cultura pop abraçou o hobby.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        categoryName: "RPG de Mesa",
        categoryColor: "#6e5fa6",
        publishedAt: "2024-12-14",
        readingTime: 12,
    },
    {
        _id: "6",
        title: "Anime Spotlight: As Jóias de Outono 2024",
        slug: "anime-spotlight-outono-2024",
        excerpt: "Os animes que você precisa acompanhar nesta temporada.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        categoryName: "Anime",
        categoryColor: "#e91e63",
        publishedAt: "2024-12-13",
        readingTime: 6,
    },
    {
        _id: "7",
        title: "Build PC Custo-Benefício para 2025",
        slug: "build-pc-custo-beneficio-2025",
        excerpt: "Monte um PC gamer sem gastar uma fortuna. Guia completo de componentes.",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        categoryName: "Hardware",
        categoryColor: "#00bcd4",
        publishedAt: "2024-12-12",
        readingTime: 15,
    },
];

const recentAlbums = [
    {
        _id: "1",
        title: "CCXP 2024 - Dia 1",
        slug: "ccxp-2024-dia-1",
        description: "Os melhores cosplays e painéis do primeiro dia",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 48,
    },
    {
        _id: "2",
        title: "Setup Tour: Dezembro",
        slug: "setup-tour-dezembro",
        description: "Setups enviados pela comunidade",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 24,
    },
    {
        _id: "3",
        title: "Unboxing: Coleção Marvel",
        slug: "unboxing-colecao-marvel",
        description: "As últimas aquisições da coleção",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 16,
    },
    {
        _id: "4",
        title: "Meetup Nerdcave SP",
        slug: "meetup-nerdcave-sp",
        description: "Encontro da comunidade em São Paulo",
        coverUrl: "/images/background/nerdcave-background-dark-blue.png",
        photoCount: 32,
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen pt-24">
            {/* Hero Section with Featured Carousel */}
            <section className="px-4 sm:px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <FeaturedCarousel articles={featuredArticles} />
                </div>
            </section>

            {/* Recent Articles Section */}
            <section className="px-4 sm:px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader
                        title="Artigos Recentes"
                        subtitle="As últimas novidades do mundo nerd"
                        href="/artigos"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentArticles.map((article) => (
                            <ArticleCard key={article._id} {...article} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Preview Section */}
            <section className="px-4 sm:px-6 py-12 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader
                        title="Galeria"
                        subtitle="Fotos e álbuns da comunidade"
                        href="/galeria"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentAlbums.map((album) => (
                            <AlbumCard key={album._id} {...album} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="px-4 sm:px-6 py-16 bg-nerdcave-dark">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-nerdcave-light outfit outfit-700 mb-4">
                        Fique por Dentro
                    </h2>
                    <p className="text-nerdcave-light/70 outfit outfit-400 mb-8 max-w-xl mx-auto">
                        Receba as últimas novidades, artigos exclusivos e conteúdos especiais diretamente no seu email.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="flex-1 px-5 py-3 rounded-lg bg-nerdcave-light/10 border border-nerdcave-light/20 text-nerdcave-light placeholder:text-nerdcave-light/40 focus:outline-none focus:border-nerdcave-lime transition-colors outfit outfit-400"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-lg bg-nerdcave-lime text-nerdcave-dark font-semibold outfit outfit-600 hover:bg-nerdcave-lime/90 transition-colors"
                        >
                            Inscrever
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
