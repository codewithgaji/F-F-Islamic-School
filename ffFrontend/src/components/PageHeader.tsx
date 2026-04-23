import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { IslamicPattern } from "./IslamicPattern";

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  title: string;
  crumbs?: Crumb[];
}

export const PageHeader = ({ title, crumbs }: Props) => (
  <header className="relative isolate overflow-hidden bg-primary text-primary-foreground py-20 md:py-28">
    <div className="absolute inset-0 opacity-20">
      <IslamicPattern variant="arabesque" />
    </div>
    <div className="relative container mx-auto text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">{title}</h1>
      {crumbs && (
        <nav className="flex items-center justify-center gap-2 text-sm text-primary-foreground/80">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {c.to ? (
                <Link to={c.to} className="hover:text-primary-foreground transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-primary-foreground">{c.label}</span>
              )}
              {i < crumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
            </span>
          ))}
        </nav>
      )}
    </div>
  </header>
);