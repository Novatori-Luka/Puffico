"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { ProductFormData } from "@/types/product";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export async function createProduct(data: ProductFormData) {
  const slug = data.slug || slugify(data.name);

  await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      shortDesc: data.shortDesc,
      basePrice: data.basePrice,
      salePrice: data.salePrice ?? null,
      sku: data.sku,
      stock: data.stock,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      category: data.category ?? null,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
      images: {
        create: data.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          position: img.position,
          isPrimary: img.isPrimary,
        })),
      },
      variants: {
        create: data.variants.map((v) => ({
          size: v.size ?? null,
          color: v.color ?? null,
          colorHex: v.colorHex ?? null,
          shape: v.shape ?? null,
          filling: v.filling ?? null,
          priceAdj: v.priceAdj ?? null,
          stock: v.stock,
          sku: v.sku ?? null,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
  redirect(`/admin/products`);
}

export async function updateProduct(id: string, data: ProductFormData) {
  const slug = data.slug || slugify(data.name);

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description,
      shortDesc: data.shortDesc,
      basePrice: data.basePrice,
      salePrice: data.salePrice ?? null,
      sku: data.sku,
      stock: data.stock,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      category: data.category ?? null,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/catalog/${slug}`);
  revalidatePath("/");
  redirect(`/admin/products`);
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function togglePublished(id: string, isPublished: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isPublished },
  });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getPublishedProducts(filters?: {
  size?: string;
  shape?: string;
  filling?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  try {
    const where: Record<string, unknown> = { isPublished: true };

    if (filters?.category) where.category = filters.category;

    if (filters?.size || filters?.shape || filters?.filling) {
      where.variants = {
        some: {
          ...(filters.size ? { size: filters.size } : {}),
          ...(filters.shape ? { shape: filters.shape } : {}),
          ...(filters.filling ? { filling: filters.filling } : {}),
        },
      };
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.basePrice = {
        ...(filters.minPrice ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
      };
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (filters?.sort === "price_asc") orderBy = { basePrice: "asc" };
    if (filters?.sort === "price_desc") orderBy = { basePrice: "desc" };
    if (filters?.sort === "featured") orderBy = { isFeatured: "desc" };

    return await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { position: "asc" }, take: 2 },
        variants: true,
      },
    });
  } catch {
    return [];
  }
}
