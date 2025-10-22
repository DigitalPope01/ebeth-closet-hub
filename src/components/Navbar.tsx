import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/ebeth-logo.jpg";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Ebeth Boutique" className="h-12 w-12 rounded-full" />
            <div className="hidden md:block">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EBETH BOUTIQUE
              </div>
              <div className="text-xs text-muted-foreground">& Exclusive Store</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-sm font-medium hover:text-gold transition-colors">
              Shop
            </Link>
            <Link to="/fashion" className="text-sm font-medium hover:text-gold transition-colors">
              Fashion
            </Link>
            <Link to="/accessories" className="text-sm font-medium hover:text-gold transition-colors">
              Accessories
            </Link>
            <Link to="/household" className="text-sm font-medium hover:text-gold transition-colors">
              Household
            </Link>
            <Link to="/deals" className="text-sm font-medium text-gold hover:text-gold-light transition-colors">
              Weekly Deals
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 bg-secondary/50 border-border focus:border-gold transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:text-gold">
              <Search className="h-5 w-5 md:hidden" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-gold">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative hover:text-gold">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-gold">
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4">
              <Link
                to="/shop"
                className="text-sm font-medium hover:text-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/fashion"
                className="text-sm font-medium hover:text-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fashion
              </Link>
              <Link
                to="/accessories"
                className="text-sm font-medium hover:text-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link
                to="/household"
                className="text-sm font-medium hover:text-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Household
              </Link>
              <Link
                to="/deals"
                className="text-sm font-medium text-gold hover:text-gold-light transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Weekly Deals
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
