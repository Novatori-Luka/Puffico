"use client";

import { useState, useEffect } from "react";

interface Variant {
  id: string;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  shape?: string | null;
  filling?: string | null;
  stock: number;
  priceAdj?: number | null;
}

interface VariantSelectorProps {
  variants: Variant[];
  basePrice: number;
  onVariantChange?: (variant: Variant | null) => void;
}

export default function VariantSelector({
  variants,
  basePrice,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedFilling, setSelectedFilling] = useState<string | null>(null);

  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[];
  const colors = Array.from(new Map(variants.filter((v) => v.color).map((v) => [v.color, v])).values());
  const shapes = Array.from(new Set(variants.map((v) => v.shape).filter(Boolean))) as string[];
  const fillings = Array.from(new Set(variants.map((v) => v.filling).filter(Boolean))) as string[];

  const matched = variants.find(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor) &&
      (!selectedShape || v.shape === selectedShape) &&
      (!selectedFilling || v.filling === selectedFilling)
  );

  const effectivePrice = matched?.priceAdj
    ? basePrice + (matched.priceAdj as number)
    : basePrice;

  useEffect(() => {
    onVariantChange?.(matched ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  return (
    <div className="space-y-4">
      {/* Size */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-puff-dark">ზომა</label>
            {selectedSize && (
              <span className="text-xs text-puff-muted">
                {selectedSize === "S" && "60×60 სმ"}
                {selectedSize === "M" && "80×80 სმ"}
                {selectedSize === "L" && "100×100 სმ"}
                {selectedSize === "XL" && "120×120 სმ"}
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(selectedSize === s ? null : s)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedSize === s
                    ? "bg-earth-400 text-white border-earth-400"
                    : "border-sand-200 text-puff-dark hover:border-earth-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color swatches */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-puff-dark">ფერი / ქსოვილი</label>
            {selectedColor && (
              <span className="text-xs text-puff-muted">{selectedColor}</span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {colors.map((v) => (
              <button
                key={v.color}
                title={v.color ?? ""}
                onClick={() => setSelectedColor(selectedColor === v.color ? null : v.color!)}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedColor === v.color
                    ? "border-earth-400 scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: v.colorHex ?? "#d1be96" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Shape */}
      {shapes.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-puff-dark block mb-2">ფორმა</label>
          <div className="flex gap-2 flex-wrap">
            {shapes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedShape(selectedShape === s ? null : s)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedShape === s
                    ? "bg-earth-400 text-white border-earth-400"
                    : "border-sand-200 text-puff-dark hover:border-earth-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filling */}
      {fillings.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-puff-dark block mb-2">შიგთავსი</label>
          <div className="flex gap-2 flex-wrap">
            {fillings.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilling(selectedFilling === f ? null : f)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedFilling === f
                    ? "bg-earth-400 text-white border-earth-400"
                    : "border-sand-200 text-puff-dark hover:border-earth-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price update */}
      {matched?.priceAdj && (
        <p className="text-sm text-puff-muted">
          ეს ვარიაცია: <span className="font-semibold text-puff-dark">₾{effectivePrice}</span>
        </p>
      )}

      {/* Stock warning */}
      {matched && matched.stock <= 3 && matched.stock > 0 && (
        <p className="text-xs text-terracotta-500">
          ⚠️ მხოლოდ {matched.stock} ცალი დარჩა
        </p>
      )}
      {matched && matched.stock === 0 && (
        <p className="text-xs text-red-500 font-medium">გაყიდულია</p>
      )}
    </div>
  );
}
