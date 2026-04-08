"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Eye, ChevronDown } from "lucide-react";
import { updateOrderStatus } from "@/app/actions/orders";

type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number | { toString(): string };
}

interface Order {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  total: number | { toString(): string };
  status: OrderStatus;
  createdAt: Date;
  items: OrderItem[];
}

interface Props {
  orders: Order[];
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "მომლოდინე",
  CONFIRMED: "დადასტურებული",
  SHIPPED: "გაგზავნილი",
  DELIVERED: "მიტანილი",
  CANCELLED: "გაუქმებული",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-sage-100 text-sage-700",
  CANCELLED: "bg-red-100 text-red-600",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function StatusSelect({ order }: { order: Order }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative inline-flex items-center">
      <select
        value={order.status}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as OrderStatus;
          startTransition(() => updateOrderStatus(order.id, next));
        }}
        className={`appearance-none pl-2.5 pr-7 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-opacity ${
          STATUS_COLORS[order.status]
        } ${isPending ? "opacity-50" : ""}`}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <ChevronDown
        size={11}
        className="absolute right-1.5 pointer-events-none opacity-60"
      />
    </div>
  );
}

export default function OrdersTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-puff-muted">
        <p className="text-lg font-medium">შეკვეთები არ მოიძებნა</p>
        <p className="text-sm mt-1">შეკვეთები გამოჩნდება საიტზე განხორციელების შემდეგ</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sand-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-puff-muted uppercase tracking-wide">
              შეკვეთა
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-puff-muted uppercase tracking-wide">
              მომხმარებელი
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-puff-muted uppercase tracking-wide">
              პროდუქტები
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-puff-muted uppercase tracking-wide">
              სულ
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-puff-muted uppercase tracking-wide">
              სტატუსი
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-puff-muted uppercase tracking-wide">
              თარიღი
            </th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-sand-50">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-cream-50 transition-colors">
              {/* Order number */}
              <td className="py-3.5 px-4">
                <span className="font-mono text-xs font-semibold text-puff-dark">
                  #{order.orderNumber.slice(-8).toUpperCase()}
                </span>
              </td>

              {/* Customer */}
              <td className="py-3.5 px-4">
                <p className="font-medium text-puff-dark">
                  {order.firstName} {order.lastName}
                </p>
                <p className="text-xs text-puff-muted">{order.phone}</p>
                <p className="text-xs text-puff-muted">{order.city}</p>
              </td>

              {/* Items summary */}
              <td className="py-3.5 px-4 max-w-[200px]">
                <p className="text-puff-dark line-clamp-1">
                  {order.items[0]?.productName}
                  {order.items.length > 1 && (
                    <span className="text-puff-muted ml-1">
                      +{order.items.length - 1}
                    </span>
                  )}
                </p>
                <p className="text-xs text-puff-muted">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} ერთ.
                </p>
              </td>

              {/* Total */}
              <td className="py-3.5 px-4 font-semibold text-puff-dark">
                ₾{Number(order.total).toFixed(0)}
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <StatusSelect order={order} />
              </td>

              {/* Date */}
              <td className="py-3.5 px-4 text-xs text-puff-muted whitespace-nowrap">
                {new Date(order.createdAt).toLocaleDateString("ka-GE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="p-1.5 rounded-lg text-puff-muted hover:text-puff-dark hover:bg-sand-100 transition-colors inline-flex"
                  title="დეტალები"
                >
                  <Eye size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
