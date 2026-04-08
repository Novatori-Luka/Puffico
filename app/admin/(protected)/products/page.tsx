import Link from "next/link";
import { getProducts } from "@/app/actions/products";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/admin/ProductsTable";

export const metadata = { title: "პროდუქტები | Puffico Admin" };

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-puff-dark">პროდუქტები</h1>
          <p className="text-puff-muted text-sm mt-0.5">{products.length} პროდუქტი სულ</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} />
          პროდუქტის დამატება
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
