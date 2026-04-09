import { getAdminGalleryItems } from "@/app/actions/gallery";
import GalleryManager from "@/components/admin/GalleryManager";

export const metadata = { title: "გალერეა | Puffico Admin" };

export default async function AdminGalleryPage() {
  const items = await getAdminGalleryItems();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-puff-dark">გალერეა</h1>
        <p className="text-puff-muted text-sm mt-0.5">
          სურათები და ვიდეოები ინახება Supabase Storage-ში (<code className="text-xs bg-sand-100 px-1 rounded">gallery</code> bucket)
        </p>
      </div>

      <GalleryManager items={items} />
    </div>
  );
}
