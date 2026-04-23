import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { SchoolImage } from "@/components/SchoolImage";
import { apiGet } from "@/lib/apiClient";
import { fallbackTestimonials } from "@/lib/fallbackData";
import type { Testimonial } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

function useResponsivePerView() {
  const [pv, setPv] = useState(typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 1);
  useEffect(() => {
    const onResize = () => setPv(window.innerWidth >= 1024 ? 3 : 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return pv;
}

export const TestimonialsSection = () => {
  const { data, isError } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => apiGet<Testimonial[]>("/testimonials"),
    staleTime: API_STALE_TIME,
  });
  const items = !isError && data && data.length > 0 ? data : fallbackTestimonials;
  const perView = useResponsivePerView();
  const pages = Math.max(1, Math.ceil(items.length / perView));
  const [page, setPage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPage((p) => (p + 1) % pages), 5000);
    return () => clearInterval(id);
  }, [pages]);

  const visible = items.slice(page * perView, page * perView + perView);

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto">
        <SectionTitle label="Testimonials" title="What parents say about us" />
        <div className="mt-12 relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`grid gap-6 ${perView === 1 ? "" : "grid-cols-1 md:grid-cols-3"}`}
            >
              {visible.map((t) => (
                <article key={t.id} className="bg-card rounded-2xl p-6 shadow-card border border-border">
                  <Quote className="w-8 h-8 text-primary mb-3" />
                  <p className="text-foreground leading-relaxed mb-5">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <SchoolImage src={t.image_url} alt={t.parent_name} className="w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{t.parent_name}</h4>
                      <p className="text-xs text-muted-foreground">{t.profession}</p>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === page ? "w-8 bg-primary" : "w-2 bg-primary/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};