import { MetadataRoute } from "next";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { MOCK_BLOG_POSTS } from "@/lib/mock-content";

const BASE_URL = "https://puffico.ge";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  let productSlugs: string[] = MOCK_PRODUCTS.map((p) => p.slug);
  let blogSlugs: string[] = MOCK_BLOG_POSTS.map((p) => p.slug);

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const [products, posts] = await Promise.all([
        prisma.product.findMany({ where: { isPublished: true }, select: { slug: true } }),
        prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true } }),
      ]);
      productSlugs = products.map((p) => p.slug);
      blogSlugs = posts.map((p) => p.slug);
    } catch {
      // fallback to mock slugs already set above
    }
  }

  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/catalog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
