import { notFound } from "next/navigation";
import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MOCK_BLOG_POSTS } from "@/lib/mock-content";

export const revalidate = 3600;

async function getPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, isPublished: true },
    });
    if (post) return post;
  } catch {
    // fall through to mock
  }
  return MOCK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

// Deduplicate DB call across generateMetadata + page render within the same request
const getPostCached = cache(getPost);

async function getRelated(slug: string, category: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true, category, NOT: { slug } },
      take: 2,
    });
    if (posts.length) return posts;
  } catch {
    // fall through
  }
  return MOCK_BLOG_POSTS.filter((p) => p.category === category && p.slug !== slug).slice(0, 2);
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return posts.map(({ slug }) => ({ slug }));
  } catch {
    return MOCK_BLOG_POSTS.map(({ slug }) => ({ slug }));
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostCached(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Puffico`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostCached(params.slug);
  if (!post) notFound();

  const related = await getRelated(params.slug, post.category ?? "");

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-puff-white">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 bg-sand-100 overflow-hidden">
        <Image
          src={post.coverImage ?? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200"}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-puff-dark/60 to-transparent" />
      </div>

      <div className="section-container py-10 md:py-14">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm text-puff-muted hover:text-puff-dark transition-colors mb-6"
          >
            <ArrowLeft size={15} />
            ბლოგზე დაბრუნება
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="badge flex items-center gap-1">
              <Tag size={10} />
              {post.category}
            </span>
            {post.publishedAt && (
              <span className="text-xs text-puff-muted flex items-center gap-1">
                <Calendar size={11} />
                {new Date(post.publishedAt).toLocaleDateString("ka-GE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-puff-dark mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Content */}
          <div className="prose-like space-y-4">
            {paragraphs.map((para, i) => {
              if (para.startsWith("•") || para.includes("\n•")) {
                const items = para.split("\n").filter((l) => l.startsWith("•"));
                return (
                  <ul key={i} className="space-y-1.5 pl-1">
                    {items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-puff-muted text-base leading-relaxed">
                        <span className="text-earth-400 mt-1 shrink-0">•</span>
                        <span>{item.replace("•", "").trim()}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-puff-muted leading-relaxed text-base">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-sand-100 mt-10 pt-8">
            <p className="text-xs text-puff-muted mb-4 uppercase tracking-widest">
              მსგავსი სტატიები
            </p>
            {related.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group card p-4 hover:shadow-card transition-shadow"
                  >
                    <span className="text-xs text-earth-500 font-medium">{p.category}</span>
                    <h4 className="font-semibold text-puff-dark mt-1 group-hover:text-earth-500 transition-colors line-clamp-2 text-sm">
                      {p.title}
                    </h4>
                  </Link>
                ))}
              </div>
            ) : (
              <Link href="/blog" className="btn-ghost text-sm py-2 px-4">
                ყველა სტატია
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
