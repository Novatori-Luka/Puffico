import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MOCK_BLOG_POSTS } from "@/lib/mock-content";

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    if (posts.length === 0) return MOCK_BLOG_POSTS;
    return posts;
  } catch {
    return MOCK_BLOG_POSTS;
  }
}

export const metadata = {
  title: "ბლოგი — Puffico",
  description: "სტატიები ინტერიერის, ბუნებრივი მასალების და ხელნაკეთი ნივთების შესახებ",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-puff-white">
      {/* Hero */}
      <section className="bg-cream-50 border-b border-sand-100">
        <div className="section-container py-12 md:py-16">
          <p className="text-sm font-medium text-earth-500 mb-2 uppercase tracking-widest">
            ბლოგი
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-puff-dark max-w-xl">
            ინტერიერი, მასალები, სიყვარული ხელნაკეთთან
          </h1>
        </div>
      </section>

      <div className="section-container py-10 md:py-14">
        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group block mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream-50 rounded-3xl overflow-hidden border border-sand-100 hover:shadow-card transition-shadow">
              <div className="relative h-64 md:h-auto min-h-[280px] overflow-hidden">
                <Image
                  src={featured.coverImage ?? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge">{featured.category}</span>
                  <span className="text-xs text-puff-muted flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(featured.publishedAt!).toLocaleDateString("ka-GE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-2xl font-display font-bold text-puff-dark mb-3 group-hover:text-earth-500 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-puff-muted text-sm leading-relaxed mb-5">
                  {featured.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-earth-500 group-hover:gap-3 transition-all">
                  სრულად წაკითხვა <ArrowRight size={15} />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Rest of posts */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group card overflow-hidden hover:shadow-card transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-sand-50">
                  <Image
                    src={post.coverImage ?? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-earth-500 flex items-center gap-1">
                      <Tag size={10} />
                      {post.category}
                    </span>
                    <span className="text-xs text-puff-muted">·</span>
                    <span className="text-xs text-puff-muted">
                      {new Date(post.publishedAt!).toLocaleDateString("ka-GE", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-puff-dark mb-2 group-hover:text-earth-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-puff-muted line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
