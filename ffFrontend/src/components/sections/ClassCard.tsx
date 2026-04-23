import { Link } from "react-router-dom";
import { Users, Clock, Tag, BookOpen } from "lucide-react";
import { SchoolImage } from "@/components/SchoolImage";
import { Button } from "@/components/ui/button";
import type { SchoolClass } from "@/types/api";

export const ClassCard = ({ c }: { c: SchoolClass }) => (
  <article className="group rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-soft transition-all border border-border">
    <div className="aspect-[4/3] overflow-hidden">
      <SchoolImage
        src={c.image_url}
        alt={c.title}
        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">{c.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{c.description}</p>
      <dl className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-5 border-t border-border pt-4">
        <div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-primary" /> Age: <strong className="text-foreground font-semibold">{c.age_range}</strong></div>
        <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-primary" /> Seats: <strong className="text-foreground font-semibold">{c.total_seats}</strong></div>
        <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary" /> Time: <strong className="text-foreground font-semibold">{c.class_time}</strong></div>
        <div className="flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-primary" /> Fee: <strong className="text-foreground font-semibold">{c.monthly_fee}</strong></div>
      </dl>
      <Button asChild className="w-full rounded-full">
        <Link to="/contact">Join Now</Link>
      </Button>
    </div>
  </article>
);