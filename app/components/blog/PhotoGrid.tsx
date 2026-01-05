"use client";

import Image from "next/image";

interface PhotoGridProps {
  photos: {
    _id: string;
    url: string;
    title?: string;
    altText?: string;
  }[];
  onPhotoClick?: (index: number) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-16 h-16 text-muted-foreground/30 mb-4"
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
        <p className="text-muted-foreground outfit outfit-400">
          Nenhuma foto neste álbum
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {photos.map((photo, index) => (
        <button
          key={photo._id}
          onClick={() => onPhotoClick?.(index)}
          className="group relative aspect-square rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-nerdcave-purple focus:ring-offset-2"
        >
          <Image
            src={photo.url}
            alt={photo.altText || photo.title || `Foto ${index + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-nerdcave-dark/0 group-hover:bg-nerdcave-dark/30 transition-colors duration-300 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
}
