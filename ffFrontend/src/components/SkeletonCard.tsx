import { cn } from "@/lib/utils";

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl skeleton-shimmer h-64 w-full", className)} />
);

export const SkeletonGrid = ({ count = 3, className }: { count?: number; className?: string }) => (
  <div className={cn("grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);