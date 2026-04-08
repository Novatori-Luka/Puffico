import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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

const STATUS_STEPS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
];

async function getOrder(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  } catch {
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);

  if (!order) notFound();

  const stepIndex = STATUS_STEPS.indexOf(order.status as OrderStatus);

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* Back + header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-sm text-puff-muted hover:text-puff-dark transition-colors mb-2"
          >
            <ArrowLeft size={15} />
            შეკვეთების სია
          </Link>
          <h1 className="text-2xl font-display font-bold text-puff-dark">
            შეკვეთა #{order.orderNumber.slice(-8).toUpperCase()}
          </h1>
          <p className="text-puff-muted text-sm mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("ka-GE", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${
              STATUS_COLORS[order.status as OrderStatus]
            }`}
          >
            {STATUS_LABELS[order.status as OrderStatus]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Progress timeline */}
          {order.status !== "CANCELLED" && (
            <div className="bg-puff-white rounded-2xl border border-sand-100 shadow-soft p-5">
              <h2 className="font-semibold text-puff-dark mb-4">სტატუსი</h2>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => {
                  const done = stepIndex >= i;
                  const current = stepIndex === i;
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            done
                              ? "bg-earth-400 text-white"
                              : "bg-sand-100 text-puff-muted"
                          } ${current ? "ring-2 ring-earth-200 ring-offset-1" : ""}`}
                        >
                          {i + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-1 text-center whitespace-nowrap ${
                            done ? "text-puff-dark font-medium" : "text-puff-muted"
                          }`}
                        >
                          {STATUS_LABELS[step]}
                        </span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-1 mb-4 transition-colors ${
                            stepIndex > i ? "bg-earth-400" : "bg-sand-100"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order items */}
          <div className="bg-puff-white rounded-2xl border border-sand-100 shadow-soft p-5">
            <h2 className="font-semibold text-puff-dark mb-4">შეკვეთილი პროდუქტები</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-3 border-b border-sand-50 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-puff-dark">{item.productName}</p>
                    {item.variantDesc && (
                      <p className="text-xs text-puff-muted mt-0.5">
                        {item.variantDesc}
                      </p>
                    )}
                    <p className="text-xs text-puff-muted mt-0.5">
                      ₾{Number(item.unitPrice).toFixed(0)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-puff-dark shrink-0">
                    ₾{Number(item.total).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-sand-100 space-y-2 text-sm">
              <div className="flex justify-between text-puff-muted">
                <span>პროდუქტები</span>
                <span>₾{Number(order.subtotal).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-puff-muted">
                <span>მიტანა</span>
                <span>{Number(order.shipping) === 0 ? "უფასო" : `₾${Number(order.shipping).toFixed(0)}`}</span>
              </div>
              {order.discount && Number(order.discount) > 0 && (
                <div className="flex justify-between text-sage-600">
                  <span>ფასდაკლება</span>
                  <span>−₾{Number(order.discount).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-puff-dark text-base pt-2 border-t border-sand-100">
                <span>სულ</span>
                <span>₾{Number(order.total).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Status updater */}
          <div className="bg-puff-white rounded-2xl border border-sand-100 shadow-soft p-5">
            <h2 className="font-semibold text-puff-dark mb-3">სტატუსის შეცვლა</h2>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status as OrderStatus} />
          </div>

          {/* Customer info */}
          <div className="bg-puff-white rounded-2xl border border-sand-100 shadow-soft p-5">
            <h2 className="font-semibold text-puff-dark mb-3">მომხმარებელი</h2>
            <div className="space-y-2.5">
              <p className="font-medium text-puff-dark">
                {order.firstName} {order.lastName}
              </p>
              <div className="flex items-center gap-2 text-sm text-puff-muted">
                <Phone size={13} />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-puff-muted">
                <Mail size={13} />
                <span className="break-all">{order.email}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-puff-white rounded-2xl border border-sand-100 shadow-soft p-5">
            <h2 className="font-semibold text-puff-dark mb-3">მიწოდება</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-puff-muted">
                <MapPin size={13} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-puff-dark font-medium">{order.city}</p>
                  <p>{order.address}</p>
                </div>
              </div>
              {order.comment && (
                <div className="mt-3 pt-3 border-t border-sand-50">
                  <p className="text-xs text-puff-muted mb-1">კომენტარი</p>
                  <p className="text-sm text-puff-dark">{order.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
