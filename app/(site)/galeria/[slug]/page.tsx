"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PhotoGrid } from "../../../components/blog/PhotoGrid";
import { Lightbox } from "../../../components/blog/Lightbox";

// Mock data - será substituído pela integração com Cappuccino
const getAlbumBySlug = (slug: string) => {
    const albums: Record<string, {
        _id: string;
        title: string;
        slug: string;
        description: string;
        coverUrl?: string;
        photos: { _id: string; url: string; title?: string; altText?: string }[];
        createdAt: string;
    }> = {
        "ccxp-2024-dia-1": {
            _id: "1",
            title: "CCXP 2024 - Dia 1",
            slug: "ccxp-2024-dia-1",
            description: "Os melhores cosplays e painéis do primeiro dia da maior convenção de cultura pop do Brasil. Confira os destaques que capturamos!",
            coverUrl: "/images/background/nerdcave-background-dark-blue.png",
            createdAt: "2024-12-10",
            photos: [
                { _id: "p1", url: "/images/background/nerdcave-background-dark-blue.png", title: "Cosplay de Homem-Aranha", altText: "Cosplayer vestido de Homem-Aranha" },
                { _id: "p2", url: "/images/background/nerdcave-background-dark-blue.png", title: "Painel Marvel", altText: "Palco do painel da Marvel" },
                { _id: "p3", url: "/images/background/nerdcave-background-dark-blue.png", title: "Estande Nintendo", altText: "Estande da Nintendo na CCXP" },
                { _id: "p4", url: "/images/background/nerdcave-background-dark-blue.png", title: "Cosplay Demon Slayer", altText: "Cosplayer de Tanjiro" },
                { _id: "p5", url: "/images/background/nerdcave-background-dark-blue.png", title: "Artist Alley", altText: "Artistas no Artist Alley" },
                { _id: "p6", url: "/images/background/nerdcave-background-dark-blue.png", title: "Fila do evento", altText: "Público na fila" },
                { _id: "p7", url: "/images/background/nerdcave-background-dark-blue.png", title: "Estande Playstation", altText: "Estande da Sony Playstation" },
                { _id: "p8", url: "/images/background/nerdcave-background-dark-blue.png", title: "Cosplay Grupo", altText: "Grupo de cosplayers" },
                { _id: "p9", url: "/images/background/nerdcave-background-dark-blue.png", title: "Loja de colecionáveis", altText: "Loja vendendo figures" },
                { _id: "p10", url: "/images/background/nerdcave-background-dark-blue.png", title: "Painel Star Wars", altText: "Painel de Star Wars" },
                { _id: "p11", url: "/images/background/nerdcave-background-dark-blue.png", title: "Cosplay Anime", altText: "Cosplay de anime" },
                { _id: "p12", url: "/images/background/nerdcave-background-dark-blue.png", title: "Área de games", altText: "Área de demonstração de jogos" },
            ],
        },
        "setup-tour-dezembro-2024": {
            _id: "3",
            title: "Setup Tour: Dezembro 2024",
            slug: "setup-tour-dezembro-2024",
            description: "Os melhores setups enviados pela comunidade neste mês. Inspiração para todos os níveis!",
            coverUrl: "/images/background/nerdcave-background-dark-blue.png",
            createdAt: "2024-12-15",
            photos: [
                { _id: "s1", url: "/images/background/nerdcave-background-dark-blue.png", title: "Setup Minimalista", altText: "Setup minimalista com monitor ultrawide" },
                { _id: "s2", url: "/images/background/nerdcave-background-dark-blue.png", title: "Setup RGB Full", altText: "Setup com iluminação RGB completa" },
                { _id: "s3", url: "/images/background/nerdcave-background-dark-blue.png", title: "Setup Streaming", altText: "Setup profissional para streaming" },
                { _id: "s4", url: "/images/background/nerdcave-background-dark-blue.png", title: "Setup Clean", altText: "Setup organizado e clean" },
                { _id: "s5", url: "/images/background/nerdcave-background-dark-blue.png", title: "Setup Dual Monitor", altText: "Setup com dois monitores" },
                { _id: "s6", url: "/images/background/nerdcave-background-dark-blue.png", title: "Setup Gamer", altText: "Setup focado em gaming" },
            ],
        },
    };

    return albums[slug] || null;
};

export default function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const album = getAlbumBySlug(slug);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    if (!album) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground outfit outfit-700 mb-4">
                        Álbum não encontrado
                    </h1>
                    <p className="text-muted-foreground outfit outfit-400 mb-8">
                        O álbum que você procura não existe ou foi removido.
                    </p>
                    <Link
                        href="/galeria"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-nerdcave-purple text-white rounded-full font-medium outfit outfit-500 hover:bg-nerdcave-purple/90 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar à Galeria
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handlePhotoClick = (index: number) => {
        setCurrentPhotoIndex(index);
        setLightboxOpen(true);
    };

    const handlePrevious = () => {
        setCurrentPhotoIndex((prev) =>
            prev === 0 ? album.photos.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentPhotoIndex((prev) =>
            prev === album.photos.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative h-[40vh] md:h-[50vh]">
                {album.coverUrl ? (
                    <Image
                        src={album.coverUrl}
                        alt={album.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-nerdcave-purple" />
                )}
                <div className="absolute inset-0 bg-background/70" />

                {/* Back Button */}
                <Link
                    href="/galeria"
                    className="absolute top-4 left-4 md:top-8 md:left-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nerdcave-dark/50 backdrop-blur-sm text-nerdcave-light hover:bg-nerdcave-dark/70 transition-colors outfit outfit-500"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Galeria
                </Link>
            </section>

            {/* Album Info */}
            <section className="px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-card-foreground outfit outfit-700 mb-2">
                                    {album.title}
                                </h1>
                                <p className="text-muted-foreground outfit outfit-400 max-w-2xl">
                                    {album.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground outfit outfit-400">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {album.photos.length} fotos
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(album.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Grid */}
            <section className="px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    <PhotoGrid photos={album.photos} onPhotoClick={handlePhotoClick} />
                </div>
            </section>

            {/* Lightbox */}
            <Lightbox
                photos={album.photos}
                currentIndex={currentPhotoIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onPrevious={handlePrevious}
                onNext={handleNext}
            />
        </div>
    );
}
