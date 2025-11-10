import { Link } from "react-router-dom";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  authorName: string;
  category: string;
  publishedAt: string;
  tags?: string[];
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  featuredImage,
  authorName,
  category,
  publishedAt,
  tags,
}: BlogCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link to={`/blog/${slug}`} className="group">
      <article className="bg-card rounded-lg shadow-card hover:shadow-luxury transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Featured Image */}
        {featuredImage && (
          <div className="relative aspect-video overflow-hidden bg-secondary">
            <img
              src={featuredImage}
              alt={`${title} - Fashion blog post at Ebeth Boutique Abuja`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="p-4 md:p-6 flex-1 flex flex-col">
          {/* Category Badge */}
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-3 w-fit">
            {category}
          </Badge>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold mb-3 line-clamp-2 group-hover:text-gold transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-3 flex-1">
            {excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{formatDate(publishedAt)}</span>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More Link */}
          <div className="flex items-center text-gold font-semibold text-sm group-hover:gap-3 transition-all">
            <span>Read More</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}
