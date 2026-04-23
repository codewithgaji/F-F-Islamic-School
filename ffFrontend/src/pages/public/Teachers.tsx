import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SchoolImage } from "@/components/SchoolImage";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { SkeletonCard } from "@/components/SkeletonCard";
import { apiGet } from "@/lib/apiClient";
import { fallbackTeachers } from "@/lib/fallbackData";
import type { Teacher } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

const Teachers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-teachers"],
    queryFn: () => apiGet<Teacher[]>("/teachers"),
    staleTime: API_STALE_TIME,
  });
  const teachers = !isError && data && data.length > 0 ? data : fallbackTeachers;

  return (
    <>
      <PageHeader title="Our Teachers" crumbs={[{ label: "Home", to: "/" }, { label: "Teachers" }]} />
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} className="h-72" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {teachers.map((t) => (
                <div key={t.id} className="text-center group">
                  <div className="relative mx-auto w-44 h-44 rounded-full overflow-hidden ring-4 ring-secondary group-hover:ring-primary transition-all">
                    <SchoolImage src={t.image_url} alt={t.name} className="w-full h-full" />
                    <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 bg-foreground/60 grid place-items-center">
                      <div className="flex gap-2">
                        {t.twitter && <a href={t.twitter} className="grid place-items-center w-9 h-9 rounded-full bg-primary-foreground text-primary"><Twitter className="w-4 h-4" /></a>}
                        {t.facebook && <a href={t.facebook} className="grid place-items-center w-9 h-9 rounded-full bg-primary-foreground text-primary"><Facebook className="w-4 h-4" /></a>}
                        {t.linkedin && <a href={t.linkedin} className="grid place-items-center w-9 h-9 rounded-full bg-primary-foreground text-primary"><Linkedin className="w-4 h-4" /></a>}
                      </div>
                    </motion.div>
                  </div>
                  <h3 className="mt-5 text-lg font-display font-semibold text-foreground">{t.name}</h3>
                  <p className="text-sm text-primary">{t.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <TestimonialsSection />
    </>
  );
};

export default Teachers;