import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import categoryAccessories from "@/assets/category-accessories.jpg";

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

export default function Accessories() {
  const [searchParams] = useSearchParams();
  const subCategory = searchParams.get("sub");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchProducts();
  }, [subCategory, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "accessories")
      .single();

    if (category) {
      let query = supabase
        .from("products")
        .select(`
          *,
          product_images(image_url, is_primary, sort_order)
        `)
        .eq("is_active", true)
        .eq("category_id", category.id);

      // Apply sorting
      switch (sortBy) {
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
    }
    setLoading(false);
  };

  const subcategories = [
    { id: "watches", name: "Watches" },
    { id: "belts", name: "Belts" },
    { id: "sunglasses", name: "Sunglasses" },
    { id: "wallets", name: "Wallets" }
  ];

  const getTitle = () => {
    if (subCategory) {
      const sub = subcategories.find(s => s.id === subCategory);
      return sub ? sub.name : "Accessories";
    }
    return "Accessories";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{getTitle()}</h1>
          <p className="text-muted-foreground">
            Discover our collection of luxury accessories
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.location.href = "/accessories"}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !subCategory
                  ? "bg-gold text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              All Accessories
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => (window.location.href = `/accessories?sub=${sub.id}`)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  subCategory === sub.id
                    ? "bg-gold text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url || categoryAccessories;
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.original_price || undefined}
                  image={primaryImage}
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
