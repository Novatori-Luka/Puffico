import Link from "next/link";
import { getOrders } from "@/app/actions/orders";
import OrdersTable from "@/components/admin/OrdersTable";

const STATUS_TABS = [
  { label: "ყველა", value: "" },
  { label: "მომლოდინე", value: "PENDING" },
  { label: "დადასტურებული", value: "CONFIRMED" },
  { label: "გაგზავნილი", value: "SHIPPED" },
  { label: "მიტანილი", value: "DELIVERED" },
  { label: "გაუქმებული", value: "CANCELLED" },
];

interface PageProps {
  searchParams: { status?: string };
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const allOrders = await getOrders();
  const activeStatus = searchParams.status ?? "";

  const orders = activeStatus
    ? allOrders.filter((o) => o.status === activeStatus)
    : allOrders;

  const counts = {
    "": allOrders.length,
    PENDING: allOrders.filter((o) => o.status === "PENDING").length,
    CONFIRMED: allOrders.filter((o) => o.status === "CONFIRMED").length,
    SHIPPED: allOrders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: allOrders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: allOrders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-puff-dark">
            შეკვეთები
          </h1>
          <p className="text-puff-muted text-sm mt-0.5">
            სულ {allOrders.length} შეკვეთა
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 border-b border-sand-100 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          const count = counts[tab.value as keyof typeof counts];
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/orders?status=${tab.value}` : "/admin/orders"}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-earth-400 text-puff-dark"
                  : "border-transparent text-puff-muted hover:text-puff-dark"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? "bg-earth-100 text-earth-700"
                      : "bg-sand-100 text-puff-muted"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-puff-white rounded-2xl border border-sand-100 shadow-soft overflow-hidden">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
