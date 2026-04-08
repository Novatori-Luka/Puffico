"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV = [
  { label: "კატალოგი", href: "/catalog" },
  { label: "გალერეა", href: "/gallery" },
  { label: "ბლოგი", href: "/blog" },
  { label: "ჩვენს შესახებ", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-puff-white/95 backdrop-blur-md border-b border-sand-100">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-display font-bold text-xl text-puff-dark tracking-tight">
            Puffico
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-puff-muted hover:text-puff-dark transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-puff-muted hover:text-puff-dark hover:bg-cream-100 transition-colors"
              aria-label="კალათა"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-terracotta-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-puff-muted hover:text-puff-dark hover:bg-cream-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="მენიუ"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-sand-100 bg-puff-white animate-slide-up">
          <nav className="section-container py-4 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-puff-dark hover:bg-cream-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
