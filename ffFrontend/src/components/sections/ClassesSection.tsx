import { useQuery } from "@tanstack/react-query";
import { SectionTitle } from "@/components/SectionTitle";
import { ClassCard } from "./ClassCard";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { apiGet } from "@/lib/apiClient";
import { fallbackClasses } from "@/lib/fallbackData";
import type { SchoolClass } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

interface Props {
  featuredOnly?: boolean;
  limit?: number;
}

export const ClassesSection = ({ featuredOnly = true, limit = 3 }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["classes", { featuredOnly, limit }],
    queryFn: () => apiGet<SchoolClass[]>("/classes", featuredOnly ? { featured: true, limit } : { limit }),
    staleTime: API_STALE_TIME,
  });
  const classes = !isError && data && data.length > 0
    ? data
    : (featuredOnly ? fallbackClasses.filter((c) => c.is_featured) : fallbackClasses).slice(0, limit);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <SectionTitle label="Our Classes" title="Popular classes for your kids" />
        {isLoading ? (
          <div className="mt-12"><SkeletonGrid count={3} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {classes.map((c) => (
              <ClassCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};