import { notFound } from "next/navigation";
import { getProductBySlug, getPublishedProducts } from "@/app/actions/products";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartSection from "@/components/product/AddToCartSection";
import ProductCard from "@/components/catalog/ProductCard";
import { Leaf, MapPin, Shield, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

function toNum(v: number | { toNumber: () => number } | null | undefined): number {
  if (!v) return 0;
  return typeof v === "number" ? v : v.toNumber();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    const mock = MOCK_PRODUCTS.find((p) => p.slug === params.slug);
    if (!mock) return {};
    return {
      title: `${mock.name} | Puffico`,
      description: mock.shortDesc ?? undefined,
    };
  }
  return {
    title: product.metaTitle ?? `${product.name} | Puffico`,
    description: product.metaDesc ?? product.shortDesc ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Try real DB, fallback to mock
  const dbProduct = await getProductBySlug(params.slug);
  let relatedRaw = await getPublishedProducts({ sort: "featured" });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let p: any = dbProduct;

  if (!p) {
    const mock = MOCK_PRODUCTS.find((m) => m.slug === params.slug);
    if (!mock) notFound();
    p = mock;
    relatedRaw = MOCK_PRODUCTS.filter((m) => m.slug !== params.slug).slice(0, 4) as unknown as typeof relatedRaw;
  }

  const related = (relatedRaw.length > 0 ? relatedRaw : MOCK_PRODUCTS)
    .filter((r) => r.slug !== params.slug)
    .slice(0, 4);

  const basePrice = toNum(p.basePrice);
  const salePrice = p.salePrice ? toNum(p.salePrice) : null;
  const primaryImageUrl =
    p.images?.find((i: { isPrimary: boolean }) => i.isPrimary)?.url ??
    p.images?.[0]?.url ??
    "";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDesc ?? p.description ?? undefined,
    image: primaryImageUrl,
    sku: p.sku ?? p.slug,
    brand: { "@type": "Brand", name: "Puffico" },
    offers: {
      "@type": "Offer",
      priceCurrency: "GEL",
      price: salePrice ?? basePrice,
      availability:
        (p.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Puffico" },
    },
  };

  return (
    <div className="min-h-screen bg-puff-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="border-b border-sand-100 bg-cream-50">
        <div className="section-container py-3">
          <nav className="flex items-center gap-2 text-sm text-puff-muted">
            <a href="/" className="hover:text-puff-dark transition-colors">მთავარი</a>
            <span>/</span>
            <a href="/catalog" className="hover:text-puff-dark transition-colors">კატალოგი</a>
            <span>/</span>
            <span className="text-puff-dark font-medium truncate max-w-[180px]">{p.name}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <div className="section-container py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={p.images} productName={p.name} />

          {/* Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {p.category && (
                <span className="badge bg-sand-50 text-sand-600 text-xs">{p.category}</span>
              )}
              {p.isFeatured && (
                <span className="badge bg-terracotta-50 text-terracotta-500 text-xs">Featured</span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-display font-bold text-puff-dark leading-tight">
              {p.name}
            </h1>

            {/* Short desc */}
            {p.shortDesc && (
              <p className="text-puff-muted text-base leading-relaxed">{p.shortDesc}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {salePrice ? (
                <>
                  <span className="text-3xl font-bold text-terracotta-500">₾{salePrice}</span>
                  <span className="text-xl text-puff-muted line-through">₾{basePrice}</span>
                  <span className="badge bg-terracotta-50 text-terracotta-500 text-xs font-semibold">
                    -{Math.round(((basePrice - salePrice) / basePrice) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-puff-dark">₾{basePrice}</span>
              )}
            </div>

            {/* Variants + Add to cart */}
            <AddToCartSection
              productId={p.id}
              name={p.name}
              slug={p.slug}
              image={p.images.find((i: { isPrimary: boolean }) => i.isPrimary)?.url ?? p.images[0]?.url ?? ""}
              basePrice={basePrice}
              variants={p.variants.map((v: typeof p.variants[0]) => ({
                ...v,
                priceAdj: v.priceAdj ? toNum(v.priceAdj) : null,
              }))}
            />

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: Leaf, text: "100% ბუნებრივი მასალა" },
                { icon: MapPin, text: "ხელნაკეთი საქართველოში" },
                { icon: Shield, text: "14-დღიანი დაბრუნება" },
                { icon: ShoppingBag, text: "უფასო მიტანა თბილისში" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-puff-muted">
                  <Icon size={15} className="text-sage-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Description */}
            {p.description && (
              <div className="border-t border-sand-100 pt-5">
                <h2 className="font-semibold text-puff-dark mb-2">აღწერა</h2>
                <p className="text-puff-muted text-sm leading-relaxed whitespace-pre-line">
                  {p.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="bg-cream-50 border-t border-sand-100">
          <div className="section-container py-12">
            <h2 className="text-2xl font-display font-bold text-puff-dark mb-8">
              მსგავსი პუფები
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((r) => (
                <ProductCard
                  key={r.id}
                  id={r.id}
                  name={r.name}
                  slug={r.slug}
                  shortDesc={r.shortDesc}
                  basePrice={toNum(r.basePrice)}
                  salePrice={r.salePrice ? toNum(r.salePrice) : null}
                  images={r.images}
                  variants={r.variants}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
