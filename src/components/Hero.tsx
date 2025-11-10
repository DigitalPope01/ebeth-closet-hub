import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroFashion from "@/assets/hero-fashion.jpg";
import accessoriesImg from "@/assets/category-accessories.jpg";
import householdImg from "@/assets/category-household.jpg";
import eveningDress from "@/assets/products/evening-dress.jpg";
import leatherBag from "@/assets/products/leather-handbag.jpg";
import heroTravelBags from "@/assets/hero-travel-bags.jpg";
import heroMakeupKits from "@/assets/hero-makeup-kits.jpg";
import heroSunshades from "@/assets/hero-sunshades.jpg";
import heroRings from "@/assets/hero-rings.jpg";
import heroGiftBoxes from "@/assets/hero-gift-boxes.jpg";
import heroCorporateJackets from "@/assets/hero-corporate-jackets.jpg";

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const heroImages = [
    { url: heroFashion, alt: "Premium fashion collection at Ebeth Boutique Abuja - Designer clothing and exquisite accessories" },
    { url: eveningDress, alt: "Elegant evening dresses - Luxury women's fashion at Ebeth Boutique" },
    { url: leatherBag, alt: "Designer leather handbags and accessories - Premium quality from Ebeth Boutique" },
    { url: accessoriesImg, alt: "Luxury fashion accessories collection - Jewelry, bags, and more at Ebeth Boutique Abuja" },
    { url: householdImg, alt: "Premium household items and home essentials - Exquisite collection at Ebeth Boutique" },
    { url: heroTravelBags, alt: "Exotic traveling bags and luggage collection - Premium travel accessories Abuja" },
    { url: heroMakeupKits, alt: "Premium makeup kits and beauty essentials - Luxury cosmetics at Ebeth Boutique" },
    { url: heroSunshades, alt: "Designer sunglasses and sunshades - Fashion accessories at Ebeth Boutique Abuja" },
    { url: heroRings, alt: "Luxury rings and fine jewelry - Exquisite accessories at Ebeth Boutique" },
    { url: heroGiftBoxes, alt: "Elegant gift boxes and premium gift sets - Special occasions at Ebeth Boutique" },
    { url: heroCorporateJackets, alt: "Corporate jackets and professional fashion wear - Business attire at Ebeth Boutique Abuja" },
  ];

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [currentImage]);

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
            <Link to="/shop">
              <Button variant="luxury" size="lg" className="text-base w-full sm:w-auto">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="luxury-outline" size="lg" className="text-base text-white border-white hover:bg-white/10 w-full sm:w-auto">
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

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
