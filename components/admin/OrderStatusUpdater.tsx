"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { updateOrderStatus } from "@/app/actions/orders";

type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "მომლოდინე",
  CONFIRMED: "დადასტურებული",
  SHIPPED: "გაგზავნილი",
  DELIVERED: "მიტანილი",
  CANCELLED: "გაუქმებული",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus;
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="input-field w-full"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {isPending && (
        <div className="flex items-center gap-2 text-xs text-puff-muted">
          <Loader2 size={12} className="animate-spin" />
          განახლება...
        </div>
      )}
    </div>
  );
}
