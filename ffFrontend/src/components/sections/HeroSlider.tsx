import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/apiClient";
import { fallbackHero } from "@/lib/fallbackData";
import { API_STALE_TIME } from "@/config/api";
import type { HeroSlide } from "@/types/api";
import { IslamicPattern } from "@/components/IslamicPattern";
import { SchoolImage } from "@/components/SchoolImage";

export const HeroSlider = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: () => apiGet<HeroSlide[]>("/hero-slides"),
    staleTime: API_STALE_TIME,
  });
  const slides = !isError && data && data.length > 0 ? data : fallbackHero;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  const go = (n: number) => setIndex(((n % slides.length) + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <section className="relative isolate h-[80vh] min-h-[520px] max-h-[760px] overflow-hidden bg-secondary">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {slide.image_url ? (
            <SchoolImage src={slide.image_url} alt={slide.caption} className="w-full h-full" />
          ) : (
            <IslamicPattern variant={index % 2 === 0 ? "star" : "crescent"} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "-text"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-2xl text-primary-foreground"
          >
            <span className="inline-block uppercase tracking-[0.25em] text-xs font-semibold text-accent mb-4">
              Welcome to F&amp;F Islamic Super Kiddies
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4">
              {slide.caption}
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/85 max-w-xl mb-8">{slide.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/about">Learn More</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
                <Link to="/contact">Enroll Now</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-full bg-primary-foreground/15 hover:bg-primary text-primary-foreground backdrop-blur transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-full bg-primary-foreground/15 hover:bg-primary text-primary-foreground backdrop-blur transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-primary" : "w-2 bg-primary-foreground/60"}`}
          />
        ))}
      </div>
      {isLoading && <span className="sr-only">Loading slides…</span>}
    </section>
  );
};