"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase";

export async function getAdminGalleryItems() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { position: "asc" } });
  } catch {
    return [];
  }
}

export async function uploadAndCreateGalleryItem(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("ფაილი არ არის");

  const ext = file.name.split(".").pop() ?? "bin";
  const fileName = `${Date.now()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.storage
    .from("gallery")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (error || !data) throw new Error("ატვირთვა ვერ მოხერხდა: " + error?.message);

  const { data: urlData } = adminClient.storage
    .from("gallery")
    .getPublicUrl(data.path);

  const count = await prisma.galleryImage.count();
  await prisma.galleryImage.create({
    data: { url: urlData.publicUrl, position: count },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryItem(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
