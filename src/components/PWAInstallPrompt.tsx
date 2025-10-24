import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Don't show if user dismissed it before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 animate-in slide-in-from-bottom-5">
      <Card className="p-4 shadow-lg border-gold/20 bg-card">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-secondary rounded-full transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gold/10">
            <Download className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Install Ebeth Exclusive</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get faster access and work offline
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" variant="luxury">
                Install
              </Button>
              <Button onClick={handleDismiss} size="sm" variant="ghost">
                Not now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
