import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function LazyImage({ src, alt, className, fallback = "/placeholder.svg" }: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setImageSrc(fallback);
      setIsLoading(false);
    };
  }, [src, fallback]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className={cn(
        "transition-opacity duration-300",
        isLoading ? "opacity-50" : "opacity-100",
        className
      )}
    />
  );
}
