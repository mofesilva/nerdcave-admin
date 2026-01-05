"use client";

import Image from "next/image";
import Link from "next/link";

interface AlbumCardProps {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  photoCount: number;
}

export function AlbumCard({
  title,
  slug,
  description,
  coverUrl,
  photoCount,
}: AlbumCardProps) {
  return (
    <Link
      href={`/galeria/${slug}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border hover:border-nerdcave-purple/50 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-nerdcave-dark">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-nerdcave-purple flex items-center justify-center">
            <svg
              className="w-12 h-12 text-nerdcave-light/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-nerdcave-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-nerdcave-lime font-semibold outfit outfit-600">Ver álbum</span>
        </div>

        {/* Photo Count Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-nerdcave-dark/80 backdrop-blur-sm text-nerdcave-light text-xs font-medium outfit outfit-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {photoCount}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-card-foreground font-bold outfit outfit-700 line-clamp-1 group-hover:text-nerdcave-lime transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm outfit outfit-400 line-clamp-2 mt-1">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
