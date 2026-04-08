import { Suspense } from "react";
import { getPublishedProducts } from "@/app/actions/products";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import ProductCard from "@/components/catalog/ProductCard";
import CatalogFilters from "@/components/catalog/CatalogFilters";

export const metadata = {
  title: "კატალოგი — ბუნებრივი პუფები",
  description: "Puffico-ს პუფების სრული კოლექცია. ფილტრებით მოძებნეთ თქვენი ზომა, ფერი და ფორმა.",
};

interface PageProps {
  searchParams: {
    size?: string;
    shape?: string;
    filling?: string;
    category?: string;
    sort?: string;
  };
}

export default async function CatalogPage({ searchParams }: PageProps) {
  // Try real DB, fall back to mock data
  let products = await getPublishedProducts({
    size: searchParams.size,
    shape: searchParams.shape,
    filling: searchParams.filling,
    category: searchParams.category,
    sort: searchParams.sort,
  });

  if (products.length === 0) {
    // DB not connected or empty — use mock data
    let mock = MOCK_PRODUCTS;

    if (searchParams.size)
      mock = mock.filter((p) => p.variants.some((v) => v.size === searchParams.size));
    if (searchParams.shape)
      mock = mock.filter((p) => p.variants.some((v) => v.shape === searchParams.shape));
    if (searchParams.filling)
      mock = mock.filter((p) => p.variants.some((v) => v.filling === searchParams.filling));
    if (searchParams.category)
      mock = mock.filter((p) => p.category === searchParams.category);

    if (searchParams.sort === "price_asc")
      mock = [...mock].sort((a, b) => a.basePrice - b.basePrice);
    else if (searchParams.sort === "price_desc")
      mock = [...mock].sort((a, b) => b.basePrice - a.basePrice);
    else if (searchParams.sort === "featured")
      mock = [...mock].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

    products = mock as unknown as typeof products;
  }

  return (
    <div className="min-h-screen bg-puff-white">
      {/* Hero banner */}
      <div className="bg-cream-100 border-b border-sand-100">
        <div className="section-container py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-puff-dark">
            პუფების კოლექცია
          </h1>
          <p className="text-puff-muted mt-2 max-w-lg">
            ყველა პუფი ხელნაკეთია ბუნებრივი მასალებისგან. აირჩიეთ ზომა, ფერი და ფორმა.
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters — sidebar on desktop, drawer on mobile */}
          <Suspense fallback={null}>
            <CatalogFilters totalCount={products.length} />
          </Suspense>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-puff-muted text-lg">პროდუქტები ვერ მოიძებნა.</p>
                <a href="/catalog" className="btn-secondary mt-4 inline-flex">
                  ფილტრების გასუფთავება
                </a>
              </div>
            ) : (
              <>
                <p className="text-sm text-puff-muted mb-6 hidden lg:block">
                  {products.length} პროდუქტი
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      slug={p.slug}
                      shortDesc={p.shortDesc}
                      basePrice={
                        typeof p.basePrice === "number"
                          ? p.basePrice
                          : (p.basePrice as { toNumber: () => number }).toNumber()
                      }
                      salePrice={
                        p.salePrice
                          ? typeof p.salePrice === "number"
                            ? p.salePrice
                            : (p.salePrice as { toNumber: () => number }).toNumber()
                          : null
                      }
                      images={p.images}
                      variants={p.variants}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
