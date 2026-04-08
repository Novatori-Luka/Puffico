"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct, togglePublished } from "@/app/actions/products";
import { Pencil, Trash2, Eye, EyeOff, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number | { toNumber: () => number };
  salePrice?: number | { toNumber: () => number } | null;
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  category?: string | null;
  images: { url: string; alt?: string | null; isPrimary: boolean }[];
  variants: { id: string }[];
}

function toNum(v: number | { toNumber: () => number }) {
  return typeof v === "number" ? v : v.toNumber();
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("პროდუქტის წაშლა? ეს ქმედება შეუქცევადია.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteProduct(id);
      setDeletingId(null);
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => togglePublished(id, !current));
  }

  if (products.length === 0) {
    return (
      <div className="card p-16 text-center">
        <Package size={40} className="mx-auto text-sand-300 mb-4" />
        <p className="text-puff-muted">პროდუქტები არ არსებობს.</p>
        <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex">
          პირველი პროდუქტის დამატება
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand-100 bg-cream-50">
              <th className="text-left px-4 py-3 font-medium text-puff-muted">პროდუქტი</th>
              <th className="text-left px-4 py-3 font-medium text-puff-muted">ფასი</th>
              <th className="text-left px-4 py-3 font-medium text-puff-muted">მარაგი</th>
              <th className="text-left px-4 py-3 font-medium text-puff-muted">ვარიაცია</th>
              <th className="text-left px-4 py-3 font-medium text-puff-muted">კატეგორია</th>
              <th className="text-left px-4 py-3 font-medium text-puff-muted">სტატუსი</th>
              <th className="text-right px-4 py-3 font-medium text-puff-muted">მოქმედება</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-50">
            {products.map((p) => {
              const primaryImage = p.images.find((i) => i.isPrimary) ?? p.images[0];
              const price = toNum(p.basePrice);
              const sale = p.salePrice ? toNum(p.salePrice) : null;

              return (
                <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sand-100 overflow-hidden shrink-0">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.alt ?? p.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={16} className="text-sand-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-puff-dark">{p.name}</p>
                        <p className="text-2xs text-puff-muted">{p.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    {sale ? (
                      <div>
                        <span className="font-semibold text-terracotta-500">₾{sale}</span>
                        <span className="text-puff-muted line-through text-xs ml-1">₾{price}</span>
                      </div>
                    ) : (
                      <span className="font-medium text-puff-dark">₾{price}</span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <span className={`badge ${p.stock > 0 ? "bg-sage-50 text-sage-600" : "bg-red-50 text-red-600"}`}>
                      {p.stock > 0 ? p.stock : "არ არის"}
                    </span>
                  </td>

                  {/* Variants */}
                  <td className="px-4 py-3 text-puff-muted">{p.variants.length}</td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    {p.category && (
                      <span className="badge bg-sand-50 text-sand-600">{p.category}</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(p.id, p.isPublished)}
                      disabled={pending}
                      className={`badge gap-1 cursor-pointer transition-colors ${
                        p.isPublished
                          ? "bg-sage-50 text-sage-600 hover:bg-sage-100"
                          : "bg-sand-50 text-sand-600 hover:bg-sand-100"
                      }`}
                    >
                      {p.isPublished ? <Eye size={11} /> : <EyeOff size={11} />}
                      {p.isPublished ? "გამოქვეყნებული" : "დრაფტი"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/catalog/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-puff-muted hover:text-puff-dark hover:bg-cream-100 transition-colors"
                        title="საიტზე ნახვა"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-1.5 rounded-lg text-puff-muted hover:text-earth-500 hover:bg-earth-50 transition-colors"
                        title="რედაქტირება"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="p-1.5 rounded-lg text-puff-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                        title="წაშლა"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
