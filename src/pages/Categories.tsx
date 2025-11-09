import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Package } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  product_count?: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      // Fetch product counts for each category
      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("is_active", true);

          return {
            ...category,
            product_count: count || 0,
          };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shop by Category - Fashion, Accessories & Household | Ebeth Boutique Abuja"
        description="Browse our curated categories at Ebeth Boutique Abuja. Explore premium fashion, luxury accessories, and exquisite household items. Shop designer collections in Nigeria."
        keywords="boutique categories Abuja, fashion categories Nigeria, luxury accessories, household essentials, Ebeth Boutique shop"
        canonicalUrl="/categories"
      />
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our curated collections of exquisite fashion, luxury accessories, and premium household items in Abuja
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-secondary rounded-lg mb-4" />
                <div className="h-6 bg-secondary rounded mb-2" />
                <div className="h-4 bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.slug}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg bg-card border border-border hover:border-gold transition-all duration-300 hover:shadow-luxury">
                  {/* Category Image */}
                  <div className="aspect-square overflow-hidden bg-secondary">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={`${category.name} - Premium ${category.name.toLowerCase()} collection at Ebeth Boutique Abuja featuring designer pieces and luxury items`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-20 w-20 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold group-hover:text-gold transition-colors">
                        {category.name}
                      </h3>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
                      </span>
                      <span className="text-gold font-semibold group-hover:underline">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Categories Found</h3>
            <p className="text-muted-foreground">
              Check back soon for new categories
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
