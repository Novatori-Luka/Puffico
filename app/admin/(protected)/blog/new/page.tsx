import BlogForm from "@/components/admin/BlogForm";

export const metadata = { title: "ახალი პოსტი | Puffico Admin" };

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-puff-dark">ახალი პოსტი</h1>
        <p className="text-puff-muted text-sm mt-0.5">ბლოგ პოსტის შექმნა</p>
      </div>
      <BlogForm />
    </div>
  );
}
