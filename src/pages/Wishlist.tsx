import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  slug: string;
  is_on_sale: boolean;
  is_new: boolean;
  product_images?: Array<{ image_url: string; is_primary: boolean }>;
}

interface WishlistItem {
  id: string;
  product_id: string;
  products: Product;
}

export default function Wishlist() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          id,
          product_id,
          products (
            id,
            name,
            price,
            original_price,
            slug,
            is_on_sale,
            is_new,
            product_images (
              image_url,
              is_primary
            )
          )
        `)
        .eq("user_id", user?.id);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.products;
              const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url 
                || product.product_images?.[0]?.image_url 
                || "/placeholder.svg";
              
              return (
                <ProductCard 
                  key={item.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.original_price}
                  image={primaryImage}
                  rating={4.5}
                  reviews={0}
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
