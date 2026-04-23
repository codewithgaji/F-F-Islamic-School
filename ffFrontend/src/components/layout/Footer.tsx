import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Facebook, Instagram, Linkedin, Twitter, Phone, Mail, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost } from "@/lib/apiClient";
import { fallbackSiteSettings } from "@/lib/fallbackData";
import type { SiteSettings } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

const newsletterSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
});
type NewsletterValues = z.infer<typeof newsletterSchema>;

export const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => apiGet<SiteSettings>("/site-settings"),
    staleTime: API_STALE_TIME,
  });
  const s = settings ?? fallbackSiteSettings;

  const { register, handleSubmit, reset, formState } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const subscribe = useMutation({
    mutationFn: (values: NewsletterValues) => apiPost("/newsletter/subscribe", values),
    onSuccess: () => {
      toast.success("Subscribed! Check your inbox soon.");
      reset();
    },
    onError: () => toast.error("Couldn't subscribe right now. Please try later."),
  });

  return (
    <footer className="bg-footer text-footer-foreground pt-16 pb-6 mt-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
              <Star className="w-5 h-5" />
            </span>
            <span className="font-display font-bold text-lg">F&amp;F Islamic Super Kiddies</span>
          </Link>
          <p className="text-sm text-footer-foreground/70 leading-relaxed mb-4">
            A primary school nurturing every child with faith, knowledge and character — in a warm, modern environment.
          </p>
          <div className="flex gap-2">
            {[
              { icon: Facebook, href: s.facebook ?? "#" },
              { icon: Twitter, href: s.twitter ?? "#" },
              { icon: Instagram, href: s.instagram ?? "#" },
              { icon: Linkedin, href: s.linkedin ?? "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid place-items-center w-9 h-9 rounded-full bg-footer-foreground/10 hover:bg-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-base">Contact</h4>
          <ul className="space-y-3 text-sm text-footer-foreground/80">
            <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>{s.address}</span></li>
            <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>{s.phone}</span></li>
            <li className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>{s.email}</span></li>
            <li className="flex gap-3"><Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>{s.opening_hours}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-base">Quick Links</h4>
          <ul className="space-y-2 text-sm text-footer-foreground/80">
            {[
              ["About Us", "/about"],
              ["Our Classes", "/classes"],
              ["Teachers", "/teachers"],
              ["Gallery", "/gallery"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-base">Newsletter</h4>
          <p className="text-sm text-footer-foreground/70 mb-4">
            Get school news and parenting tips in your inbox.
          </p>
          <form onSubmit={handleSubmit((v) => subscribe.mutate(v))} className="space-y-2">
            <Input
              placeholder="Your name"
              {...register("name")}
              className="bg-footer-foreground/10 border-footer-foreground/20 text-footer-foreground placeholder:text-footer-foreground/50"
            />
            {formState.errors.name && <p className="text-xs text-destructive">{formState.errors.name.message}</p>}
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="bg-footer-foreground/10 border-footer-foreground/20 text-footer-foreground placeholder:text-footer-foreground/50"
            />
            {formState.errors.email && <p className="text-xs text-destructive">{formState.errors.email.message}</p>}
            <Button type="submit" disabled={subscribe.isPending} className="w-full rounded-full">
              {subscribe.isPending ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-footer-foreground/10 mt-12 pt-6 container mx-auto text-center text-xs text-footer-foreground/60">
        © {new Date().getFullYear()} F&amp;F Islamic Super Kiddies Centre. All Rights Reserved.
      </div>
    </footer>
  );
};