import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "star" | "crescent" | "arabesque";
  label?: string;
}

/**
 * Branded placeholder shown when no real image is provided or the image fails
 * to load. Also used as a soft background accent behind page headers.
 * `variant` is kept for API compatibility with existing call sites but no
 * longer changes the visual — every case now shows the school logo.
 */
export const IslamicPattern = ({ className, label }: Props) => {
  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-warm",
        className
      )}
      role="img"
      aria-label={label ?? "F&F Islamic Super Kiddies Centre"}
    >
      <img
        src="/fandf.png"
        alt=""
        aria-hidden="true"
        className="w-1/2 max-w-[160px] h-auto opacity-80 object-contain drop-shadow-sm"
      />

      {label && (
        <span className="absolute bottom-2 right-3 text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold">
          {label}
        </span>
      )}
    </div>
  );
};