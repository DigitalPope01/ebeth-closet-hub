import { useState } from "react";
import { MessageCircle, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formSubmissionLimiter } from "@/utils/rateLimiter";
import { toast } from "sonner";

export default function CustomerSupport() {
  const [isOpen, setIsOpen] = useState(false);
  
  const whatsappNumber = "+234 909 203 4816";
  const emailAddress = "ebethstores@gmail.com";
  
  const handleWhatsAppClick = () => {
    if (!formSubmissionLimiter.isAllowed("whatsapp-click")) {
      toast.error("Too many requests. Please wait a moment.");
      return;
    }
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, "_blank");
  };
  
  const handleEmailClick = () => {
    if (!formSubmissionLimiter.isAllowed("email-click")) {
      toast.error("Too many requests. Please wait a moment.");
      return;
    }
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Customer Support"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          side="top" 
          align="end" 
          className="w-80 p-4"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Customer Support</h3>
              <p className="text-sm text-muted-foreground">
                How can we help you today?
              </p>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-xs text-muted-foreground">
                    Chat with us instantly
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={handleEmailClick}
              >
                <Mail className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Email</div>
                  <div className="text-xs text-muted-foreground">
                    {emailAddress}
                  </div>
                </div>
              </Button>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Available Monday - Saturday, 9AM - 6PM
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
