import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { TrendingUp, Truck, Shield, Headphones } from "lucide-react";

// Lazy load components for better performance
const CategoryCard = lazy(() => import("@/components/CategoryCard"));
const ProductCard = lazy(() => import("@/components/ProductCard"));
const Footer = lazy(() => import("@/components/Footer"));

import categoryFashion from "@/assets/category-fashion.jpg";
import categoryAccessories from "@/assets/category-accessories.jpg";
import categoryHousehold from "@/assets/category-household.jpg";
import eveningDress from "@/assets/products/evening-dress.jpg";
import leatherHandbag from "@/assets/products/leather-handbag.jpg";
import kitchenSet from "@/assets/products/kitchen-set.jpg";
import cocktailDress from "@/assets/products/cocktail-dress.jpg";

export default function Index() {
  const featuredProducts = [
    {
      id: "677ff0e1-f678-40d3-9cb3-a2fa58cb9231",
      name: "Designer Evening Dress",
      price: 85000,
      originalPrice: 120000,
      image: eveningDress,
      rating: 4.8,
      reviews: 124,
      isNew: true,
      isSale: true,
    },
    {
      id: "8e04eef8-ade6-4464-b310-fc34d7cae555",
      name: "Luxury Leather Handbag",
      price: 65000,
      image: leatherHandbag,
      rating: 4.9,
      reviews: 89,
      isNew: true,
    },
    {
      id: "ae72bdb6-1d23-4918-90e2-73b0a70128ec",
      name: "Premium Kitchen Set",
      price: 45000,
      originalPrice: 60000,
      image: kitchenSet,
      rating: 4.7,
      reviews: 156,
      isSale: true,
    },
    {
      id: "981ca29e-c68a-4aff-97a2-f704ba7bfffd",
      name: "Elegant Cocktail Dress",
      price: 72000,
      image: cocktailDress,
      rating: 4.8,
      reviews: 92,
    },
  ];

  const categories = [
    {
      title: "Fashion",
      description: "Curated designer collections",
      image: categoryFashion,
      link: "/fashion",
    },
    {
      title: "Accessories",
      description: "Luxury bags, jewelry & more",
      image: categoryAccessories,
      link: "/accessories",
    },
    {
      title: "Household",
      description: "Premium home essentials",
      image: categoryHousehold,
      link: "/household",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Premium Fashion, Accessories & Lifestyle - Abuja"
        description="Ebeth Boutique Abuja – Exquisite men's and women's fashion, luxury accessories, and premium household essentials. Shop designer collections and weekly deals."
        keywords="ebeth boutique, fashion boutique Abuja, luxury accessories Nigeria, women's wear, men's fashion, designer clothing, household essentials, exquisite store"
      />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>

        {/* Features Bar */}
        <section className="bg-secondary py-8 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <div className="p-3 rounded-full bg-gold/10">
                  <Truck className="h-5 w-5 md:h-6 md:w-6 text-gold" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-sm md:text-base">Free Shipping</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Orders over ₦150k</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <div className="p-3 rounded-full bg-gold/10">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-gold" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-sm md:text-base">Secure Payment</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">100% Protected</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <div className="p-3 rounded-full bg-gold/10">
                  <Headphones className="h-5 w-5 md:h-6 md:w-6 text-gold" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-sm md:text-base">24/7 Support</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Dedicated service</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <div className="p-3 rounded-full bg-gold/10">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-gold" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-sm md:text-base">Curated Quality</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Premium selection</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                Featured <span className="text-gold">Designer Products</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Handpicked premium fashion and lifestyle essentials from our latest collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            <div className="text-center">
              <Button variant="luxury" size="lg" onClick={() => window.location.href = '/shop'}>
                View All Products
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                Shop by <span className="text-gold">Category</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Discover our carefully curated collections designed to bring elegance to every aspect of your life
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
              {categories.map((category) => (
                <CategoryCard key={category.title} {...category} />
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/categories'}>
                View All Categories
              </Button>
            </div>
          </div>
        </section>

        {/* Weekly Deals Banner */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-20 text-center">
              <div className="relative z-10">
                <div className="inline-block mb-4 px-4 py-2 bg-gold/20 backdrop-blur-sm rounded-full border border-gold">
                  <span className="text-gold text-sm font-semibold">Limited Time Offer</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                  Weekly Deals Up to 40% Off
                </h2>
                <p className="text-base md:text-xl text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                  Don't miss out on our exclusive weekly deals. New offers every week!
                </p>
                <Button variant="luxury" size="lg" onClick={() => window.location.href = '/deals'}>
                  Shop Weekly Deals
                </Button>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Join Our <span className="text-gold">Exclusive</span> Community
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Be the first to know about new arrivals, exclusive deals, and special promotions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Button variant="luxury" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </section>

        {/* Blog Preview */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                Fashion <span className="text-gold">Style Tips</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Discover expert fashion advice, styling guides, and the latest trends from Ebeth Boutique
              </p>
            </div>
            <div className="text-center mb-8">
              <Button variant="luxury" size="lg" onClick={() => window.location.href = '/blog'}>
                Visit Our Blog
              </Button>
            </div>
          </div>
        </section>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}