"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface FaqItemData {
  question: string;
  answer: string;
  category?: string;
}

export async function getAdminFaqItems() {
  try {
    return await prisma.faqItem.findMany({ orderBy: { position: "asc" } });
  } catch {
    return [];
  }
}

export async function createFaqItem(data: FaqItemData) {
  const count = await prisma.faqItem.count();
  await prisma.faqItem.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category || "general",
      position: count,
    },
  });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function updateFaqItem(id: string, data: FaqItemData) {
  await prisma.faqItem.update({
    where: { id },
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category || "general",
    },
  });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function deleteFaqItem(id: string) {
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}
