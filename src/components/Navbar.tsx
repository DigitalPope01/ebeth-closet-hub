import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, ChevronDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/ebeth-logo.jpg";
interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
}
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };
  const handleSuggestionClick = (productName: string) => {
    navigate(`/search?q=${encodeURIComponent(productName)}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const {
        data
      } = await supabase.from("products").select("id, name, slug, price").or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,subcategory.ilike.%${searchQuery}%`).eq("is_active", true).limit(5);
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
  useEffect(() => {
    if (user) {
      // Fetch cart count
      const fetchCartCount = async () => {
        const {
          count
        } = await supabase.from("cart_items").select("*", {
          count: "exact",
          head: true
        }).eq("user_id", user.id);
        setCartCount(count || 0);
      };
      fetchCartCount();

      // Check admin status
      const checkAdminStatus = async () => {
        const {
          data
        } = await supabase.rpc("is_admin", {
          _user_id: user.id
        });
        setIsAdmin(data || false);
      };
      checkAdminStatus();

      // Listen for cart updates
      const handleCartUpdate = () => fetchCartCount();
      window.addEventListener("cart-updated", handleCartUpdate);
      return () => window.removeEventListener("cart-updated", handleCartUpdate);
    } else {
      setCartCount(0);
      setIsAdmin(false);
    }
  }, [user]);
  return <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-gold/30 p-0.5 hover:border-gold transition-colors">
              <img src={logo} alt="Ebeth Boutique" className="h-full w-full rounded-full object-cover" />
            </div>
            <span className="text-base md:text-xl font-bold tracking-tight text-left">Ebeth Boutique and Exquisite Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-sm font-semibold hover:text-gold transition-colors">
              Shop
            </Link>
            <Link to="/categories" className="text-sm font-semibold hover:text-gold transition-colors">
              Categories
            </Link>
            
            {/* Fashion Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-semibold hover:text-gold transition-colors">
                Fashion <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/fashion?sub=clothing")}>
                  Clothing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/fashion?sub=shoes")}>
                  Shoes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/fashion?sub=jewelry")}>
                  Jewelry
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accessories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-semibold hover:text-gold transition-colors">
                Accessories <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/accessories?sub=bags")}>
                  Bags
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/accessories?sub=watches")}>
                  Watches
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/accessories?sub=belts")}>
                  Belts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/accessories?sub=sunglasses")}>
                  Sunglasses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/accessories?sub=wallets")}>
                  Wallets
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Household Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-semibold hover:text-gold transition-colors">
                Household <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/household?sub=decor")}>
                  Home Decor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/household?sub=kitchen")}>
                  Kitchen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/household?sub=bedding")}>
                  Bedding
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/household?sub=storage")}>
                  Storage
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/deals" className="text-sm font-semibold text-gold hover:text-gold-light transition-colors">
              Weekly Deals
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
              <Input type="search" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)} className="pl-10 bg-secondary/50 border-border focus:border-gold transition-colors" />
              {showSuggestions && suggestions.length > 0 && <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
                  <Command>
                    <CommandList>
                      <CommandGroup heading="Products">
                        {suggestions.map(suggestion => <CommandItem key={suggestion.id} onSelect={() => handleSuggestionClick(suggestion.name)} className="cursor-pointer">
                            <div className="flex justify-between items-center w-full">
                              <span>{suggestion.name}</span>
                              <span className="text-gold text-sm">₦{suggestion.price.toLocaleString()}</span>
                            </div>
                          </CommandItem>)}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="hover:text-gold lg:hidden" onClick={() => navigate("/search")}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-gold hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative hover:text-gold" onClick={() => navigate("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-gold text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>}
            </Button>
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:text-gold">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                    Wishlist
                  </DropdownMenuItem>
                  {isAdmin && <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button variant="ghost" size="icon" className="hover:text-gold" onClick={() => navigate("/auth")}>
                <User className="h-5 w-5" />
              </Button>}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4">
              <Link to="/shop" className="text-sm font-semibold hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/categories" className="text-sm font-semibold hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
              
              {/* Fashion Mobile */}
              <div className="space-y-2">
                <Link to="/fashion" className="text-sm font-semibold hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Fashion
                </Link>
                <div className="pl-4 space-y-2 text-sm">
                  <Link to="/fashion?sub=clothing" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Clothing
                  </Link>
                  <Link to="/fashion?sub=shoes" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Shoes
                  </Link>
                  <Link to="/fashion?sub=jewelry" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Jewelry
                  </Link>
                </div>
              </div>

              {/* Accessories Mobile */}
              <div className="space-y-2">
                <Link to="/accessories" className="text-sm font-semibold hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Accessories
                </Link>
                <div className="pl-4 space-y-2 text-sm">
                  <Link to="/accessories?sub=bags" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Bags
                  </Link>
                  <Link to="/accessories?sub=watches" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Watches
                  </Link>
                  <Link to="/accessories?sub=belts" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Belts
                  </Link>
                  <Link to="/accessories?sub=sunglasses" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Sunglasses
                  </Link>
                  <Link to="/accessories?sub=wallets" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Wallets
                  </Link>
                </div>
              </div>

              {/* Household Mobile */}
              <div className="space-y-2">
                <Link to="/household" className="text-sm font-semibold hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Household
                </Link>
                <div className="pl-4 space-y-2 text-sm">
                  <Link to="/household?sub=decor" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Home Decor
                  </Link>
                  <Link to="/household?sub=kitchen" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Kitchen
                  </Link>
                  <Link to="/household?sub=bedding" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Bedding
                  </Link>
                  <Link to="/household?sub=storage" className="block text-muted-foreground hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                    Storage
                  </Link>
                </div>
              </div>

              <Link to="/deals" className="text-sm font-semibold text-gold hover:text-gold-light transition-colors" onClick={() => setIsMenuOpen(false)}>
                Weekly Deals
              </Link>
            </div>
          </div>}
      </div>
    </nav>;
}