import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ScanBarcode } from "lucide-react";
import BarcodeScannerModal from "@/components/BarcodeScannerModal";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  original_price: number | null;
  is_new: boolean | null;
  is_on_sale: boolean | null;
  slug: string;
  product_images: { image_url: string }[];
}

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          description,
          original_price,
          is_new,
          is_on_sale,
          slug,
          product_images (image_url)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,subcategory.ilike.%${query}%`)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price")
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,subcategory.ilike.%${searchQuery}%`)
        .eq("is_active", true)
        .limit(5);

      if (data) {
        setSuggestions(data);
        setShowSuggestions(true);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchParams({ q: productName });
    setSearchQuery(productName);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Search Results</h1>
            <Button 
              variant="outline" 
              onClick={() => setScannerOpen(true)}
              className="flex items-center gap-2"
            >
              <ScanBarcode className="h-4 w-4" />
              <span className="hidden sm:inline">Scan Barcode</span>
            </Button>
          </div>
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                className="pl-10 bg-secondary/50 border-border focus:border-gold transition-colors h-12 text-base"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
                  <Command>
                    <CommandList>
                      <CommandGroup heading="Products">
                        {suggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion.id}
                            onSelect={() => handleSuggestionClick(suggestion.name)}
                            className="cursor-pointer"
                          >
                            <div className="flex justify-between items-center w-full">
                              <span>{suggestion.name}</span>
                              <span className="text-gold text-sm">₦{suggestion.price.toLocaleString()}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-6">
              Found {products.length} {products.length === 1 ? "product" : "products"} for "{query}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.original_price || undefined}
                  image={product.product_images[0]?.image_url || "/placeholder.svg"}
                  rating={4.5}
                  reviews={0}
                  isNew={product.is_new || false}
                  isSale={product.is_on_sale || false}
                />
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found for "{query}"</p>
            <p className="text-sm text-muted-foreground mt-2">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Enter a search term to find products</p>
          </div>
        )}
      </div>
      
      <BarcodeScannerModal open={scannerOpen} onOpenChange={setScannerOpen} />
    </div>
  );
}
