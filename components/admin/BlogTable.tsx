"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteBlogPost, toggleBlogPublished } from "@/app/actions/blog";
import { Pencil, Trash2, Eye, EyeOff, FileText } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
}

export default function BlogTable({ posts }: { posts: Post[] }) {
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("პოსტის წაშლა? ეს ქმედება შეუქცევადია.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteBlogPost(id);
      setDeletingId(null);
    });
  }

  if (posts.length === 0) {
    return (
      <div className="card p-16 text-center">
        <FileText size={40} className="mx-auto text-sand-300 mb-4" />
        <p className="text-puff-muted">პოსტები არ არსებობს.</p>
        <Link href="/admin/blog/new" className="btn-primary mt-4 inline-flex">
          პირველი პოსტის დამატება
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand-100 bg-cream-50">
              <th className="text-left px-4 py-3 font-medium text-puff-muted">სათაური</th>
              <th className="text-left px-4 py-3 font-medium text-puff-muted">კატეგორია</th>
              <th className="text-left px-4 py-3 font-medium text-puff-muted">სტატუსი</th>
              <th className="text-left px-4 py-3 font-medium text-puff-muted">თარიღი</th>
              <th className="text-right px-4 py-3 font-medium text-puff-muted">მოქმედება</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-cream-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-puff-dark line-clamp-1">{post.title}</p>
                  <p className="text-xs text-puff-muted font-mono">{post.slug}</p>
                </td>

                <td className="px-4 py-3">
                  {post.category && (
                    <span className="badge bg-sand-50 text-sand-600">{post.category}</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => startTransition(() => toggleBlogPublished(post.id, !post.isPublished))}
                    disabled={pending}
                    className={`badge gap-1 cursor-pointer transition-colors ${
                      post.isPublished
                        ? "bg-sage-50 text-sage-600 hover:bg-sage-100"
                        : "bg-sand-50 text-sand-600 hover:bg-sand-100"
                    }`}
                  >
                    {post.isPublished ? <Eye size={11} /> : <EyeOff size={11} />}
                    {post.isPublished ? "გამოქვეყნებული" : "დრაფტი"}
                  </button>
                </td>

                <td className="px-4 py-3 text-xs text-puff-muted whitespace-nowrap">
                  {(post.publishedAt ?? post.createdAt).toLocaleDateString("ka-GE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {post.isPublished && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-puff-muted hover:text-puff-dark hover:bg-cream-100 transition-colors"
                        title="საიტზე ნახვა"
                      >
                        <Eye size={15} />
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="p-1.5 rounded-lg text-puff-muted hover:text-earth-500 hover:bg-earth-50 transition-colors"
                      title="რედაქტირება"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="p-1.5 rounded-lg text-puff-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="წაშლა"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
