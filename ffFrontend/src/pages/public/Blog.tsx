import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BlogCard } from "@/components/sections/BlogPreviewSection";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/apiClient";
import { fallbackBlog } from "@/lib/fallbackData";
import type { BlogPost } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

const Blog = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", page],
    queryFn: () => apiGet<BlogPost[]>("/blog", { page, limit: 6 }),
    staleTime: API_STALE_TIME,
  });
  const posts = !isError && data && data.length > 0 ? data : fallbackBlog;

  return (
    <>
      <PageHeader title="Our Blog" crumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => <BlogCard key={p.id} p={p} />)}
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mt-12">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button variant="outline" size="icon" onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;