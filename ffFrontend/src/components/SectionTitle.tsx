import { cn } from "@/lib/utils";

interface Props {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionTitle = ({ label, title, description, align = "center", className }: Props) => {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {label && (
        <div className={cn("flex items-center gap-3 mb-3", align === "center" && "justify-center")}>
          <span className="h-px w-10 bg-primary" />
          <span className="uppercase tracking-[0.2em] text-xs font-semibold text-primary">{label}</span>
          <span className="h-px w-10 bg-primary" />
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
};