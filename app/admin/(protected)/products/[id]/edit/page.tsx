import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "პროდუქტის რედაქტირება | Puffico Admin" };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
      },
    });
  } catch {
    // DB not connected
  }

  if (!product) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-puff-dark">პროდუქტის რედაქტირება</h1>
        <p className="text-puff-muted text-sm mt-0.5">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
