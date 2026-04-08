import { prisma } from "@/lib/prisma";
import { MOCK_GALLERY_IMAGES } from "@/lib/mock-content";
import GalleryGrid from "@/components/content/GalleryGrid";

async function getGalleryImages(category?: string) {
  try {
    const images = await prisma.galleryImage.findMany({
      where: category ? { category } : undefined,
      orderBy: { position: "asc" },
    });
    if (images.length > 0) return images;
  } catch {
    // fall through
  }
  const mock = MOCK_GALLERY_IMAGES;
  if (category) return mock.filter((i) => i.category === category);
  return mock;
}

export const metadata = {
  title: "გალერეა — Puffico",
  description: "ჩვენი სახელოსნო, ინტერიერები და პუფების დეტალები",
};

const CATEGORIES = ["ყველა", "ინტერიერი", "სახელოსნო", "დეტალი"];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const activeCategory = searchParams.cat ?? "ყველა";
  const images = await getGalleryImages(
    activeCategory === "ყველა" ? undefined : activeCategory
  );

  return (
    <div className="min-h-screen bg-puff-white">
      {/* Hero */}
      <section className="bg-cream-50 border-b border-sand-100">
        <div className="section-container py-12 md:py-16 text-center">
          <p className="text-sm font-medium text-earth-500 mb-2 uppercase tracking-widest">
            გალერეა
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-puff-dark mb-4">
            Puffico სახელოსნო და ინტერიერი
          </h1>
          <p className="text-puff-muted max-w-md mx-auto">
            ჩვენი ხელნაკეთი პუფები სხვადასხვა ინტერიერებში
          </p>
        </div>
      </section>

      <div className="section-container py-10 md:py-14">
        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const href =
              cat === "ყველა"
                ? "/gallery"
                : `/gallery?cat=${encodeURIComponent(cat)}`;
            return (
              <a
                key={cat}
                href={href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-earth-400 text-white"
                    : "bg-cream-100 text-puff-dark hover:bg-cream-200"
                }`}
              >
                {cat}
              </a>
            );
          })}
        </div>

        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
