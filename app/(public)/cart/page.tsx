"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const PLACEHOLDER = "/images/placeholder-pouf.jpg";

export default function CartPage() {
  const { items, itemCount, total, removeItem, updateQuantity } = useCart();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-puff-white flex flex-col items-center justify-center gap-6 text-center px-4">
        <ShoppingBag size={56} className="text-sand-300" />
        <h1 className="text-2xl font-display font-bold text-puff-dark">
          კალათა ცარიელია
        </h1>
        <p className="text-puff-muted">დაამატეთ პროდუქტი კატალოგიდან</p>
        <Link href="/catalog" className="btn-primary py-3 px-8">
          კატალოგის ნახვა
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puff-white">
      <div className="section-container py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-puff-muted mb-8">
          <Link href="/" className="hover:text-puff-dark transition-colors">
            მთავარი
          </Link>
          <span>/</span>
          <span className="text-puff-dark font-medium">კალათა</span>
        </nav>

        <h1 className="text-3xl font-display font-bold text-puff-dark mb-8">
          კალათა
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex gap-4">
                {/* Thumbnail */}
                <Link href={`/catalog/${item.slug}`} className="shrink-0">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-sand-50">
                    <Image
                      src={item.image || PLACEHOLDER}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/catalog/${item.slug}`}
                    className="font-semibold text-puff-dark hover:text-earth-500 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-puff-muted mt-0.5">
                      {[
                        item.variant.size,
                        item.variant.color,
                        item.variant.shape,
                        item.variant.filling,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  <p className="font-bold text-puff-dark mt-1">₾{item.price}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-sand-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1.5 hover:bg-cream-100 transition-colors disabled:opacity-40"
                        aria-label="შემცირება"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-cream-100 transition-colors"
                        aria-label="გაზრდა"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-puff-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      aria-label="წაშლა"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="shrink-0 text-right self-start pt-1">
                  <span className="font-bold text-puff-dark">
                    ₾{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-bold text-puff-dark text-xl mb-4">
                შეჯამება
              </h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-puff-muted">
                  <span>სულ ({itemCount} ერთ.)</span>
                  <span>₾{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-puff-muted">
                  <span>მიტანა თბილისში</span>
                  <span className="text-sage-500 font-medium">უფასო</span>
                </div>
              </div>
              <div className="border-t border-sand-100 pt-4 mb-5">
                <div className="flex justify-between font-bold text-puff-dark text-lg">
                  <span>სულ</span>
                  <span>₾{total.toFixed(0)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="btn-primary w-full py-3.5 text-base justify-center"
              >
                შეკვეთის გაფორმება
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/catalog"
                className="btn-ghost w-full py-2.5 mt-3 text-sm justify-center"
              >
                შოპინგის გაგრძელება
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
