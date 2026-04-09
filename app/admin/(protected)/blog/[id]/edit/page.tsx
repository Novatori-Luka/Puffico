import { notFound } from "next/navigation";
import { getAdminBlogPost } from "@/app/actions/blog";
import BlogForm from "@/components/admin/BlogForm";

export const metadata = { title: "პოსტის რედაქტირება | Puffico Admin" };

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getAdminBlogPost(params.id);
  if (!post) notFound();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-puff-dark">პოსტის რედაქტირება</h1>
        <p className="text-puff-muted text-sm mt-0.5 truncate max-w-md">{post.title}</p>
      </div>
      <BlogForm post={post} />
    </div>
  );
}
