import { getAdminFaqItems } from "@/app/actions/faq";
import FaqManager from "@/components/admin/FaqManager";

export const metadata = { title: "FAQ | Puffico Admin" };

export default async function AdminFaqPage() {
  const items = await getAdminFaqItems();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-puff-dark">FAQ</h1>
        <p className="text-puff-muted text-sm mt-0.5">{items.length} კითხვა სულ</p>
      </div>

      <FaqManager items={items} />
    </div>
  );
}
