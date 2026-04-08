"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

interface OrderItemInput {
  productId: string;
  variantId?: string | null;
  productName: string;
  variantDesc?: string | null;
  unitPrice: number;
  quantity: number;
}

interface CreateOrderInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment?: string;
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  total: number;
}

export async function createOrder(data: CreateOrderInput) {
  const order = await prisma.order.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      city: data.city,
      address: data.address,
      comment: data.comment ?? null,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          productName: item.productName,
          variantDesc: item.variantDesc ?? null,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          total: item.unitPrice * item.quantity,
        })),
      },
    },
  });

  revalidatePath("/admin/(protected)/orders");
  return { orderNumber: order.orderNumber };
}

export async function getOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch {
    return [];
  }
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/(protected)/orders");
}
