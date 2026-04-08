import { prisma } from "@/lib/prisma";
import {
  Package,
  ShoppingBag,
  FileText,
  TrendingUp,
} from "lucide-react";

async function getStats() {
  try {
    const [products, orders, posts, pendingOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.blogPost.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);
    return { products, orders, posts, pendingOrders };
  } catch {
    // DB not connected yet — return zeros
    return { products: 0, orders: 0, posts: 0, pendingOrders: 0 };
  }
}

const statusLabels: Record<string, string> = {
  PENDING:   "მომლოდინე",
  CONFIRMED: "დადასტურებული",
  SHIPPED:   "გაგზავნილი",
  DELIVERED: "მიტანილი",
  CANCELLED: "გაუქმებული",
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "პროდუქტი",
      value: stats.products,
      icon: Package,
      color: "bg-earth-50 text-earth-500",
    },
    {
      label: "შეკვეთა სულ",
      value: stats.orders,
      icon: ShoppingBag,
      color: "bg-terracotta-50 text-terracotta-500",
    },
    {
      label: "მომლოდინე შეკვეთა",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "bg-sage-50 text-sage-500",
    },
    {
      label: "ბლოგ პოსტი",
      value: stats.posts,
      icon: FileText,
      color: "bg-sand-50 text-sand-600",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-puff-dark">
          დეშბორდი
        </h1>
        <p className="text-puff-muted text-sm mt-1">
          Puffico-ს მართვის პანელი
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-puff-muted">{card.label}</p>
                  <p className="text-3xl font-bold text-puff-dark mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-puff-dark mb-4">სწრაფი მოქმედებები</h2>
          <div className="space-y-2">
            {[
              { label: "პროდუქტის დამატება", href: "/admin/products/new" },
              { label: "შეკვეთების ნახვა", href: "/admin/orders" },
              { label: "ბლოგ პოსტის დამატება", href: "/admin/blog/new" },
              { label: "FAQ-ის რედაქტირება", href: "/admin/faq" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-cream-100 transition-colors text-sm text-puff-dark"
              >
                {link.label}
                <span className="text-puff-muted">→</span>
              </a>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-puff-dark mb-4">სტატუსების ლეგენდა</h2>
          <div className="space-y-2">
            {Object.entries(statusLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-sand-300 shrink-0" />
                <span className="font-mono text-xs text-puff-muted w-24">{key}</span>
                <span className="text-puff-dark">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
