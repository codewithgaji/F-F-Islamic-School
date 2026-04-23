import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { ClassCard } from "@/components/sections/ClassCard";
import { BookSeatSection } from "@/components/sections/BookSeatSection";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { ErrorState } from "@/components/ErrorState";
import { apiGet } from "@/lib/apiClient";
import { fallbackClasses } from "@/lib/fallbackData";
import type { SchoolClass } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

const Classes = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-classes"],
    queryFn: () => apiGet<SchoolClass[]>("/classes"),
    staleTime: API_STALE_TIME,
  });
  const classes = !isError && data && data.length > 0 ? data : fallbackClasses;

  return (
    <>
      <PageHeader title="Our Classes" crumbs={[{ label: "Home", to: "/" }, { label: "Classes" }]} />
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : isError && (!data || data.length === 0) ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((c) => <ClassCard key={c.id} c={c} />)}
            </div>
          )}
        </div>
      </section>
      <BookSeatSection />
    </>
  );
};

export default Classes;