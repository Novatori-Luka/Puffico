"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export interface BlogPostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  isPublished: boolean;
  metaTitle?: string;
  metaDesc?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export async function getAdminBlogPosts() {
  try {
    return await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function getAdminBlogPost(id: string) {
  try {
    return await prisma.blogPost.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function createBlogPost(data: BlogPostData) {
  const slug = data.slug || slugify(data.title);
  await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      category: data.category || null,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? new Date() : null,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, data: BlogPostData) {
  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  const slug = data.slug || slugify(data.title);
  await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      category: data.category || null,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? (existing?.publishedAt ?? new Date()) : null,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { slug: true },
  });
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (post) revalidatePath(`/blog/${post.slug}`);
}

export async function toggleBlogPublished(id: string, isPublished: boolean) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  await prisma.blogPost.update({
    where: { id },
    data: {
      isPublished,
      publishedAt: isPublished ? (post?.publishedAt ?? new Date()) : null,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
