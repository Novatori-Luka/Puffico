"use client";

import { useRef, useState, useTransition } from "react";
import { uploadAndCreateGalleryItem, deleteGalleryItem } from "@/app/actions/gallery";
import { Upload, Trash2, Play, ImageIcon, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  url: string;
  alt: string | null;
  category: string;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
}

export default function GalleryManager({ items }: { items: GalleryItem[] }) {
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await uploadAndCreateGalleryItem(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "ატვირთვა ვერ მოხერხდა");
        break;
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDelete(id: string) {
    if (!confirm("ფაილის წაშლა?")) return;
    startTransition(() => deleteGalleryItem(id));
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-sand-200 rounded-2xl p-8 text-center cursor-pointer hover:border-earth-300 hover:bg-cream-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3 text-earth-400">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm font-medium">იტვირთება...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-puff-muted">
            <Upload size={32} className="text-sand-300" />
            <div>
              <p className="font-medium text-puff-dark text-sm">დააწექით ან გადმოიტანეთ ფაილები</p>
              <p className="text-xs mt-1">სურათები და ვიდეოები (JPG, PNG, WebP, MP4, WebM)</p>
            </div>
            <button type="button" className="btn-secondary py-2 px-5 text-sm">
              ფაილის არჩევა
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div className="card p-16 text-center">
          <ImageIcon size={40} className="mx-auto text-sand-300 mb-4" />
          <p className="text-puff-muted">გალერეა ცარიელია. ატვირთეთ პირველი ფაილი.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-puff-muted">{items.length} ფაილი</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((item) => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden bg-sand-50 aspect-square">
                {isVideo(item.url) ? (
                  <>
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/40 rounded-full p-2">
                        <Play size={18} className="text-white fill-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.alt ?? ""} className="w-full h-full object-cover" />
                )}

                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={pending}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="წაშლა"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
