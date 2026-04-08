"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";

const SIZES = ["S", "M", "L", "XL"];
const SHAPES = ["მრგვალი", "კვადრატი", "სხვა"];
const FILLINGS = ["ბუნებრივი", "სინთეტიკური"];
const CATEGORIES = ["Standard", "Premium", "Luxury"];
const SORT_OPTIONS = [
  { value: "newest", label: "სიახლე" },
  { value: "price_asc", label: "ფასი: ↑" },
  { value: "price_desc", label: "ფასი: ↓" },
  { value: "featured", label: "Featured" },
];

export default function CatalogFilters({ totalCount }: { totalCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getParam = (key: string) => searchParams.get(key) ?? "";

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.push(pathname);

  const hasFilters = ["size", "shape", "filling", "category", "sort"].some(
    (k) => searchParams.has(k)
  );

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-puff-dark mb-2">დალაგება</h3>
        <select
          value={getParam("sort")}
          onChange={(e) => setFilter("sort", e.target.value)}
          className="input-field text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-puff-dark mb-2">კატეგორია</h3>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" value=""
              checked={!getParam("category")}
              onChange={() => setFilter("category", "")}
              className="accent-earth-400" />
            <span className="text-sm text-puff-dark">ყველა</span>
          </label>
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="category" value={c}
                checked={getParam("category") === c}
                onChange={() => setFilter("category", c)}
                className="accent-earth-400" />
              <span className="text-sm text-puff-dark">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="text-sm font-semibold text-puff-dark mb-2">ზომა</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter("size", getParam("size") === s ? "" : s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                getParam("size") === s
                  ? "bg-earth-400 text-white border-earth-400"
                  : "border-sand-200 text-puff-dark hover:border-earth-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-puff-muted mt-1">S=60cm · M=80cm · L=100cm · XL=120cm</p>
      </div>

      {/* Shape */}
      <div>
        <h3 className="text-sm font-semibold text-puff-dark mb-2">ფორმა</h3>
        <div className="space-y-1.5">
          {SHAPES.map((sh) => (
            <label key={sh} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox"
                checked={getParam("shape") === sh}
                onChange={() => setFilter("shape", getParam("shape") === sh ? "" : sh)}
                className="accent-earth-400" />
              <span className="text-sm text-puff-dark">{sh}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filling */}
      <div>
        <h3 className="text-sm font-semibold text-puff-dark mb-2">შიგთავსი</h3>
        <div className="space-y-1.5">
          {FILLINGS.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox"
                checked={getParam("filling") === f}
                onChange={() => setFilter("filling", getParam("filling") === f ? "" : f)}
                className="accent-earth-400" />
              <span className="text-sm text-puff-dark">{f}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clearAll}
          className="flex items-center gap-1.5 text-sm text-terracotta-500 hover:text-terracotta-600 transition-colors">
          <X size={14} />
          ფილტრების გასუფთავება
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <p className="text-sm text-puff-muted">{totalCount} პროდუქტი</p>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-secondary py-2 text-sm"
        >
          <SlidersHorizontal size={15} />
          ფილტრები
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-puff-dark">ფილტრები</h2>
            <button onClick={() => setMobileOpen(false)} className="text-puff-muted hover:text-puff-dark">
              <X size={18} />
            </button>
          </div>
          <FiltersContent />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-6 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-puff-dark text-sm">ფილტრები</h2>
            <p className="text-xs text-puff-muted">{totalCount} პ.</p>
          </div>
          <FiltersContent />
        </div>
      </aside>
    </>
  );
}
