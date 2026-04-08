import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "პროდუქტის დამატება | Puffico Admin" };

export default function NewProductPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-puff-dark">პროდუქტის დამატება</h1>
        <p className="text-puff-muted text-sm mt-0.5">შეავსეთ ველები და გამოაქვეყნეთ</p>
      </div>
      <ProductForm />
    </div>
  );
}
