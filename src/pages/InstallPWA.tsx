import { useEffect, useState } from "react";
import { Download, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.error("Installation not available. Please use your browser's menu to install.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      toast.success("App installed successfully!");
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Install <span className="text-gold">Ebeth Exclusive</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Get the best shopping experience with our mobile app
            </p>
          </div>

          {isInstalled ? (
            <Card className="border-gold/20 bg-secondary">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                  <Check className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Already Installed!</h2>
                <p className="text-muted-foreground">
                  The Ebeth Exclusive app is already installed on your device.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-gold" />
                    Install on Your Device
                  </CardTitle>
                  <CardDescription>
                    Experience faster loading, offline access, and app-like performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isInstallable ? (
                    <Button onClick={handleInstall} size="lg" variant="luxury" className="w-full">
                      <Download className="mr-2 h-5 w-5" />
                      Install App Now
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        To install this app on your device:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-secondary">
                          <CardContent className="pt-6">
                            <h3 className="font-semibold mb-2">📱 iPhone/iPad</h3>
                            <ol className="text-sm space-y-1 text-muted-foreground">
                              <li>1. Tap the Share button</li>
                              <li>2. Select "Add to Home Screen"</li>
                              <li>3. Tap "Add"</li>
                            </ol>
                          </CardContent>
                        </Card>
                        <Card className="bg-secondary">
                          <CardContent className="pt-6">
                            <h3 className="font-semibold mb-2">🤖 Android</h3>
                            <ol className="text-sm space-y-1 text-muted-foreground">
                              <li>1. Tap the menu (⋮)</li>
                              <li>2. Select "Add to Home screen"</li>
                              <li>3. Tap "Add"</li>
                            </ol>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-secondary">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <h3 className="font-semibold mb-2">Lightning Fast</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant loading with offline support
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <h3 className="font-semibold mb-2">Native Feel</h3>
                    <p className="text-sm text-muted-foreground">
                      App-like experience on your device
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-2">🔔</div>
                    <h3 className="font-semibold mb-2">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new deals
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
