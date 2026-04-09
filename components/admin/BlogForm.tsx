"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/app/actions/blog";
import { RefreshCw, Bold, Italic, Link2, ImageIcon, List } from "lucide-react";

interface ExistingPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  isPublished: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-").trim();
}

const TABS = ["ძირითადი", "შინაარსი", "სეო"] as const;
type Tab = (typeof TABS)[number];

const CATEGORIES = ["ინტერიერი", "მასალები", "ხელნაკეთი", "ლაიფსტაილი", "სიახლეები"];

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrap(before: string, after: string) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || "ტექსტი";
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }

  function insert(text: string) {
    const ta = ref.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const next = value.slice(0, pos) + "\n" + text + "\n" + value.slice(pos);
    onChange(next);
    setTimeout(() => ta.focus(), 0);
  }

  function handleLink() {
    const url = window.prompt("ბმულის მისამართი (URL):");
    if (!url) return;
    wrap(`<a href="${url}">`, "</a>");
  }

  function handleImage() {
    const url = window.prompt("სურათის URL:");
    if (!url) return;
    insert(`<img src="${url}" alt="" />`);
  }

  const btnClass =
    "p-1.5 rounded text-puff-muted hover:text-puff-dark hover:bg-sand-100 transition-colors text-xs font-semibold";

  return (
    <div className="border border-sand-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-0.5 p-2 border-b border-sand-100 bg-cream-50 flex-wrap">
        <button type="button" onClick={() => wrap("<h2>", "</h2>")} className={btnClass} title="სათაური H2">H2</button>
        <button type="button" onClick={() => wrap("<h3>", "</h3>")} className={btnClass} title="სათაური H3">H3</button>
        <div className="w-px h-4 bg-sand-200 mx-1" />
        <button type="button" onClick={() => wrap("<strong>", "</strong>")} className={btnClass} title="სქელი">
          <Bold size={13} />
        </button>
        <button type="button" onClick={() => wrap("<em>", "</em>")} className={btnClass} title="დახრილი">
          <Italic size={13} />
        </button>
        <div className="w-px h-4 bg-sand-200 mx-1" />
        <button type="button" onClick={() => wrap("<ul>\n<li>", "</li>\n</ul>")} className={btnClass} title="სია">
          <List size={13} />
        </button>
        <button type="button" onClick={handleLink} className={btnClass} title="ბმული">
          <Link2 size={13} />
        </button>
        <button type="button" onClick={handleImage} className={btnClass} title="სურათი">
          <ImageIcon size={13} />
        </button>
        <div className="w-px h-4 bg-sand-200 mx-1" />
        <span className="text-xs text-puff-muted ml-1">HTML</span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={22}
        className="w-full p-4 font-mono text-sm resize-y outline-none bg-white text-puff-dark leading-relaxed"
        placeholder="<p>შინაარსი HTML ფორმატში...</p>"
      />
      <div className="border-t border-sand-100 px-4 py-2 bg-cream-50 text-xs text-puff-muted">
        {value.length} სიმბოლო · გამოიყენეთ ზემოთ მოცემული ღილაკები ფორმატირებისთვის
      </div>
    </div>
  );
}

export default function BlogForm({ post }: { post?: ExistingPost }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>("ძირითადი");
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? false);
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(post?.metaDesc ?? "");

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!post) setSlug(slugify(v));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError("სათაური და შინაარსი სავალდებულოა.");
      return;
    }
    startTransition(async () => {
      try {
        const data = { title, slug: slug || slugify(title), content, excerpt, coverImage, category, isPublished, metaTitle, metaDesc };
        if (post) {
          await updateBlogPost(post.id, data);
        } else {
          await createBlogPost(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "შეცდომა. სცადეთ თავიდან.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-sand-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-earth-500 border-b-2 border-earth-400 -mb-px"
                : "text-puff-muted hover:text-puff-dark"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── ძირითადი ─────────────────────────────────────────────────── */}
      {activeTab === "ძირითადი" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-puff-dark">ძირითადი ინფო</h2>
              <div>
                <label className="field-label">სათაური *</label>
                <input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input-field"
                  placeholder="პოსტის სათაური ქართულად"
                  required
                />
              </div>
              <div>
                <label className="field-label">Slug (URL)</label>
                <div className="flex gap-2">
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input-field font-mono text-sm"
                    placeholder="post-slug"
                  />
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(title))}
                    className="btn-ghost px-3 shrink-0"
                    title="სლაგის განახლება"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>
              <div>
                <label className="field-label">მოკლე აღწერა (excerpt)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="1–2 წინადადება პოსტის შესახებ"
                />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-puff-dark">გარეკანი და კატეგორია</h2>
              <div>
                <label className="field-label">სათაური სურათის URL</label>
                <input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="input-field text-sm"
                  placeholder="https://..."
                />
              </div>
              {coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage} alt="preview" className="w-full max-h-48 rounded-xl object-cover" />
              )}
              <div>
                <label className="field-label">კატეგორია</label>
                <div className="flex gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">-- აირჩიეთ --</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    value={CATEGORIES.includes(category) ? "" : category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field text-sm"
                    placeholder="ან შეიყვანეთ ახალი"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4 h-fit">
            <h2 className="font-semibold text-puff-dark">გამოქვეყნება</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded accent-earth-400"
              />
              <span className="text-sm text-puff-dark">გამოქვეყნებული</span>
            </label>
            <p className="text-xs text-puff-muted">
              {isPublished
                ? "პოსტი ხილული იქნება /blog-ზე"
                : "პოსტი შენახული იქნება დრაფტად"}
            </p>
          </div>
        </div>
      )}

      {/* ─── შინაარსი ─────────────────────────────────────────────────── */}
      {activeTab === "შინაარსი" && (
        <div className="space-y-3">
          <p className="text-xs text-puff-muted">
            შინაარსი ინახება HTML ფორმატში. გამოიყენეთ ზემოთ მოცემული ღილაკები ფორმატირებისთვის.
          </p>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      )}

      {/* ─── სეო ──────────────────────────────────────────────────────── */}
      {activeTab === "სეო" && (
        <div className="card p-6 space-y-4 max-w-2xl">
          <h2 className="font-semibold text-puff-dark">SEO მეტა-ტეგები</h2>
          <div>
            <label className="field-label">Meta Title</label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="input-field"
              placeholder={title || "პოსტის სათაური | Puffico"}
            />
            <p className="text-xs text-puff-muted mt-1">{metaTitle.length}/60</p>
          </div>
          <div>
            <label className="field-label">Meta Description</label>
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="SEO აღწერა..."
            />
            <p className={`text-xs mt-1 ${metaDesc.length > 160 ? "text-red-500" : "text-puff-muted"}`}>
              {metaDesc.length}/160
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
          {isPending ? "ინახება..." : post ? "ცვლილებების შენახვა" : "პოსტის დამატება"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          გაუქმება
        </button>
      </div>
    </form>
  );
}
