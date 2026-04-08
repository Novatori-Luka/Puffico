"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/products";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import type { ProductFormData, ProductVariantData } from "@/types/product";

interface ExistingProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDesc?: string | null;
  basePrice: number | { toNumber: () => number };
  salePrice?: number | { toNumber: () => number } | null;
  sku: string;
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  category?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  images: { id: string; url: string; alt?: string | null; position: number; isPrimary: boolean }[];
  variants: {
    id: string;
    size?: string | null;
    color?: string | null;
    colorHex?: string | null;
    shape?: string | null;
    filling?: string | null;
    priceAdj?: number | { toNumber: () => number } | null;
    stock: number;
    sku?: string | null;
  }[];
}

function toNum(v: number | { toNumber: () => number } | null | undefined): number {
  if (!v) return 0;
  return typeof v === "number" ? v : v.toNumber();
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-").trim();
}

const TABS = ["ძირითადი", "ვარიაციები", "სეო"] as const;
type Tab = (typeof TABS)[number];

const SIZE_OPTIONS = ["S", "M", "L", "XL"];
const SHAPE_OPTIONS = ["მრგვალი", "კვადრატი", "სხვა"];
const FILLING_OPTIONS = ["ბუნებრივი", "სინთეტიკური"];
const CATEGORY_OPTIONS = ["Standard", "Premium", "Luxury"];

const emptyVariant = (): ProductVariantData => ({
  size: null,
  color: null,
  colorHex: null,
  shape: null,
  filling: null,
  priceAdj: null,
  stock: 0,
  sku: null,
});

