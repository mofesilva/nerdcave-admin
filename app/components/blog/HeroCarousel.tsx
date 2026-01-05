"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroArticle {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverUrl?: string;
    categoryName?: string;
}

interface HeroCarouselProps {
    articles: HeroArticle[];
}

export function HeroCarousel({ articles }: HeroCarouselProps) {
    // For infinite loop, we add clones: [last, ...articles, first]
    // So index 0 = clone of last, index 1 = first real, etc.
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    // Create extended array with clones for infinite loop
    const extendedArticles =
        articles.length > 0
            ? [articles[articles.length - 1], ...articles, articles[0]]
            : [];

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isTransitioning]);

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const goToSlide = (index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index + 1); // +1 because of the clone at the start
        setIsAutoPlaying(false);
    };

    // Handle the infinite loop jump
    useEffect(() => {
        if (!isTransitioning) return;

        const timer = setTimeout(() => {
            setIsTransitioning(false);

            // If we're at the clone of the first slide (end), jump to real first
            if (currentIndex === extendedArticles.length - 1) {
                if (trackRef.current) {
                    trackRef.current.style.transition = "none";
                }
                setCurrentIndex(1);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (trackRef.current) {
                            trackRef.current.style.transition =
                                "transform 700ms ease-in-out";
                        }
                    });
                });
            }
            // If we're at the clone of the last slide (start), jump to real last
            else if (currentIndex === 0) {
                if (trackRef.current) {
                    trackRef.current.style.transition = "none";
                }
                setCurrentIndex(extendedArticles.length - 2);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (trackRef.current) {
                            trackRef.current.style.transition =
                                "transform 700ms ease-in-out";
                        }
                    });
                });
            }
        }, 700);

        return () => clearTimeout(timer);
    }, [currentIndex, isTransitioning, extendedArticles.length]);

    useEffect(() => {
        if (!isAutoPlaying || articles.length <= 1) return;

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, articles.length, nextSlide]);

    if (articles.length === 0) {
        return (
            <div className="relative w-full h-[75vh] min-h-[780px] bg-nerdcave-dark flex items-center justify-center">
                <p className="text-nerdcave-light/60 outfit outfit-400">
                    Nenhum artigo em destaque
                </p>
            </div>
        );
    }

    // Get real index for dots (0-based, excluding clones)
    const getRealIndex = () => {
        if (currentIndex === 0) return articles.length - 1;
        if (currentIndex === extendedArticles.length - 1) return 0;
        return currentIndex - 1;
    };

    return (
        <div
            className="relative w-full h-[75vh] min-h-[780px] overflow-hidden group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Slides Track */}
            <div
                ref={trackRef}
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {extendedArticles.map((article, index) => (
                    <div
                        key={`${article._id}-${index}`}
                        className="relative w-full h-full flex-shrink-0"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            {article.coverUrl ? (
                                <Image
                                    src={article.coverUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    priority={index <= 2}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-nerdcave-purple via-nerdcave-dark to-nerdcave-dark" />
                            )}
                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-nerdcave-dark via-nerdcave-dark/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-nerdcave-dark/80 via-transparent to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-32 px-4 sm:px-6">
                            <div className="max-w-6xl mx-auto w-full">
                                {article.categoryName && (
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-nerdcave-lime text-nerdcave-dark text-xs font-semibold outfit outfit-600 w-fit mb-4">
                                        {article.categoryName}
                                    </span>
                                )}
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-nerdcave-light outfit outfit-700 mb-6 max-w-4xl">
                                    {article.title}
                                </h2>
                                {article.excerpt && (
                                    <p className="text-nerdcave-light/80 text-base md:text-lg outfit outfit-400 line-clamp-2 max-w-2xl mb-8">
                                        {article.excerpt}
                                    </p>
                                )}
                                <Link
                                    href={`/artigos/${article.slug}`}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-nerdcave-purple hover:bg-nerdcave-purple/80 text-nerdcave-light rounded-lg font-medium transition-all outfit outfit-500 w-fit group/btn text-base"
                                >
                                    Ler Artigo
                                    <svg
                                        className="w-5 h-5 transition-transform group-hover/btn:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {articles.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-nerdcave-dark/50 backdrop-blur-sm text-nerdcave-light hover:bg-nerdcave-purple transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center border border-nerdcave-light/20"
                        aria-label="Anterior"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-nerdcave-dark/50 backdrop-blur-sm text-nerdcave-light hover:bg-nerdcave-purple transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center border border-nerdcave-light/20"
                        aria-label="Próximo"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {articles.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    {articles.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 ${getRealIndex() === index
                                    ? "w-8 h-2 bg-nerdcave-lime rounded-full"
                                    : "w-2 h-2 bg-nerdcave-light/40 hover:bg-nerdcave-light/60 rounded-full"
                                }`}
                            aria-label={`Ir para slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-nerdcave-light/60 animate-bounce">
                <span className="text-xs outfit outfit-400 rotate-90 origin-center">
                    Scroll
                </span>
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </div>
        </div>
    );
}
