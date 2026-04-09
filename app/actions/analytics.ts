"use server";

import { prisma } from "@/lib/prisma";

export type Period = "today" | "week" | "month" | "year";

function periodStart(period: Period): Date {
  const now = new Date();
  switch (period) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "year":
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }
}

export async function getAnalyticsData(period: Period = "month") {
  const from = periodStart(period);

  try {
    const [orders, topProducts, recentOrders] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: from }, status: { not: "CANCELLED" } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        where: {
          order: { createdAt: { gte: from }, status: { not: "CANCELLED" } },
        },
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { total: "desc" } },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { items: { take: 1, select: { productName: true } } },
      }),
    ]);

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Aggregate by day
    const dayMap = new Map<string, { revenue: number; count: number }>();
    for (const o of orders) {
      const day = o.createdAt.toISOString().slice(0, 10);
      const cur = dayMap.get(day) ?? { revenue: 0, count: 0 };
      dayMap.set(day, { revenue: cur.revenue + Number(o.total), count: cur.count + 1 });
    }

    // Fill every day in range
    const days: { date: string; revenue: number; count: number }[] = [];
    const cursor = new Date(from);
    const end = new Date();
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      const val = dayMap.get(key) ?? { revenue: 0, count: 0 };
      days.push({ date: key, ...val });
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      days,
      topProducts: topProducts.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        units: p._sum.quantity ?? 0,
        revenue: Number(p._sum.total ?? 0),
      })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        firstName: o.firstName,
        lastName: o.lastName,
        total: Number(o.total),
        status: o.status,
        createdAt: o.createdAt,
        firstItem: o.items[0]?.productName ?? "",
      })),
    };
  } catch {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      days: [] as { date: string; revenue: number; count: number }[],
      topProducts: [] as { productId: string; productName: string; units: number; revenue: number }[],
      recentOrders: [] as {
        id: string; orderNumber: string; firstName: string; lastName: string;
        total: number; status: string; createdAt: Date; firstItem: string;
      }[],
    };
  }
}
