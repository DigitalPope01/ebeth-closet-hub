import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  isScanning: boolean;
}

export default function BarcodeScanner({ 
  onScanSuccess, 
  onScanError,
  isScanning 
}: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isScanning || !containerRef.current) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 150 },
      aspectRatio: 1.5,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.QR_CODE,
      ],
    };

    const scanner = new Html5Qrcode("barcode-scanner-container");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Vibrate on successful scan if supported
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
          onScanSuccess(decodedText);
        },
        () => {
          // Ignore QR scan errors (happens continuously when no code is detected)
        }
      )
      .catch((err) => {
        const errorMessage = err.message || "Failed to start camera";
        setError(errorMessage);
        onScanError?.(errorMessage);
      });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning, onScanSuccess, onScanError]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-2">Camera Error</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Please ensure camera permissions are granted and you're using HTTPS.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        id="barcode-scanner-container" 
        className="w-full rounded-lg overflow-hidden"
      />
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-40 border-2 border-gold rounded-lg relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-lg" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gold/50 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
