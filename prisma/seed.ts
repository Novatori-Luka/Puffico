import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await hash("Puffico2025!", 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@puffico.ge" },
    update: {},
    create: {
      email: "admin@puffico.ge",
      password: adminPassword,
      name: "Puffico Admin",
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // Products
  const products = [
    {
      name: "ნატურალური ლინენის პუფი",
      slug: "natural-linen-pouf",
      shortDesc: "ბუნებრივი ლინენით შეკერილი, ბამბის შიგთავსით",
      description:
        "ეს პუფი შექმნილია 100% ბუნებრივი ლინენის ქსოვილით და ივსება ეკო-სერტიფიცირებული ბამბით. იდეალურია სალონისთვის, საბავშვო ოთახისთვის ან სამუშაო სივრცისთვის.",
      basePrice: 180,
      salePrice: null,
      sku: "PUF-LIN-001",
      stock: 12,
      isFeatured: true,
      isPublished: true,
      category: "Standard",
      images: [
        { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", alt: "ლინენის პუფი", position: 0, isPrimary: true },
        { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", alt: "ლინენის პუფი — სხვა კუთხე", position: 1, isPrimary: false },
      ],
      variants: [
        { size: "M", color: "ბუნებრივი ლინენი — ბეჟი", colorHex: "#d1be96", shape: "მრგვალი", filling: "ბუნებრივი", stock: 6, sku: "PUF-LIN-001-M" },
        { size: "L", color: "ბუნებრივი ლინენი — ბეჟი", colorHex: "#d1be96", shape: "მრგვალი", filling: "ბუნებრივი", stock: 6, sku: "PUF-LIN-001-L" },
      ],
    },
    {
      name: "ტერაკოტა ბამბის პუფი",
      slug: "terracotta-cotton-pouf",
      shortDesc: "სუფთა ბამბა, ტერაკოტის ელფერი — თბილი ინტერიერისთვის",
      description:
        "ტერაკოტის ელფერი ბუნებრივი ბამბის ქსოვილზე — სითბო და მიწიერება ერთ ნივთში. შეიკერება ხელით თბილისში.",
      basePrice: 220,
      salePrice: 185,
      sku: "PUF-TER-002",
      stock: 8,
      isFeatured: true,
      isPublished: true,
      category: "Premium",
      images: [
        { url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800", alt: "ტერაკოტა პუფი", position: 0, isPrimary: true },
      ],
      variants: [
        { size: "S", color: "ტერაკოტა", colorHex: "#e27249", shape: "კვადრატი", filling: "ბუნებრივი", stock: 3, sku: "PUF-TER-002-S" },
        { size: "M", color: "ტერაკოტა", colorHex: "#e27249", shape: "კვადრატი", filling: "ბუნებრივი", stock: 3, sku: "PUF-TER-002-M" },
        { size: "L", color: "ტერაკოტა", colorHex: "#e27249", shape: "კვადრატი", filling: "ბუნებრივი", stock: 2, sku: "PUF-TER-002-L" },
      ],
    },
    {
      name: "მიწისფერი ხავსი — Luxury",
      slug: "earthy-moss-luxury",
      shortDesc: "პრემიუმ ხელნაკეთი პუფი ეკო-მატყლით",
      description:
        "Luxury კოლექციის ფლაგმანი — XL ზომის პუფი ბუნებრივი მატყლით. ყოველი ეგზემპლარი ინდივიდუალურად იქსოვება.",
      basePrice: 380,
      salePrice: null,
      sku: "PUF-MOS-003",
      stock: 4,
      isFeatured: false,
      isPublished: true,
      category: "Luxury",
      images: [
        { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", alt: "Luxury პუფი", position: 0, isPrimary: true },
      ],
      variants: [
        { size: "XL", color: "მიწისფერი ხავსი", colorHex: "#567a47", shape: "მრგვალი", filling: "ბუნებრივი", stock: 4, sku: "PUF-MOS-003-XL" },
      ],
    },
  ];

  for (const p of products) {
    const { images, variants, ...rest } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        images: { create: images },
        variants: { create: variants },
      },
    });
    console.log(`✅ Product: ${product.name}`);
  }

  // FAQ items
  const faqs = [
    { question: "რამდენ ხანში ჩამომართმევს შეკვეთა?", answer: "შეკვეთის გაფორმებიდან 3–5 სამუშაო დღის განმავლობაში.", category: "შეკვეთა", position: 0 },
    { question: "შეიძლება ინდივიდუალური ზომის შეკვეთა?", answer: "კი! დაგვიკავშირდით ინდივიდუალური შეკვეთისთვის.", category: "შეკვეთა", position: 1 },
    { question: "მიტანა სად ხდება?", answer: "ჩვენ ვაწვდით საქართველოს მასშტაბით. თბილისში მიტანა უფასოა.", category: "მიწოდება", position: 0 },
    { question: "რა მასალებს იყენებთ?", answer: "ვიყენებთ 100% ბუნებრივ ლინენს, ბამბასა და მატყლს.", category: "მასალები", position: 0 },
    { question: "შეიძლება პუფის დაბრუნება?", answer: "კი, 14 დღის განმავლობაში შეუნახავ მდგომარეობაში.", category: "დაბრუნება", position: 0 },
  ];

  for (const faq of faqs) {
    await prisma.faqItem.create({ data: faq }).catch(() => {});
  }
  console.log(`✅ FAQ: ${faqs.length} items`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
