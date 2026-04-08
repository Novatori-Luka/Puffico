import Link from "next/link";

const LINKS = {
  კატალოგი: [
    { label: "ყველა პუფი", href: "/catalog" },
    { label: "Standard", href: "/catalog?category=Standard" },
    { label: "Premium", href: "/catalog?category=Premium" },
    { label: "Luxury", href: "/catalog?category=Luxury" },
  ],
  ინფო: [
    { label: "ჩვენს შესახებ", href: "/about" },
    { label: "გალერეა", href: "/gallery" },
    { label: "ბლოგი", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-puff-dark text-cream-200">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xl font-display font-bold text-cream-100">Puffico</h2>
            <p className="text-sm text-cream-300/70 leading-relaxed max-w-xs">
              ქართული ბრენდი, რომელიც ამზადებს ნატურალური შიგთავსის ხელნაკეთ პუფებს.
              ბუნებრივი მასალები, ადგილობრივი წარმოება.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://instagram.com/puffico.ge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cream-300/60 hover:text-cream-100 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com/puffico"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cream-300/60 hover:text-cream-100 transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://tiktok.com/@puffico"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cream-300/60 hover:text-cream-100 transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-cream-100 mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-cream-300/60 hover:text-cream-100 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-300/40">© Puffico 2025. ყველა უფლება დაცულია.</p>
          <p className="text-xs text-cream-300/40">
            <a href="tel:+995599000000" className="hover:text-cream-100 transition-colors">
              +995 599 000 000
            </a>
            {" · "}
            <a href="mailto:hello@puffico.ge" className="hover:text-cream-100 transition-colors">
              hello@puffico.ge
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
