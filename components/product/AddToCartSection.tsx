"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import VariantSelector from "./VariantSelector";
import { useCart } from "@/context/CartContext";

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

interface Props {
  productId: string;
  name: string;
  slug: string;
  image: string;
  basePrice: number;
  variants: Variant[];
}

export default function AddToCartSection({
  productId,
  name,
  slug,
  image,
  basePrice,
  variants,
}: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [added, setAdded] = useState(false);

  const price = selectedVariant?.priceAdj
    ? basePrice + (selectedVariant.priceAdj as number)
    : basePrice;

  function handleAdd() {
    addItem({
      productId,
      variantId: selectedVariant?.id ?? null,
      name,
      slug,
      image,
      price,
      quantity: 1,
      variant: selectedVariant
        ? {
            size: selectedVariant.size,
            color: selectedVariant.color,
            colorHex: selectedVariant.colorHex,
            shape: selectedVariant.shape,
            filling: selectedVariant.filling,
          }
        : null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem({
      productId,
      variantId: selectedVariant?.id ?? null,
      name,
      slug,
      image,
      price,
      quantity: 1,
      variant: selectedVariant
        ? {
            size: selectedVariant.size,
            color: selectedVariant.color,
            colorHex: selectedVariant.colorHex,
            shape: selectedVariant.shape,
            filling: selectedVariant.filling,
          }
        : null,
    });
    router.push("/checkout");
  }

  return (
    <div className="space-y-6">
      {variants.length > 0 && (
        <VariantSelector
          variants={variants}
          basePrice={basePrice}
          onVariantChange={setSelectedVariant}
        />
      )}

      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className={`btn-primary flex-1 py-3.5 text-base transition-all ${
              added ? "!bg-sage-500 !border-sage-500" : ""
            }`}
          >
            <ShoppingBag size={18} />
            {added ? "დამატებულია ✓" : "კალათაში დამატება"}
          </button>
          <button
            onClick={handleBuyNow}
            className="btn-secondary py-3.5 px-6 text-base"
          >
            <Zap size={18} />
            ახლავე შეკვეთა
          </button>
        </div>
      </div>
    </div>
  );
}
