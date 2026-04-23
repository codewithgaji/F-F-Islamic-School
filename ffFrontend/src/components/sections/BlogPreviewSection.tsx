import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { SectionTitle } from "@/components/SectionTitle";
import { SchoolImage } from "@/components/SchoolImage";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { apiGet } from "@/lib/apiClient";
import { fallbackBlog } from "@/lib/fallbackData";
import type { BlogPost } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

export const BlogCard = ({ p }: { p: BlogPost }) => (
  <article className="rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-soft transition-all group">
    <div className="aspect-[16/10] overflow-hidden">
      <SchoolImage src={p.image_url} alt={p.title} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-6">
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" />{format(new Date(p.created_at), "MMM d, yyyy")}</span>
        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-primary" />{p.comments_count}</span>
        <span className="ml-auto text-primary font-semibold uppercase tracking-wider">{p.category}</span>
      </div>
      <h3 className="text-lg font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        <Link to={`/blog/${p.id}`}>{p.title}</Link>
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{p.excerpt}</p>
      <Link to={`/blog/${p.id}`} className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
        Read More <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </article>
);

export const BlogPreviewSection = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog-preview"],
    queryFn: () => apiGet<BlogPost[]>("/blog-posts", { limit: 3 }),
    staleTime: API_STALE_TIME,
  });
  const posts = !isError && data && data.length > 0 ? data : fallbackBlog.slice(0, 3);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <SectionTitle label="Our Blog" title="Latest news & tips for parents" />
        {isLoading ? (
          <div className="mt-12"><SkeletonGrid count={3} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {posts.map((p) => <BlogCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </section>
  );
};