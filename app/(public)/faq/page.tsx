import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MOCK_FAQ_ITEMS } from "@/lib/mock-content";
import FaqAccordion from "@/components/content/FaqAccordion";

const getFaqItems = unstable_cache(
  async () => {
    try {
      const items = await prisma.faqItem.findMany({ orderBy: { position: "asc" } });
      if (items.length > 0) return items;
    } catch {
      // fall through
    }
    return MOCK_FAQ_ITEMS;
  },
  ["faq-items"],
  { revalidate: 86400, tags: ["faq"] }
);

export const metadata = {
  title: "ხშირად დასმული კითხვები — Puffico",
  description: "პასუხები ხშირად დასმულ კითხვებს შეკვეთის, მიწოდების და მასალების შესახებ",
};

export default async function FaqPage() {
  const items = await getFaqItems();

  return (
    <div className="min-h-screen bg-puff-white">
      {/* Hero */}
      <section className="bg-cream-50 border-b border-sand-100">
        <div className="section-container py-12 md:py-16 text-center">
          <p className="text-sm font-medium text-earth-500 mb-2 uppercase tracking-widest">
            FAQ
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-puff-dark mb-4">
            ხშირად დასმული კითხვები
          </h1>
          <p className="text-puff-muted max-w-md mx-auto">
            ვერ პოულობთ პასუხს? დაგვიკავშირდით{" "}
            <a
              href="mailto:hello@puffico.ge"
              className="text-earth-500 hover:underline"
            >
              hello@puffico.ge
            </a>
          </p>
        </div>
      </section>

      <div className="section-container py-10 md:py-14 max-w-3xl">
        <FaqAccordion items={items} />

        {/* CTA */}
        <div className="mt-12 p-6 bg-cream-50 rounded-3xl border border-sand-100 text-center">
          <p className="font-semibold text-puff-dark mb-1">
            კვლავ გაქვთ კითხვა?
          </p>
          <p className="text-sm text-puff-muted mb-4">
            ჩვენი გუნდი 24 საათის განმავლობაში გიპასუხებთ
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="mailto:hello@puffico.ge" className="btn-primary py-2.5 px-6">
              ელ. ფოსტა
            </a>
            <a href="tel:+995599000000" className="btn-secondary py-2.5 px-6">
              დარეკვა
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
