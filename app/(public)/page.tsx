import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/catalog/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { getPublishedProducts } from "@/app/actions/products";
import { ArrowRight, Leaf, MapPin, Heart } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "https://puffico.ge" },
  openGraph: {
    url: "https://puffico.ge",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Puffico" }],
  },
};

export default async function HomePage() {
  let featured = await getPublishedProducts({ sort: "featured" });
  if (featured.length === 0) {
    featured = MOCK_PRODUCTS.filter((p) => p.isFeatured) as unknown as typeof featured;
  }
  const displayFeatured = featured.slice(0, 6);

  function toNum(v: number | { toNumber: () => number } | null | undefined): number {
    if (!v) return 0;
    return typeof v === "number" ? v : v.toNumber();
  }

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F5EFE6] min-h-screen flex items-center">
        {/* Linen texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='4' x='1' fill='%236B4F3A' opacity='.5'/%3E%3Crect width='4' height='1' y='1' fill='%236B4F3A' opacity='.5'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="section-container w-full py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen lg:py-0 py-4">

            {/* ── Left: text ── */}
            <div className="flex flex-col justify-center lg:pr-12 animate-fade-up order-1">
              <span
                className="inline-block text-xs font-semibold tracking-widest uppercase mb-6"
                style={{ color: "#9e7248", animationDelay: "0ms" }}
              >
                ხელნაკეთი • ბუნებრივი • ქართული
              </span>

              <h1
                className="font-display font-bold text-puff-dark leading-[1.08] tracking-tight animate-fade-up"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
                  animationDelay: "80ms",
                }}
              >
                ბუნებრივი კომფორტი შენი სახლისთვის
              </h1>

              <p
                className="mt-6 text-lg text-puff-muted max-w-[480px] leading-relaxed animate-fade-up"
                style={{ animationDelay: "180ms" }}
              >
                Puffico-ს პუფები შეიქმნება ნატურალური მასალებისგან — ბამბა, ლინენი, მატყლი.
                ყოველი ნაჭერი ხელნაკეთია თბილისში.
              </p>

              <div
                className="mt-8 flex flex-wrap gap-3 animate-fade-up"
                style={{ animationDelay: "280ms" }}
              >
                <Link href="/catalog" className="btn-primary py-3.5 px-8 text-base">
                  პროდუქტების ნახვა
                  <ArrowRight size={18} />
                </Link>
                <Link href="/about" className="btn-secondary py-3.5 px-8 text-base">
                  ჩვენს შესახებ
                </Link>
              </div>
            </div>

            {/* ── Right: pouf visual ── */}
            <div className="relative flex items-center justify-center order-2 lg:order-2">
              {/* Warm radial background panel */}
              <div
                className="absolute inset-0 rounded-[2.5rem] lg:rounded-none lg:inset-y-0 lg:-right-8 lg:left-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 55% 48%, #F5EFE6 0%, #EBE0D2 45%, #E0D1BF 100%)",
                }}
              />

              {/* Oval ground shadow */}
              <div
                className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[58%] h-[7%] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(107,79,58,0.22) 0%, transparent 70%)",
                  filter: "blur(12px)",
                }}
              />

              {/* Floating pouf */}
              <div className="relative z-10 w-[min(480px,88vw)] animate-float py-12 lg:py-20">
                <Image
                  src="/images/hero-pouf.png"
                  alt="Puffico — ბუნებრივი ხელნაკეთი პუფი"
                  width={480}
                  height={400}
                  priority
                  className="w-full h-auto drop-shadow-xl select-none"
                  style={{
                    filter: "drop-shadow(0 32px 48px rgba(107,79,58,0.18))",
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────────────────── */}
      <section className="section-container py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-puff-dark">
              რჩეული პუფები
            </h2>
            <p className="text-puff-muted mt-1 text-sm">ჩვენი ყველაზე პოპულარული კოლექცია</p>
          </div>
          <Link
            href="/catalog"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-earth-500 hover:text-earth-600 transition-colors"
          >
            ყველა ნახვა
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {displayFeatured.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              shortDesc={p.shortDesc}
              basePrice={toNum(p.basePrice)}
              salePrice={p.salePrice ? toNum(p.salePrice) : null}
              images={p.images}
              variants={p.variants}
            />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/catalog" className="btn-secondary">
            ყველა პროდუქტი
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ─── Brand Values ──────────────────────────────────────────────── */}
      <section className="bg-cream-100 border-y border-sand-100">
        <div className="section-container py-14 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: Leaf,
                title: "100% ბუნებრივი",
                desc: "ვიყენებთ მხოლოდ სერტიფიცირებულ ბუნებრივ მასალებს — ლინენი, ბამბა, ეკო-მატყლი.",
              },
              {
                icon: MapPin,
                title: "ქართული წარმოება",
                desc: "ყოველი პუფი შეიქმნება ჩვენს სახელოსნოში თბილისში, გამოცდილი ოსტატების ხელით.",
              },
              {
                icon: Heart,
                title: "კომფორტი და სიყვარული",
                desc: "Puffico-ს პუფი მეტია, ვიდრე ავეჯი — ეს სახლის ნაწილია, შექმნილი სიყვარულით.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-earth-50 text-earth-400 mx-auto">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-bold text-puff-dark text-lg">{title}</h3>
                <p className="text-puff-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────── */}
      <section className="section-container py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-puff-dark">როგორ მუშაობს?</h2>
          <p className="text-puff-muted mt-2 text-sm">შეკვეთიდან მიტანამდე — 4 მარტივი ნაბიჯი</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "აირჩიეთ", desc: "ზომა, ფერი, ფორმა და შიგთავსი თქვენი გემოვნებით" },
            { step: "02", title: "დააკუსტომიზეთ", desc: "ინდივიდუალური ვარიაციები ხელმისაწვდომია" },
            { step: "03", title: "შეუკვეთეთ", desc: "მარტივი checkout — ტელეფონი და მისამართი" },
            { step: "04", title: "მიიღეთ", desc: "3–5 სამუშაო დღეში მიგიტანთ პირდაპირ სახლში" },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center space-y-2">
              <span className="text-4xl font-display font-bold text-sand-200">{step}</span>
              <h3 className="font-semibold text-puff-dark">{title}</h3>
              <p className="text-sm text-puff-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────────────── */}
      <section className="bg-earth-400">
        <div className="section-container py-12 text-center">
          <h2 className="text-3xl font-display font-bold text-cream-100 mb-3">
            მზად ხართ თქვენი პუფის ასარჩევად?
          </h2>
          <p className="text-cream-200/80 mb-6 text-sm">
            უფასო კონსულტაცია და მიტანა თბილისში
          </p>
          <Link href="/catalog" className="inline-flex items-center gap-2 bg-puff-white text-earth-500 font-semibold px-8 py-3.5 rounded-xl hover:bg-cream-100 transition-colors text-sm">
            კატალოგის ნახვა
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
