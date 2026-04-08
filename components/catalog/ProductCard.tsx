"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string | null;
  basePrice: number;
  salePrice?: number | null;
  images: { url: string; alt?: string | null; isPrimary: boolean }[];
  variants: { size?: string | null; color?: string | null; colorHex?: string | null }[];
}

const PLACEHOLDER = "/images/placeholder-pouf.jpg";

export default function ProductCard({
  id,
  name,
  slug,
  shortDesc,
  basePrice,
  salePrice,
  images,
  variants,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();

  const primaryImg = images.find((i) => i.isPrimary)?.url ?? images[0]?.url ?? PLACEHOLDER;
  const secondImg = images[1]?.url ?? primaryImg;

  const uniqueColors = Array.from(
    new Map(
      variants
        .filter((v) => v.colorHex)
        .map((v) => [v.colorHex, v])
    ).values()
  ).slice(0, 5);

  const discount = salePrice
    ? Math.round(((basePrice - salePrice) / basePrice) * 100)
    : null;

  return (
    <article className="group">
      <Link href={`/catalog/${slug}`}>
        {/* Image container */}
        <div
          className="relative overflow-hidden rounded-2xl bg-sand-50 aspect-square mb-3"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Primary image */}
          <Image
            src={primaryImg}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 ${
              hovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
          />
          {/* Hover image */}
          <Image
            src={secondImg}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 ${
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="badge bg-terracotta-400 text-white text-xs font-semibold">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className={`absolute bottom-3 inset-x-3 transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}>
            <button
              className="w-full btn-primary py-2 text-sm shadow-lifted"
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  productId: id,
                  variantId: null,
                  name,
                  slug,
                  image: primaryImg,
                  price: salePrice ?? basePrice,
                  quantity: 1,
                  variant: null,
                });
              }}
            >
              <ShoppingBag size={15} />
              კალათაში დამატება
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="space-y-1.5">
        {/* Name */}
        <Link href={`/catalog/${slug}`} className="group/link">
          <h3 className="font-semibold text-puff-dark group-hover/link:text-earth-500 transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        {/* Short desc */}
        {shortDesc && (
          <p className="text-sm text-puff-muted line-clamp-1">{shortDesc}</p>
        )}

        {/* Color swatches */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {uniqueColors.map((v) => (
              <span
                key={v.colorHex}
                title={v.color ?? ""}
                className="w-4 h-4 rounded-full border border-sand-200 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: v.colorHex ?? "#d1be96" }}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="font-bold text-terracotta-500">₾{salePrice}</span>
              <span className="text-puff-muted line-through text-sm">₾{basePrice}</span>
            </>
          ) : (
            <span className="font-bold text-puff-dark">₾{basePrice}</span>
          )}
        </div>
      </div>
    </article>
  );
}
