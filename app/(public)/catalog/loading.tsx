export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-puff-white">
      <div className="bg-cream-100 border-b border-sand-100">
        <div className="section-container py-10 md:py-14">
          <div className="h-9 w-48 bg-sand-100 rounded-xl animate-pulse" />
          <div className="h-4 w-72 bg-sand-100 rounded-lg animate-pulse mt-3" />
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar skeleton */}
          <div className="w-full lg:w-56 shrink-0 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-sand-100 rounded-xl animate-pulse" />
            ))}
          </div>

          {/* Product grid skeleton */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-sand-100 animate-pulse">
                <div className="bg-sand-100 aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-sand-100 rounded w-3/4" />
                  <div className="h-3 bg-sand-100 rounded w-1/2" />
                  <div className="h-5 bg-sand-100 rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
