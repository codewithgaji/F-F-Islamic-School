import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "star" | "crescent" | "arabesque";
  label?: string;
}

/**
 * Inline SVG placeholder using an Islamic-inspired motif.
 * Used when no image is provided or fails to load.
 */
export const IslamicPattern = ({ className, variant = "arabesque", label }: Props) => {
  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-warm",
        className
      )}
      role="img"
      aria-label={label ?? "Islamic geometric pattern"}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full opacity-25 text-primary-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <defs>
          <pattern id="iz" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon points="20,2 24,16 38,16 27,24 31,38 20,30 9,38 13,24 2,16 16,16" />
            <circle cx="20" cy="20" r="3" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#iz)" />
      </svg>

      {variant === "crescent" && (
        <svg viewBox="0 0 64 64" className="relative w-16 h-16 text-primary-foreground/90" fill="currentColor">
          <path d="M40 8a24 24 0 1 0 16 40A20 20 0 0 1 40 8z" />
          <polygon points="48,18 50,24 56,24 51,28 53,34 48,30 43,34 45,28 40,24 46,24" />
        </svg>
      )}
      {variant === "star" && (
        <svg viewBox="0 0 64 64" className="relative w-16 h-16 text-primary-foreground/90" fill="currentColor">
          <polygon points="32,4 40,24 62,24 44,38 50,60 32,46 14,60 20,38 2,24 24,24" />
        </svg>
      )}
      {variant === "arabesque" && (
        <svg viewBox="0 0 100 100" className="relative w-20 h-20 text-primary-foreground/90" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="50" cy="50" r="34" />
          <polygon points="50,16 60,40 86,40 65,55 73,82 50,66 27,82 35,55 14,40 40,40" />
        </svg>
      )}

      {label && (
        <span className="absolute bottom-2 right-3 text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold">
          {label}
        </span>
      )}
    </div>
  );
};