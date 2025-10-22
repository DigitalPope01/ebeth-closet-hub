import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/ebeth-logo.jpg";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="Ebeth Boutique" className="h-12 w-12 rounded-full" />
              <div>
                <div className="text-lg font-bold text-gold">EBETH BOUTIQUE</div>
                <div className="text-xs text-primary-foreground/80">& Exclusive Store</div>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Boutique Elegance Meets Everyday Convenience. Your destination for premium fashion and lifestyle essentials in Nigeria.
            </p>
            <div className="flex space-x-3">
              <a href="https://web.facebook.com/ebethstores" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/ebeth_stores?igsh=cW01OXpicW51Y3gz" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/fashion" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/household" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Household
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Weekly Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Stay Updated</h3>
            <p className="text-primary-foreground/80 mb-4">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <div className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button variant="luxury" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="tel:+2349092034816" className="hover:text-gold transition-colors">
                  +234 909 203 4816
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="https://wa.me/2349092034816" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  WhatsApp: +234 909 203 4816
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="mailto:ebethstores@gmail.com" className="hover:text-gold transition-colors">
                  ebethstores@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p>Atlantic Mall</p>
                  <p>40 Ajose Adeogun St, Near Peace Mass Park</p>
                  <p>Utako, Abuja 900108, FCT</p>
                  <p className="mt-1 text-gold">Mon-Sun: 7:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2025 Ebeth Boutique & Exclusive Store. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
