import { useEffect, useState } from "react";
import logo from "@/assets/ebeth-logo.jpg";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="text-center space-y-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-75">
            <div className="h-32 w-32 mx-auto rounded-full border-4 border-gold/30" />
          </div>
          <img 
            src={logo} 
            alt="Ebeth Exclusive Stores" 
            className="h-32 w-32 mx-auto rounded-full border-4 border-gold shadow-luxury relative z-10"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            Ebeth Exclusive Stores
          </h1>
          <p className="text-muted-foreground">Boutique Elegance Meets Everyday Convenience</p>
        </div>
        <div className="flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gold animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-gold animate-bounce" />
        </div>
      </div>
    </div>
  );
}
