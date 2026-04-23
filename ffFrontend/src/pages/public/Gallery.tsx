import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SchoolImage } from "@/components/SchoolImage";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { apiGet } from "@/lib/apiClient";
import { fallbackGallery, fallbackGalleryCategories } from "@/lib/fallbackData";
import type { GalleryCategory, GalleryImage } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";
import { cn } from "@/lib/utils";

const Gallery = () => {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const { data: cats } = useQuery({
    queryKey: ["gallery-cats"],
    queryFn: () => apiGet<GalleryCategory[]>("/gallery/categories"),
    staleTime: API_STALE_TIME,
  });
  const categories = cats && cats.length > 0 ? cats : fallbackGalleryCategories;

  const { data: images, isLoading, isError } = useQuery({
    queryKey: ["gallery", filter],
    queryFn: () => apiGet<GalleryImage[]>("/gallery", { category: filter }),
    staleTime: API_STALE_TIME,
  });
  const items = !isError && images && images.length > 0
    ? images
    : fallbackGallery.filter((g) => filter === "all" || g.category === filter);

  return (
    <>
      <PageHeader title="Gallery" crumbs={[{ label: "Home", to: "/" }, { label: "Gallery" }]} />
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c.filter_key}
                onClick={() => setFilter(c.filter_key)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold transition-all border",
                  filter === c.filter_key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {items.map((img, i) => (
                  <motion.button
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setLightbox(img)}
                    className={cn(
                      "relative overflow-hidden rounded-xl group",
                      i % 5 === 0 ? "aspect-square md:row-span-2 md:aspect-[3/4]" : "aspect-square"
                    )}
                  >
                    <SchoolImage src={img.image_url} alt={`Gallery ${img.id}`} className="w-full h-full group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors" />
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-foreground/90 grid place-items-center p-4"
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-primary-foreground text-foreground">
              <X className="w-5 h-5" />
            </button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-4xl w-full aspect-video rounded-2xl overflow-hidden">
              <SchoolImage src={lightbox.image_url} alt={`Gallery ${lightbox.id}`} className="w-full h-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;