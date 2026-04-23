import { useQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { apiGet } from "@/lib/apiClient";
import { fallbackFacilities } from "@/lib/fallbackData";
import type { Facility } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

export const FacilitiesSection = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["facilities"],
    queryFn: () => apiGet<Facility[]>("/facilities"),
    staleTime: API_STALE_TIME,
  });
  const items = !isError && data && data.length > 0 ? data : fallbackFacilities;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <SectionTitle label="What We Offer" title="Wonderful facilities for your kids" />
        {isLoading ? (
          <div className="mt-12">
            <SkeletonGrid count={6} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {items.map((f) => {
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[f.icon_name] ?? Icons.Sparkles;
              return (
                <div
                  key={f.id}
                  className="group relative rounded-xl bg-card border-t-4 border-primary shadow-card p-6 hover:shadow-soft hover:-translate-y-1 transition-all"
                >
                  <div className="grid place-items-center w-14 h-14 rounded-full bg-secondary text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};