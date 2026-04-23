import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar, MessageCircle, User, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SchoolImage } from "@/components/SchoolImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost } from "@/lib/apiClient";
import { fallbackBlog } from "@/lib/fallbackData";
import type { BlogPost, BlogComment } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

const commentSchema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email"),
  website: z.string().trim().url("Invalid URL").max(255).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Required").max(1000),
});
type CommentValues = z.infer<typeof commentSchema>;

const fallbackPost = (id: string): BlogPost => {
  const found = fallbackBlog.find((p) => String(p.id) === id) ?? fallbackBlog[0];
  return {
    ...found,
    content_html: `<p>${found.excerpt}</p><p>This is placeholder content shown when the backend is not yet connected. Real article content from the FastAPI <code>/blog-posts/${found.id}</code> endpoint will appear here.</p><h3>Why this matters</h3><p>At F&amp;F Islamic Super Kiddies Centre, we believe every child deserves a learning environment that nurtures both faith and curiosity.</p>`,
    author_bio: "Educator and parent passionate about early childhood development.",
    author_image_url: "",
    tags: ["Parenting", "Faith", "Learning", "Children"],
  };
};

const BlogDetail = () => {
  const { id = "1" } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isError } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => apiGet<BlogPost>(`/blog-posts/${id}`),
    staleTime: API_STALE_TIME,
  });
  const post = !isError && data ? data : fallbackPost(id);

  const { data: relatedRaw } = useQuery({
    queryKey: ["related", id],
    queryFn: () => apiGet<BlogPost[]>(`/blog-posts/${id}/related`),
    staleTime: API_STALE_TIME,
  });
  const related = relatedRaw && relatedRaw.length > 0 ? relatedRaw : fallbackBlog.slice(0, 4);

  const { data: commentsRaw } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => apiGet<BlogComment[]>(`/blog-posts/${id}/comments`),
    staleTime: API_STALE_TIME,
  });
  const comments: BlogComment[] = commentsRaw && commentsRaw.length > 0 ? commentsRaw : [
    { id: 1, author_name: "Aminah K.", created_at: new Date().toISOString(), content: "Beautifully written — thank you!", replies: [{ id: 2, author_name: "Editor", created_at: new Date().toISOString(), content: "Thanks for reading, Aminah!" }] },
    { id: 3, author_name: "Bilal A.", created_at: new Date().toISOString(), content: "Such helpful tips, jazakallah khair." },
  ];

  const { data: cats } = useQuery({
    queryKey: ["blog-cats"],
    queryFn: () => apiGet<{ id: number; name: string; slug: string; count?: number }[]>("/blog-categories"),
    staleTime: API_STALE_TIME,
  });
  const categories = cats && cats.length > 0 ? cats : ["Parenting", "Faith", "Wellness", "Education", "School Life"].map((n, i) => ({ id: i, name: n, slug: n.toLowerCase() }));

  const { data: recent } = useQuery({
    queryKey: ["recent"],
    queryFn: () => apiGet<BlogPost[]>("/blog-posts", { limit: 3, sort: "newest" }),
    staleTime: API_STALE_TIME,
  });
  const recentPosts = recent && recent.length > 0 ? recent : fallbackBlog.slice(0, 3);

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => apiGet<string[]>("/blog-tags"),
    staleTime: API_STALE_TIME,
  });
  const tagList = tags && tags.length > 0 ? tags : ["Children", "Faith", "Parenting", "Learning", "Quran", "Health", "Play"];

  const [relIndex, setRelIndex] = useState(0);

  const { register, handleSubmit, reset, formState } = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
  });
  const submitComment = useMutation({
    mutationFn: (v: CommentValues) => apiPost(`/blog-posts/${id}/comments`, v),
    onSuccess: () => { toast.success("Comment submitted!"); reset(); },
    onError: () => toast.message("Backend not yet connected — comment saved locally for preview."),
  });

  return (
    <>
      <PageHeader title={post.title} crumbs={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }, { label: "Article" }]} />
      <section className="py-16 bg-background">
        <div className="container mx-auto grid lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
              <SchoolImage src={post.image_url} alt={post.title} className="w-full h-full" />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-primary" />{post.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" />{format(new Date(post.created_at), "MMM d, yyyy")}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-primary" />{post.comments_count} comments</span>
              <span className="ml-auto text-xs uppercase tracking-wider text-primary font-semibold">{post.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">{post.title}</h1>
            <div
              className="prose prose-lg max-w-none text-foreground prose-headings:font-display prose-headings:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content_html ?? "") }}
            />

            {/* Related */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-semibold">Related posts</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setRelIndex((i) => Math.max(0, i - 1))}><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setRelIndex((i) => Math.min(related.length - 1, i + 1))}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="flex gap-4 transition-transform duration-500" style={{ transform: `translateX(-${relIndex * 50}%)` }}>
                  {related.map((r) => (
                    <Link key={r.id} to={`/blog/${r.id}`} className="min-w-[calc(50%-0.5rem)] rounded-xl overflow-hidden border border-border bg-card group">
                      <div className="aspect-[16/10]"><SchoolImage src={r.image_url} alt={r.title} className="w-full h-full group-hover:scale-105 transition-transform" /></div>
                      <div className="p-4">
                        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{r.category}</p>
                        <h4 className="font-display font-semibold text-foreground line-clamp-2">{r.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-16">
              <h3 className="text-2xl font-display font-semibold mb-6">Comments ({comments.length})</h3>
              <ul className="space-y-6">
                {comments.map((c) => <CommentItem key={c.id} c={c} />)}
              </ul>

              <form onSubmit={handleSubmit((v) => submitComment.mutate(v))} className="mt-10 bg-card rounded-2xl border border-border p-6 space-y-4">
                <h4 className="text-xl font-display font-semibold">Leave a comment</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="c-name">Name</Label>
                    <Input id="c-name" {...register("name")} />
                    {formState.errors.name && <p className="text-xs text-destructive mt-1">{formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="c-email">Email</Label>
                    <Input id="c-email" type="email" {...register("email")} />
                    {formState.errors.email && <p className="text-xs text-destructive mt-1">{formState.errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="c-website">Website (optional)</Label>
                  <Input id="c-website" {...register("website")} />
                </div>
                <div>
                  <Label htmlFor="c-msg">Comment</Label>
                  <Textarea id="c-msg" rows={4} {...register("message")} />
                  {formState.errors.message && <p className="text-xs text-destructive mt-1">{formState.errors.message.message}</p>}
                </div>
                <Button type="submit" className="rounded-full" disabled={submitComment.isPending}>
                  {submitComment.isPending ? "Posting…" : "Post Comment"}
                </Button>
              </form>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Author */}
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-background">
                <SchoolImage src={post.author_image_url} alt={post.author} className="w-full h-full" />
              </div>
              <h4 className="font-display font-semibold mt-4">{post.author}</h4>
              <p className="text-sm text-muted-foreground mt-2">{post.author_bio ?? "Contributor at F&F Islamic Super Kiddies Centre."}</p>
            </div>

            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (search.trim()) navigate(`/blog?search=${encodeURIComponent(search.trim())}`);
              }}
              className="relative"
            >
              <Input placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"><Search className="w-4 h-4" /></button>
            </form>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h4 className="font-display font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link to={`/blog?category=${c.slug}`} className="flex justify-between text-sm text-muted-foreground hover:text-primary">
                      <span>{c.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h4 className="font-display font-semibold mb-4">Recent posts</h4>
              <ul className="space-y-4">
                {recentPosts.map((r) => (
                  <li key={r.id}>
                    <Link to={`/blog/${r.id}`} className="flex gap-3 group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <SchoolImage src={r.image_url} alt={r.title} className="w-full h-full" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</p>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary line-clamp-2">{r.title}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h4 className="font-display font-semibold mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tagList.map((t) => (
                  <Link key={t} to={`/blog?tag=${t}`} className="px-3 py-1 rounded-full text-xs border border-border hover:border-primary hover:text-primary text-muted-foreground">
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

const CommentItem = ({ c }: { c: BlogComment }) => (
  <li className="bg-card rounded-xl border border-border p-5">
    <div className="flex items-center justify-between mb-2">
      <h5 className="font-semibold text-foreground">{c.author_name}</h5>
      <span className="text-xs text-muted-foreground">{format(new Date(c.created_at), "MMM d, yyyy")}</span>
    </div>
    <p className="text-sm text-muted-foreground mb-2">{c.content}</p>
    <button className="text-xs font-semibold text-primary">Reply</button>
    {c.replies && c.replies.length > 0 && (
      <ul className="mt-4 ml-6 pl-4 border-l-2 border-border space-y-3">
        {c.replies.map((r) => <CommentItem key={r.id} c={r} />)}
      </ul>
    )}
  </li>
);

export default BlogDetail;