export default function ProductForm({ product }: { product?: ExistingProduct }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>("ძირითადი");
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc ?? "");
  const [basePrice, setBasePrice] = useState(product ? toNum(product.basePrice).toString() : "");
  const [salePrice, setSalePrice] = useState(product?.salePrice ? toNum(product.salePrice).toString() : "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(product?.isPublished ?? false);
  const [category, setCategory] = useState(product?.category ?? "");
  const [metaTitle, setMetaTitle] = useState(product?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(product?.metaDesc ?? "");
  const [imageUrl, setImageUrl] = useState(product?.images[0]?.url ?? "");
  const [variants, setVariants] = useState<ProductVariantData[]>(
    product?.variants.map((v) => ({
      id: v.id,
      size: v.size as ProductVariantData["size"],
      color: v.color,
      colorHex: v.colorHex,
      shape: v.shape as ProductVariantData["shape"],
      filling: v.filling as ProductVariantData["filling"],
      priceAdj: v.priceAdj ? toNum(v.priceAdj) : null,
      stock: v.stock,
      sku: v.sku,
    })) ?? []
  );

  function handleNameChange(v: string) {
    setName(v);
    if (!product) setSlug(slugify(v));
  }

  function addVariant() {
    setVariants([...variants, emptyVariant()]);
  }

  function removeVariant(i: number) {
    setVariants(variants.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, key: keyof ProductVariantData, value: unknown) {
    setVariants(variants.map((v, idx) => (idx === i ? { ...v, [key]: value } : v)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !sku || !basePrice) {
      setError("სახელი, SKU და ფასი სავალდებულოა.");
      return;
    }

    const data: ProductFormData = {
      name,
      slug: slug || slugify(name),
      description,
      shortDesc,
      basePrice: parseFloat(basePrice),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      sku,
      stock: parseInt(stock) || 0,
      isFeatured,
      isPublished,
      category: (category as ProductFormData["category"]) || null,
      metaTitle,
      metaDesc,
      variants,
      images: imageUrl
        ? [{ url: imageUrl, alt: name, position: 0, isPrimary: true }]
        : [],
    };

    startTransition(async () => {
      try {
        if (product) {
          await updateProduct(product.id, data);
        } else {
          await createProduct(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "შეცდომა. სცადეთ თავიდან.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-sand-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab
                ? "text-earth-500 border-b-2 border-earth-400 -mb-px"
                : "text-puff-muted hover:text-puff-dark"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: ძირითადი */}
      {activeTab === "ძირითადი" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-puff-dark">ძირითადი ინფო</h2>

              <div>
                <label className="field-label">სახელი (ქართ.) *</label>
                <input value={name} onChange={(e) => handleNameChange(e.target.value)}
                  className="input-field" placeholder="მაგ: ნატურალური პუფი — S" required />
              </div>

              <div>
                <label className="field-label">Slug (URL)</label>
                <div className="flex gap-2">
                  <input value={slug} onChange={(e) => setSlug(e.target.value)}
                    className="input-field font-mono text-sm" placeholder="natural-pouf-s" />
                  <button type="button" onClick={() => setSlug(slugify(name))}
                    className="btn-ghost px-3 shrink-0" title="სლაგის განახლება">
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>

              <div>
                <label className="field-label">მოკლე აღწერა</label>
                <input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)}
                  className="input-field" placeholder="1-2 წინადადება" />
              </div>

              <div>
                <label className="field-label">სრული აღწერა</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={5} className="input-field resize-none"
                  placeholder="პროდუქტის სრული აღწერა ქართულად..." />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-puff-dark">ფასი და მარაგი</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">საბაზო ფასი (₾) *</label>
                  <input type="number" min="0" step="0.01" value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="input-field" placeholder="0.00" required />
                </div>
                <div>
                  <label className="field-label">Sale ფასი (₾)</label>
                  <input type="number" min="0" step="0.01" value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label className="field-label">SKU *</label>
                  <input value={sku} onChange={(e) => setSku(e.target.value)}
                    className="input-field font-mono text-sm" placeholder="PUF-001" required />
                </div>
                <div>
                  <label className="field-label">მარაგი</label>
                  <input type="number" min="0" value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="input-field" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="field-label">კატეგორია</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="input-field">
                  <option value="">-- აირჩიეთ --</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-puff-dark">გამოქვეყნება</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded accent-earth-400" />
                <span className="text-sm text-puff-dark">გამოქვეყნებული</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-earth-400" />
                <span className="text-sm text-puff-dark">Featured (მთავარზე)</span>
              </label>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-puff-dark">სურათი</h2>
              <div>
                <label className="field-label">სურათის URL</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                  className="input-field text-sm" placeholder="https://..." />
              </div>
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="preview" className="w-full rounded-xl object-cover aspect-square" />
              )}
              <p className="text-xs text-puff-muted">Supabase Storage-ის ინტეგრაცია Phase 3-ში.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: ვარიაციები */}
      {activeTab === "ვარიაციები" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-puff-muted">{variants.length} ვარიაცია</p>
            <button type="button" onClick={addVariant} className="btn-secondary">
              <Plus size={15} />
              ვარიაციის დამატება
            </button>
          </div>

          {variants.length === 0 && (
            <div className="card p-12 text-center text-puff-muted text-sm">
              ვარიაციები არ გვაქვს. დაამატეთ პირველი.
            </div>
          )}

          {variants.map((v, i) => (
            <div key={i} className="card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-puff-dark text-sm">ვარიაცია #{i + 1}</h3>
                <button type="button" onClick={() => removeVariant(i)}
                  className="text-puff-muted hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="field-label">ზომა</label>
                  <select value={v.size ?? ""} onChange={(e) => updateVariant(i, "size", e.target.value || null)}
                    className="input-field">
                    <option value="">--</option>
                    {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">ფერი / ქსოვილი</label>
                  <input value={v.color ?? ""} onChange={(e) => updateVariant(i, "color", e.target.value || null)}
                    className="input-field" placeholder="ბუნებრივი ლინენი — ბეჟი" />
                </div>
                <div>
                  <label className="field-label">ფერის HEX</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={v.colorHex ?? "#d1be96"}
                      onChange={(e) => updateVariant(i, "colorHex", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-sand-200 cursor-pointer p-0.5" />
                    <input value={v.colorHex ?? ""} onChange={(e) => updateVariant(i, "colorHex", e.target.value || null)}
                      className="input-field font-mono text-sm" placeholder="#d1be96" />
                  </div>
                </div>
                <div>
                  <label className="field-label">ფორმა</label>
                  <select value={v.shape ?? ""} onChange={(e) => updateVariant(i, "shape", e.target.value || null)}
                    className="input-field">
                    <option value="">--</option>
                    {SHAPE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">შიგთავსი</label>
                  <select value={v.filling ?? ""} onChange={(e) => updateVariant(i, "filling", e.target.value || null)}
                    className="input-field">
                    <option value="">--</option>
                    {FILLING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">ფასის სხვაობა (₾)</label>
                  <input type="number" step="0.01" value={v.priceAdj ?? ""}
                    onChange={(e) => updateVariant(i, "priceAdj", e.target.value ? parseFloat(e.target.value) : null)}
                    className="input-field" placeholder="+0.00" />
                </div>
                <div>
                  <label className="field-label">მარაგი</label>
                  <input type="number" min="0" value={v.stock}
                    onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                    className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="field-label">SKU</label>
                  <input value={v.sku ?? ""} onChange={(e) => updateVariant(i, "sku", e.target.value || null)}
                    className="input-field font-mono text-sm" placeholder="PUF-001-M-BE" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: სეო */}
      {activeTab === "სეო" && (
        <div className="card p-6 space-y-4 max-w-2xl">
          <h2 className="font-semibold text-puff-dark">SEO მეტა-ტეგები</h2>
          <div>
            <label className="field-label">Meta Title</label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
              className="input-field" placeholder={name || "პროდუქტის სახელი | Puffico"} />
            <p className="text-xs text-puff-muted mt-1">{metaTitle.length}/60 სიმბოლო</p>
          </div>
          <div>
            <label className="field-label">Meta Description</label>
            <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)}
              rows={3} className="input-field resize-none"
              placeholder="პროდუქტის მოკლე SEO აღწერა..." />
            <p className="text-xs text-puff-muted mt-1">{metaDesc.length}/160 სიმბოლო</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
          {isPending ? "ინახება..." : product ? "ცვლილებების შენახვა" : "პროდუქტის დამატება"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          გაუქმება
        </button>
      </div>
    </form>
  );
}
