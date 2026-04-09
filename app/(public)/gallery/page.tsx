import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MOCK_GALLERY_IMAGES } from "@/lib/mock-content";
import GalleryGrid from "@/components/content/GalleryGrid";

const getGalleryImages = unstable_cache(
  async (category?: string) => {
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
  },
  ["gallery-images"],
  { revalidate: 3600, tags: ["gallery"] }
);

export const metadata = {
  title: "გალერეა — Puffico",
  description: "ჩვენი სახელოსნო, ინტერიერები და პუფების დეტალები",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

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
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
