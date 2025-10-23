import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import heroFashion from "@/assets/hero-fashion.jpg";
import accessoriesImg from "@/assets/category-accessories.jpg";
import householdImg from "@/assets/category-household.jpg";
import eveningDress from "@/assets/products/evening-dress.jpg";
import leatherBag from "@/assets/products/leather-handbag.jpg";

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const heroImages = [
    { url: heroFashion, alt: "Fashion Collection" },
    { url: eveningDress, alt: "Evening Dresses" },
    { url: leatherBag, alt: "Leather Accessories" },
    { url: accessoriesImg, alt: "Accessories" },
    { url: householdImg, alt: "Household Items" },
  ];

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden group">
      {/* Background Images with Transition */}
      {heroImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            currentImage === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img.url})` }}
        >
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>
      ))}

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div className="inline-block mb-4 px-4 py-2 bg-gold/20 backdrop-blur-sm rounded-full border border-gold">
            <span className="text-gold text-sm font-semibold">New Collection 2025</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Boutique Elegance
            <br />
            <span className="text-gold">Meets Everyday</span>
            <br />
            Convenience
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Discover curated fashion, accessories, and lifestyle essentials — all in one exclusive destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="luxury" size="lg" className="text-base">
              Shop Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="luxury-outline" size="lg" className="text-base text-white border-white hover:bg-white/10">
              Weekly Deals
            </Button>
          </div>
        </div>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            onMouseEnter={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentImage === index ? "bg-gold w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
