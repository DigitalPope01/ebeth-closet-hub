import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function CategoryCard({ title, description, image, link }: CategoryCardProps) {
  return (
    <Link to={link} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-card hover:shadow-luxury transition-all duration-300">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={`${title} category at Ebeth Boutique Abuja - ${description} - Premium fashion and lifestyle products`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-white/80 mb-4">{description}</p>
          <div className="flex items-center text-gold group-hover:text-gold-light transition-colors">
            <span className="font-semibold">Shop Now</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
