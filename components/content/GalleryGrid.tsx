"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface GalleryItem {
  id: string;
  url: string;
  alt?: string | null;
  category: string;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
}

export default function GalleryGrid({ images }: { images: GalleryItem[] }) {
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

  const active = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      {/* Masonry-style grid */}
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {images.map((item, i) => (
          <div
            key={item.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl bg-sand-50"
            onClick={() => setLightboxIndex(i)}
          >
            {isVideo(item.url) ? (
              <>
                <video
                  src={item.url}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  muted
                  preload="metadata"
                  style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/3" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/40 rounded-full p-3 group-hover:bg-black/60 transition-colors">
                    <Play size={22} className="text-white fill-white" />
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={item.url}
                alt={item.alt ?? ""}
                width={600}
                height={i % 3 === 0 ? 700 : 450}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-puff-dark/0 group-hover:bg-puff-dark/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={24} />
          </button>

          <button
            className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(active.url) ? (
              <video
                key={active.url}
                src={active.url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-xl"
              />
            ) : (
              <Image
                src={active.url}
                alt={active.alt ?? ""}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            )}
          </div>

          <button
            className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 left-0 right-0 text-center">
            {active.alt && (
              <p className="text-white/70 text-sm mb-1">{active.alt}</p>
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
