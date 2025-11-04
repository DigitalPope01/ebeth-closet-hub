import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, TrendingDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  is_new: boolean;
  is_on_sale: boolean;
  product_images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
}

export default function Deals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("discount");

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    
    let query = supabase
      .from("products")
      .select(`
        *,
        product_images(image_url, is_primary, sort_order)
      `)
      .eq("is_active", true)
      .eq("is_on_sale", true);

    // Apply sorting
    switch (sortBy) {
      case "discount":
        // Sort by discount percentage (requires original_price)
        query = query.not("original_price", "is", null).order("price", { ascending: true });
        break;
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const calculateDiscount = (price: number, originalPrice: number | null) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gold/10">
              <Tag className="h-8 w-8 text-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Weekly <span className="text-gold">Deals</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Save up to 40% on selected items. New deals added weekly!
          </p>
        </div>

        {/* Stats Bar */}
        {!loading && products.length > 0 && (
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-lg p-6 mb-8 border border-gold/20">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-6 w-6 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-6 w-6 text-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Discount</p>
                  <p className="text-2xl font-bold text-gold">
                    {Math.round(
                      products.reduce((sum, p) => sum + calculateDiscount(p.price, p.original_price), 0) / products.length
                    )}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-end mb-8">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount">Best Discount</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Active Deals</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for new weekly deals
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url;
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.original_price || undefined}
                  image={primaryImage || ""}
                  rating={4.5}
                  reviews={Math.floor(Math.random() * 200) + 10}
                  isNew={product.is_new}
                  isSale={product.is_on_sale}
                />
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
