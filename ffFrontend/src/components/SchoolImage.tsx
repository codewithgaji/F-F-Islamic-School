import { cn } from "@/lib/utils";
import { IslamicPattern } from "./IslamicPattern";
import { useState, useEffect } from "react";



interface Props {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  patternVariant?: "star" | "crescent" | "arabesque";
  loading?: "lazy" | "eager";
}

export const SchoolImage = ({
  src,
  fallbackSrc,
  alt,
  className,
  patternVariant = "arabesque",
  loading = "lazy",
}: Props) => {
  const initial = src && src.length > 0 ? src : fallbackSrc;
  const [current, setCurrent] = useState<string | undefined>(initial || undefined);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (src && src.length > 0) {
      setCurrent(src);
      setErrored(false);
    }
  }, [src]);

  if (!current || errored) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <IslamicPattern variant={patternVariant} label={alt} />
      </div>
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      className={cn("object-cover", className)}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) {
          setCurrent(fallbackSrc);
        } else {
          setErrored(true);
        }
      }}
    />
  );
};