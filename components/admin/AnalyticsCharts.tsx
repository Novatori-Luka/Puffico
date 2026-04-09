"use client";

interface DayData {
  date: string;
  revenue: number;
  count: number;
}

interface TopProduct {
  productId: string;
  productName: string;
  units: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  total: number;
  status: string;
  createdAt: Date;
  firstItem: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "მომლოდინე",
  CONFIRMED: "დადასტურებული",
  SHIPPED: "გაგზავნილი",
  DELIVERED: "მიტანილი",
  CANCELLED: "გაუქმებული",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-sage-100 text-sage-700",
  CANCELLED: "bg-red-100 text-red-600",
};

function LineChart({ days }: { days: DayData[] }) {
  const W = 600, H = 160;
  const pad = { t: 10, r: 10, b: 32, l: 56 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;

  const max = Math.max(...days.map((d) => d.revenue), 1);

  const pts = days.map((d, i) => {
    const x = pad.l + (days.length > 1 ? (i / (days.length - 1)) * iW : iW / 2);
    const y = pad.t + (1 - d.revenue / max) * iH;
    return [x, y] as [number, number];
  });

  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const areaPath =
    linePath +
    ` L ${pts[pts.length - 1]?.[0].toFixed(1)} ${(H - pad.b).toFixed(1)}` +
    ` L ${pts[0]?.[0].toFixed(1)} ${(H - pad.b).toFixed(1)} Z`;

  // Y axis ticks
  const yTicks = [0, max / 2, max].map((v) => ({
    v,
    y: pad.t + (1 - v / max) * iH,
  }));

  // X axis labels — show at most 7
  const step = Math.max(1, Math.ceil(days.length / 7));
  const xLabels = days.filter((_, i) => i % step === 0 || i === days.length - 1);

  if (days.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-puff-muted text-sm">
        მონაცემები არ არის
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6F47" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8B6F47" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map(({ y }, i) => (
        <line key={i} x1={pad.l} y1={y.toFixed(1)} x2={W - pad.r} y2={y.toFixed(1)} stroke="#E8DFD0" strokeWidth="1" />
      ))}

      <path d={areaPath} fill="url(#revGrad)" />
      <path d={linePath} fill="none" stroke="#8B6F47" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {pts.map(([x, y], i) =>
        days[i].revenue > 0 ? (
          <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3" fill="#8B6F47" />
        ) : null
      )}

      {yTicks.map(({ v, y }, i) => (
        <text key={i} x={(pad.l - 5).toFixed(0)} y={(y + 4).toFixed(0)} textAnchor="end" fontSize="10" fill="#9CA3AF">
          ₾{v.toFixed(0)}
        </text>
      ))}

      {xLabels.map((d) => {
        const idx = days.indexOf(d);
        const x = pad.l + (days.length > 1 ? (idx / (days.length - 1)) * iW : iW / 2);
        return (
          <text key={d.date} x={x.toFixed(1)} y={(H - 5).toFixed(0)} textAnchor="middle" fontSize="10" fill="#9CA3AF">
            {d.date.slice(5)}
          </text>
        );
      })}
    </svg>
  );
}

function BarChart({ days }: { days: DayData[] }) {
  const W = 600, H = 160;
  const pad = { t: 10, r: 10, b: 32, l: 40 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;

  const max = Math.max(...days.map((d) => d.count), 1);
  const barW = Math.max(2, iW / days.length - 2);

  const step = Math.max(1, Math.ceil(days.length / 7));
  const xLabels = days.filter((_, i) => i % step === 0 || i === days.length - 1);

  if (days.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-puff-muted text-sm">
        მონაცემები არ არის
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      {[0, max / 2, max].map((v, i) => {
        const y = pad.t + (1 - v / max) * iH;
        return <line key={i} x1={pad.l} y1={y.toFixed(1)} x2={W - pad.r} y2={y.toFixed(1)} stroke="#E8DFD0" strokeWidth="1" />;
      })}

      {days.map((d, i) => {
        const barH = Math.max(0, (d.count / max) * iH);
        const x = pad.l + (i / days.length) * iW + (iW / days.length - barW) / 2;
        const y = pad.t + iH - barH;
        return (
          <rect key={d.date} x={x.toFixed(1)} y={y.toFixed(1)} width={barW.toFixed(1)} height={Math.max(0, barH).toFixed(1)}
            fill="#8B6F47" rx="2" opacity="0.75" />
        );
      })}

      {[0, max].map((v, i) => {
        const y = i === 0 ? pad.t + iH : pad.t;
        return (
          <text key={i} x={(pad.l - 5).toFixed(0)} y={(y + 4).toFixed(0)} textAnchor="end" fontSize="10" fill="#9CA3AF">
            {v.toFixed(0)}
          </text>
        );
      })}

      {xLabels.map((d) => {
        const idx = days.indexOf(d);
        const x = pad.l + (idx / days.length) * iW + iW / days.length / 2;
        return (
          <text key={d.date} x={x.toFixed(1)} y={(H - 5).toFixed(0)} textAnchor="middle" fontSize="10" fill="#9CA3AF">
            {d.date.slice(5)}
          </text>
        );
      })}
    </svg>
  );
}

interface Props {
  days: DayData[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

export default function AnalyticsCharts({ days, topProducts, recentOrders }: Props) {
  return (
    <div className="space-y-6">
      {/* Revenue chart */}
      <div className="card p-6">
        <h2 className="font-semibold text-puff-dark mb-4">შემოსავალი დროის მიხედვით</h2>
        <LineChart days={days} />
      </div>

      {/* Orders chart */}
      <div className="card p-6">
        <h2 className="font-semibold text-puff-dark mb-4">შეკვეთები დროის მიხედვით</h2>
        <BarChart days={days} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="card p-6">
          <h2 className="font-semibold text-puff-dark mb-4">პოპულარული პროდუქტები</h2>
          {topProducts.length === 0 ? (
            <p className="text-puff-muted text-sm py-8 text-center">შეკვეთები არ არის</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-puff-muted w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-puff-dark truncate">{p.productName}</p>
                    <p className="text-xs text-puff-muted">{p.units} ერთ.</p>
                  </div>
                  <span className="text-sm font-semibold text-puff-dark shrink-0">
                    ₾{p.revenue.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="card p-6">
          <h2 className="font-semibold text-puff-dark mb-4">ბოლო შეკვეთები</h2>
          {recentOrders.length === 0 ? (
            <p className="text-puff-muted text-sm py-8 text-center">შეკვეთები არ არის</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-puff-dark truncate">
                      {o.firstName} {o.lastName}
                    </p>
                    <p className="text-xs text-puff-muted truncate">{o.firstItem}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge text-xs ${STATUS_COLORS[o.status] ?? "bg-sand-100 text-puff-muted"}`}>
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                    <span className="text-sm font-semibold text-puff-dark">₾{o.total.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
