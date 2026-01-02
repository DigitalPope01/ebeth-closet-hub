import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, ScanBarcode, Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import BarcodeScanner from "./BarcodeScanner";

interface BarcodeScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BarcodeScannerModal({ open, onOpenChange }: BarcodeScannerModalProps) {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);

  const handleScanSuccess = useCallback(async (barcode: string) => {
    setIsScanning(false);
    setIsLoading(true);
    setNotFound(null);

    try {
      // First try to find by barcode
      let { data: product } = await supabase
        .from("products")
        .select("id, slug")
        .eq("barcode", barcode)
        .eq("is_active", true)
        .maybeSingle();

      // If not found by barcode, try SKU
      if (!product) {
        const { data: skuProduct } = await supabase
          .from("products")
          .select("id, slug")
          .eq("sku", barcode)
          .eq("is_active", true)
          .maybeSingle();
        product = skuProduct;
      }

      if (product) {
        onOpenChange(false);
        navigate(`/product/${product.id}`);
      } else {
        setNotFound(barcode);
      }
    } catch (error) {
      console.error("Error finding product:", error);
      setNotFound(barcode);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, onOpenChange]);

  const handleRetry = () => {
    setNotFound(null);
    setIsScanning(true);
  };

  const handleSearchManually = () => {
    if (notFound) {
      onOpenChange(false);
      navigate(`/search?q=${encodeURIComponent(notFound)}`);
    }
  };

  const handleClose = () => {
    setIsScanning(false);
    setNotFound(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ScanBarcode className="h-5 w-5 text-gold" />
              Scan Barcode
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 pt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-gold animate-spin mb-4" />
              <p className="text-muted-foreground">Finding product...</p>
            </div>
          ) : notFound ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium mb-2">Product Not Found</p>
              <p className="text-sm text-muted-foreground mb-6">
                No product found with barcode: <code className="bg-muted px-2 py-1 rounded">{notFound}</code>
              </p>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button variant="outline" onClick={handleRetry} className="flex-1">
                  Scan Again
                </Button>
                <Button onClick={handleSearchManually} className="flex-1">
                  Search Manually
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <BarcodeScanner
                onScanSuccess={handleScanSuccess}
                isScanning={isScanning}
              />
              <p className="text-center text-sm text-muted-foreground">
                Point your camera at a product barcode
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
