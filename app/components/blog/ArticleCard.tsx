"use client";

import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl?: string;
  categoryName?: string;
  categoryColor?: string;
  publishedAt?: string;
  readingTime?: number;
  variant?: "default" | "horizontal" | "featured";
}

export function ArticleCard({
  title,
  slug,
  excerpt,
  coverUrl,
  categoryName,
  categoryColor,
  publishedAt,
  readingTime,
  variant = "default",
}: ArticleCardProps) {
  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  };

  if (variant === "horizontal") {
    return (
      <Link
        href={`/artigos/${slug}`}
        className="group flex flex-col sm:flex-row bg-card rounded-xl overflow-hidden border border-border hover:border-nerdcave-purple/50 transition-all duration-300"
      >
        {/* Cover Image */}
        <div className="relative w-full sm:w-48 md:w-64 aspect-[16/10] sm:aspect-auto sm:h-40 overflow-hidden flex-shrink-0 bg-nerdcave-dark">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-nerdcave-purple" />
          )}
          {categoryName && (
            <span
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold outfit outfit-600 text-nerdcave-light"
              style={{ backgroundColor: categoryColor || "#6e5fa6" }}
            >
              {categoryName}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 justify-center">
          <h3 className="text-card-foreground font-bold outfit outfit-700 line-clamp-2 group-hover:text-nerdcave-lime transition-colors mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm outfit outfit-400 line-clamp-2 mb-3">
            {excerpt}
          </p>
          <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground outfit outfit-400">
            {publishedAt && <span>{formatDate(publishedAt)}</span>}
            {readingTime && (
              <>
                <span>•</span>
                <span>{readingTime} min de leitura</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/artigos/${slug}`}
      className="group flex flex-col bg-card rounded-xl overflow-hidden border border-border hover:border-nerdcave-purple/50 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-nerdcave-dark">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            quality={85}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-nerdcave-purple" />
        )}
        {categoryName && (
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold outfit outfit-600 text-nerdcave-light"
            style={{ backgroundColor: categoryColor || "#6e5fa6" }}
          >
            {categoryName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-card-foreground font-bold outfit outfit-700 line-clamp-2 group-hover:text-nerdcave-lime transition-colors mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm outfit outfit-400 line-clamp-2 mb-3">
          {excerpt}
        </p>
        <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground outfit outfit-400">
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
          {readingTime && (
            <>
              <span>•</span>
              <span>{readingTime} min</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
