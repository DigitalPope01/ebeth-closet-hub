import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, ChevronLeft, Minus, Plus } from "lucide-react";
import { isValidUUID } from "@/utils/sanitize";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  is_new: boolean;
  is_on_sale: boolean;
  stock_quantity: number;
  subcategory: string | null;
  product_images: { image_url: string; alt_text: string | null }[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !isValidUUID(id)) {
        toast.error("Invalid product");
        navigate("/shop");
        return;
      }
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images (
            image_url,
            alt_text,
            sort_order
          )
        `)
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast.error("Product not found");
        navigate("/shop");
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .upsert({
        user_id: user.id,
        product_id: product!.id,
        quantity,
      }, {
        onConflict: "user_id,product_id",
      });

    if (error) {
      toast.error("Failed to add to cart");
    } else {
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const images = product.product_images.length > 0 
    ? product.product_images.sort((a, b) => (a as any).sort_order - (b as any).sort_order)
    : [{ image_url: '/placeholder.svg', alt_text: product.name }];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `Premium ${product.name} at Ebeth Boutique Abuja`,
    "image": images[0].image_url,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "NGN",
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": window.location.href
    },
    "brand": {
      "@type": "Brand",
      "name": "Ebeth Boutique and Exquisite Store"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${product.name} - Premium Fashion Product`}
        description={product.description || `Shop ${product.name} at Ebeth Boutique Abuja - Premium quality fashion and lifestyle product. ${product.subcategory || 'Exquisite collection'}.`}
        keywords={`${product.name}, ${product.subcategory || 'fashion'}, boutique Abuja, premium products, luxury items, buy ${product.name}`}
        image={images[0].image_url}
        type="product"
        schema={productSchema}
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 hover:text-gold"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
              {product.is_new && (
                <Badge className="absolute top-4 left-4 z-10 bg-gold text-primary-foreground">New</Badge>
              )}
              {product.is_on_sale && (
                <Badge className="absolute top-4 right-4 z-10 bg-destructive">Sale</Badge>
              )}
              <img
                src={images[selectedImage].image_url}
                alt={`${product.name} - Premium product at Ebeth Boutique Abuja - ${images[selectedImage].alt_text || product.subcategory || 'Exquisite quality'}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === idx ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.subcategory && (
                <p className="text-muted-foreground">{product.subcategory}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-gold text-gold"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            <Separator />

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Quantity</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {product.stock_quantity} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="luxury"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </Button>
            </div>

            {product.stock_quantity === 0 && (
              <p className="text-destructive text-sm">Out of stock</p>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <p className="text-muted-foreground leading-relaxed">
              {product.description || "No description available."}
            </p>
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Category:</strong> {product.subcategory || "N/A"}</p>
              <p><strong>Stock:</strong> {product.stock_quantity} units</p>
              <p><strong>SKU:</strong> {product.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
