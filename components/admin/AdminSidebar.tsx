"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  HelpCircle,
  Image,
  BarChart2,
  ExternalLink,
} from "lucide-react";

const navItems = [
  {
    label: "დეშბორდი",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "პროდუქტები",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "შეკვეთები",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "ბლოგი",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    label: "FAQ",
    href: "/admin/faq",
    icon: HelpCircle,
  },
  {
    label: "გალერეა",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    label: "ანალიტიკა",
    href: "/admin/analytics",
    icon: BarChart2,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-puff-dark text-cream-100 shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-earth-700/30">
        <h1 className="text-xl font-display font-bold text-cream-100 tracking-tight">
          Puffico
        </h1>
        <p className="text-xs text-puff-muted mt-0.5">ადმინ პანელი</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-earth-400/20 text-cream-100"
                  : "text-cream-300/70 hover:bg-white/5 hover:text-cream-100"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* View site link */}
      <div className="px-3 py-4 border-t border-earth-700/30">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream-300/60 hover:text-cream-100 hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={16} strokeWidth={1.8} />
          საიტის ნახვა
        </Link>
      </div>
    </aside>
  );
}
