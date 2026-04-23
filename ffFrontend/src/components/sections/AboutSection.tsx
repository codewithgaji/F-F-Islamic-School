import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTitle } from "@/components/SectionTitle";
import { SchoolImage } from "@/components/SchoolImage";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/apiClient";
import { fallbackAbout } from "@/lib/fallbackData";
import type { AboutContent } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

interface Props {
  endpoint?: string;
  showCta?: boolean;
}

export const AboutSection = ({ endpoint = "/about-preview", showCta = true }: Props) => {
  const { data, isError } = useQuery({
    queryKey: ["about", endpoint],
    queryFn: () => apiGet<AboutContent>(endpoint),
    staleTime: API_STALE_TIME,
  });
  const content = !isError && data ? data : fallbackAbout;
  const mainImage = content.main_image_url || content.image_url;

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <SchoolImage
            src={mainImage}
            alt={content.title}
            className="w-full aspect-[4/5] rounded-2xl shadow-card"
            patternVariant="star"
          />
          {content.secondary_image_url !== undefined && (
            <div className="hidden md:block absolute -bottom-8 -right-6 w-48 h-48 rounded-2xl overflow-hidden shadow-soft border-4 border-background">
              <SchoolImage src={content.secondary_image_url} alt="" className="w-full h-full" patternVariant="crescent" />
            </div>
          )}
        </div>
        <div>
          <SectionTitle label="Learn About Us" title={content.title} align="left" />
          <p className="mt-6 text-muted-foreground leading-relaxed">{content.description}</p>
          <ul className="mt-6 space-y-3">
            {content.bullet_points.map((b, i) => (
              <li key={i} className="flex gap-3 text-foreground">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-primary text-primary-foreground shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {showCta && (
            <Button asChild size="lg" className="rounded-full mt-8">
              <Link to="/about">Discover More</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};