import Link from "next/link";
import { TrendingUp, ShoppingBag, BarChart3, DollarSign } from "lucide-react";
import { getAnalyticsData, type Period } from "@/app/actions/analytics";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export const metadata = { title: "ანალიტიკა | Puffico Admin" };

const PERIODS: { label: string; value: Period }[] = [
  { label: "დღეს", value: "today" },
  { label: "კვირა", value: "week" },
  { label: "თვე", value: "month" },
  { label: "წელი", value: "year" },
];

interface PageProps {
  searchParams: { period?: string };
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-puff-muted">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
      <p className="text-2xl font-bold font-display text-puff-dark">{value}</p>
      {sub && <p className="text-xs text-puff-muted mt-1">{sub}</p>}
    </div>
  );
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const period = (searchParams.period as Period) ?? "month";
  const validPeriods: Period[] = ["today", "week", "month", "year"];
  const safePeriod: Period = validPeriods.includes(period) ? period : "month";

  const data = await getAnalyticsData(safePeriod);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header + period selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-puff-dark">ანალიტიკა</h1>
          <p className="text-puff-muted text-sm mt-0.5">გაყიდვებისა და შეკვეთების სტატისტიკა</p>
        </div>

        <div className="flex gap-1 bg-cream-100 rounded-xl p-1">
          {PERIODS.map((p) => (
            <Link
              key={p.value}
              href={`/admin/analytics?period=${p.value}`}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                safePeriod === p.value
                  ? "bg-puff-white text-puff-dark shadow-soft"
                  : "text-puff-muted hover:text-puff-dark"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={DollarSign}
          label="შემოსავალი"
          value={`₾${data.totalRevenue.toFixed(0)}`}
          color="bg-earth-50 text-earth-500"
        />
        <KpiCard
          icon={ShoppingBag}
          label="შეკვეთები"
          value={data.totalOrders.toString()}
          color="bg-blue-50 text-blue-500"
        />
        <KpiCard
          icon={TrendingUp}
          label="საშ. შეკვეთა"
          value={`₾${data.avgOrderValue.toFixed(0)}`}
          color="bg-sage-50 text-sage-600"
        />
        <KpiCard
          icon={BarChart3}
          label="პოპ. პროდუქტი"
          value={data.topProducts[0]?.units ? `${data.topProducts[0].units} ერთ.` : "—"}
          sub={data.topProducts[0]?.productName}
          color="bg-terracotta-50 text-terracotta-500"
        />
      </div>

      {/* Charts + tables */}
      <AnalyticsCharts
        days={data.days}
        topProducts={data.topProducts}
        recentOrders={data.recentOrders}
      />
    </div>
  );
}
