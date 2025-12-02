import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal, Bookmark, BookmarkPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import categoryFashion from "@/assets/category-fashion.jpg";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  description: string | null;
  is_new: boolean;
  is_on_sale: boolean;
  stock_quantity: number;
  category_id: string | null;
  attributes?: {
    size?: string[];
    color?: string[];
    brand?: string;
    material?: string;
  };
  product_images?: Array<{
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }>;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: {
    search?: string;
    category?: string;
    priceRange?: [number, number];
    sizes?: string[];
    colors?: string[];
    brands?: string[];
    materials?: string[];
  };
  created_at: string;
}

export default function Shop() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const searchQuery = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState<any[]>([]);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Available filter options
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);
  
  // Saved searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");

  useEffect(() => {
    fetchCategories();
    if (user) {
      fetchSavedSearches();
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, sortBy]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Fetch saved searches
  const fetchSavedSearches = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setSavedSearches(data as SavedSearch[]);
    }
  };

  // Save current filters as a preset
  const saveCurrentFilters = async () => {
    if (!user) {
      toast.error("Please sign in to save searches");
      return;
    }
    if (!newPresetName.trim()) {
      toast.error("Please enter a name for this preset");
      return;
    }

    const filters = {
      search: localSearch || undefined,
      category: categorySlug || undefined,
      priceRange: (priceRange[0] !== 0 || priceRange[1] !== maxPrice) ? priceRange : undefined,
      sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      colors: selectedColors.length > 0 ? selectedColors : undefined,
      brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      materials: selectedMaterials.length > 0 ? selectedMaterials : undefined,
    };

    const { error } = await supabase.from("saved_searches").insert({
      user_id: user.id,
      name: newPresetName.trim(),
      filters,
    });

    if (error) {
      toast.error("Failed to save search preset");
    } else {
      toast.success("Search preset saved!");
      setNewPresetName("");
      setSaveDialogOpen(false);
      fetchSavedSearches();
    }
  };

  // Apply a saved search
  const applySavedSearch = (saved: SavedSearch) => {
    const { filters } = saved;
    
    // Apply search query
    if (filters.search) {
      setLocalSearch(filters.search);
      const params = new URLSearchParams(searchParams);
      params.set("q", filters.search);
      setSearchParams(params);
    } else {
      setLocalSearch("");
    }
    
    // Apply category
    if (filters.category) {
      const params = new URLSearchParams(searchParams);
      params.set("category", filters.category);
      setSearchParams(params);
    }
    
    // Apply price range
    if (filters.priceRange) {
      setPriceRange(filters.priceRange);
    } else {
      setPriceRange([0, maxPrice]);
    }
    
    // Apply attribute filters
    setSelectedSizes(filters.sizes || []);
    setSelectedColors(filters.colors || []);
    setSelectedBrands(filters.brands || []);
    setSelectedMaterials(filters.materials || []);
    
    toast.success(`Applied "${saved.name}" filters`);
  };

  // Delete a saved search
  const deleteSavedSearch = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("saved_searches").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete preset");
    } else {
      toast.success("Preset deleted");
      fetchSavedSearches();
    }
  };

  // Extract available filter options from all products
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    const sizes = new Set<string>();
    const colors = new Set<string>();
    const brands = new Set<string>();
    const materials = new Set<string>();
    let max = 0;
    
    allProducts.forEach(product => {
      if (product.price > max) max = product.price;
      
      if (product.attributes) {
        product.attributes.size?.forEach(s => sizes.add(s));
        product.attributes.color?.forEach(c => colors.add(c));
        if (product.attributes.brand) brands.add(product.attributes.brand);
        if (product.attributes.material) materials.add(product.attributes.material);
      }
    });
    
    setAvailableSizes(Array.from(sizes).sort());
    setAvailableColors(Array.from(colors).sort());
    setAvailableBrands(Array.from(brands).sort());
    setAvailableMaterials(Array.from(materials).sort());
    setMaxPrice(Math.ceil(max));
    setPriceRange([0, Math.ceil(max)]);
  }, [allProducts]);

  // Apply all filters
  useEffect(() => {
    let filtered = [...allProducts];
    
    // Search filter
    if (localSearch.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        product.description?.toLowerCase().includes(localSearch.toLowerCase())
      );
    }
    
    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.attributes?.size?.some(s => selectedSizes.includes(s))
      );
    }
    
    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        product.attributes?.color?.some(c => selectedColors.includes(c))
      );
    }
    
    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        product.attributes?.brand && selectedBrands.includes(product.attributes.brand)
      );
    }
    
    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(product => 
        product.attributes?.material && selectedMaterials.includes(product.attributes.material)
      );
    }
    
    setProducts(filtered);
  }, [localSearch, allProducts, priceRange, selectedSizes, selectedColors, selectedBrands, selectedMaterials]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select(`
        *,
        product_images(image_url, is_primary, sort_order)
      `)
      .eq("is_active", true);

    if (categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      
      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

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
      const productsWithAttributes = data.map(product => ({
        ...product,
        attributes: product.attributes as { size?: string[]; color?: string[]; brand?: string; material?: string; } | undefined
      }));
      setAllProducts(productsWithAttributes);
      setProducts(productsWithAttributes);
    }
    setLoading(false);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set("q", localSearch.trim());
      setSearchParams(params);
    }
  };

  const clearSearch = () => {
    setLocalSearch("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    setSearchParams(params);
  };

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const toggleFilter = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedMaterials([]);
  };

  const activeFiltersCount = 
    selectedSizes.length + 
    selectedColors.length + 
    selectedBrands.length + 
    selectedMaterials.length +
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shop All Products - Fashion, Accessories & Lifestyle"
        description="Shop the complete collection at Ebeth Boutique Abuja - Premium fashion, luxury accessories, and household essentials. Designer quality at competitive prices."
        keywords="shop fashion Abuja, buy accessories online, boutique shopping Nigeria, designer products, luxury items, fashion store, lifestyle products"
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {categorySlug
              ? `${categories.find((c) => c.slug === categorySlug)?.name || "Shop"} - Premium Collection`
              : "Shop All Products - Fashion & Lifestyle"}
          </h1>
          <p className="text-muted-foreground">
            Discover our curated collection of premium fashion, luxury accessories, and lifestyle essentials at Ebeth Boutique Abuja
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search products by name, description..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {localSearch && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {localSearch && (
            <p className="text-sm text-muted-foreground mt-2">
              {products.length} {products.length === 1 ? 'result' : 'results'} found for "{localSearch}"
            </p>
          )}
        </form>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !categorySlug
                  ? "bg-gold text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  categorySlug === category.slug
                    ? "bg-gold text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Saved Searches */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Saved
                    {savedSearches.length > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center" variant="secondary">
                        {savedSearches.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {savedSearches.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                      No saved searches yet
                    </div>
                  ) : (
                    savedSearches.map((saved) => (
                      <DropdownMenuItem
                        key={saved.id}
                        onClick={() => applySavedSearch(saved)}
                        className="flex justify-between items-center cursor-pointer"
                      >
                        <span className="truncate">{saved.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2 hover:bg-destructive/10"
                          onClick={(e) => deleteSavedSearch(saved.id, e)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <BookmarkPlus className="h-4 w-4 mr-2" />
                        Save Current Filters
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Search Preset</DialogTitle>
                        <DialogDescription>
                          Save your current filters as a preset for quick access later.
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="Preset name (e.g., Summer Dresses)"
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveCurrentFilters()}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveCurrentFilters}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center" variant="default">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[350px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>
                    Refine your search with advanced filters
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-semibold">Price Range</Label>
                      <Button variant="ghost" size="sm" onClick={() => setPriceRange([0, maxPrice])}>
                        Reset
                      </Button>
                    </div>
                    <div className="pt-2">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        min={0}
                        max={maxPrice}
                        step={1000}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₦{priceRange[0].toLocaleString()}</span>
                        <span>₦{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Size Filter */}
                  {availableSizes.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Size</Label>
                        {selectedSizes.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedSizes([])}>
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                              selectedSizes.includes(size)
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Filter */}
                  {availableColors.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Color</Label>
                        {selectedColors.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedColors([])}>
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {availableColors.map((color) => (
                          <div key={color} className="flex items-center space-x-2">
                            <Checkbox
                              id={`color-${color}`}
                              checked={selectedColors.includes(color)}
                              onCheckedChange={() => toggleFilter(color, selectedColors, setSelectedColors)}
                            />
                            <Label htmlFor={`color-${color}`} className="cursor-pointer">
                              {color}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brand Filter */}
                  {availableBrands.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Brand</Label>
                        {selectedBrands.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedBrands([])}>
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {availableBrands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
                            />
                            <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                              {brand}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Material Filter */}
                  {availableMaterials.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Material</Label>
                        {selectedMaterials.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedMaterials([])}>
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {availableMaterials.map((material) => (
                          <div key={material} className="flex items-center space-x-2">
                            <Checkbox
                              id={`material-${material}`}
                              checked={selectedMaterials.includes(material)}
                              onCheckedChange={() => toggleFilter(material, selectedMaterials, setSelectedMaterials)}
                            />
                            <Label htmlFor={`material-${material}`} className="cursor-pointer">
                              {material}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear All Filters */}
                  {activeFiltersCount > 0 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={clearAllFilters}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

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
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
              <Badge variant="secondary" className="gap-1">
                ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setPriceRange([0, maxPrice])}
                />
              </Badge>
            )}
            {selectedSizes.map((size) => (
              <Badge key={size} variant="secondary" className="gap-1">
                Size: {size}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== size))}
                />
              </Badge>
            ))}
            {selectedColors.map((color) => (
              <Badge key={color} variant="secondary" className="gap-1">
                Color: {color}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                />
              </Badge>
            ))}
            {selectedBrands.map((brand) => (
              <Badge key={brand} variant="secondary" className="gap-1">
                Brand: {brand}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                />
              </Badge>
            ))}
            {selectedMaterials.map((material) => (
              <Badge key={material} variant="secondary" className="gap-1">
                Material: {material}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedMaterials(selectedMaterials.filter(m => m !== material))}
                />
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

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
              const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url || categoryFashion;
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
