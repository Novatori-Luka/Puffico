import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminBlogPosts } from "@/app/actions/blog";
import BlogTable from "@/components/admin/BlogTable";

export const metadata = { title: "ბლოგი | Puffico Admin" };

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-puff-dark">ბლოგი</h1>
          <p className="text-puff-muted text-sm mt-0.5">{posts.length} პოსტი სულ</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary">
          <Plus size={16} />
          პოსტის დამატება
        </Link>
      </div>

      <BlogTable posts={posts} />
    </div>
  );
}
