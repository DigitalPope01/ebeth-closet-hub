import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";

export default function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
