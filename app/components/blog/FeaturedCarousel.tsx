"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl?: string;
  categoryName?: string;
}

interface FeaturedCarouselProps {
  articles: FeaturedArticle[];
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, articles.length, nextSlide]);

  if (articles.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] bg-nerdcave-dark rounded-2xl flex items-center justify-center">
        <p className="text-nerdcave-light/60 outfit outfit-400">Nenhum artigo em destaque</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {articles.map((article, index) => (
        <div
          key={article._id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex
            ? "opacity-100 translate-x-0"
            : index < currentIndex
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
            }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            {article.coverUrl ? (
              <Image
                src={article.coverUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            ) : (
              <div className="w-full h-full bg-nerdcave-purple" />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-nerdcave-dark/70" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            {article.categoryName && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-nerdcave-lime text-nerdcave-dark text-xs font-semibold outfit outfit-600 w-fit mb-3">
                {article.categoryName}
              </span>
            )}
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-nerdcave-light outfit outfit-700 mb-3 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-nerdcave-light/70 text-sm md:text-base outfit outfit-400 line-clamp-2 max-w-2xl mb-6">
              {article.excerpt}
            </p>
            <Link
              href={`/artigos/${article.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-nerdcave-purple hover:bg-nerdcave-purple/80 text-nerdcave-light rounded-lg font-medium transition-all outfit outfit-500 w-fit group/btn"
            >
              Ler Artigo
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
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
      ))}

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-nerdcave-dark/50 backdrop-blur-sm text-nerdcave-light hover:bg-nerdcave-purple transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-nerdcave-dark/50 backdrop-blur-sm text-nerdcave-light hover:bg-nerdcave-purple transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
            aria-label="Próximo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${index === currentIndex
                ? "w-8 h-2 bg-nerdcave-lime"
                : "w-2 h-2 bg-nerdcave-light/40 hover:bg-nerdcave-light/60"
                }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
