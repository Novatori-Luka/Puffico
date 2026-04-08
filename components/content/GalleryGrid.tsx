"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt?: string | null;
  category: string;
}

interface Props {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function prev() {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  function next() {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") setLightboxIndex(null);
  }

  return (
    <>
      {/* Masonry-style grid */}
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl bg-sand-50"
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={img.url}
              alt={img.alt ?? ""}
              width={600}
              height={i % 3 === 0 ? 700 : 450}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-puff-dark/0 group-hover:bg-puff-dark/20 transition-colors duration-300 flex items-end">
              {img.alt && (
                <p className="text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.alt}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={24} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={32} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt ?? ""}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={32} />
          </button>

          {/* Caption + counter */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            {images[lightboxIndex].alt && (
              <p className="text-white/70 text-sm mb-1">
                {images[lightboxIndex].alt}
              </p>
            )}
            <p className="text-white/40 text-xs">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
