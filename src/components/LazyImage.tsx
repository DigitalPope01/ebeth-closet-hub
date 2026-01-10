import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function LazyImage({ src, alt, className, fallback = "/placeholder.svg" }: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      setImageSrc(fallback);
      setIsLoading(false);
      setHasError(true);
    };
  }, [src, fallback, isInView]);

  // If not in view yet, show a placeholder with correct dimensions
  if (!isInView) {
    return (
      <img
        ref={imgRef}
        src={fallback}
        alt={alt}
        className={cn(
          "transition-opacity duration-300 opacity-50",
          className
        )}
      />
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc || fallback}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn(
        "transition-opacity duration-300",
        isLoading ? "opacity-50" : "opacity-100",
        hasError && "bg-muted",
        className
      )}
      onError={(e) => {
        const target = e.currentTarget;
        if (target.src !== fallback) {
          target.src = fallback;
        }
      }}
    />
  );
}
