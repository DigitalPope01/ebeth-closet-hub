import { Shield, Lock, Truck, CheckCircle2, CreditCard, Package } from "lucide-react";

export default function TrustBadges() {
  const paymentMethods = [
    { name: "Visa", icon: CreditCard },
    { name: "Mastercard", icon: CreditCard },
    { name: "Bank Transfer", icon: CreditCard },
    { name: "Cash on Delivery", icon: Package },
  ];

  const deliveryPartners = [
    { name: "DHL", icon: Truck },
    { name: "FedEx", icon: Truck },
    { name: "GIG Logistics", icon: Truck },
    { name: "Local Delivery", icon: Truck },
  ];

  const certifications = [
    { name: "SSL Secured", icon: Lock, description: "256-bit encryption" },
    { name: "Verified Store", icon: CheckCircle2, description: "Certified business" },
    { name: "Safe Payments", icon: Shield, description: "100% protected" },
  ];

  return (
    <section className="py-12 md:py-16 bg-secondary/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Shop with <span className="text-gold">Confidence</span>
          </h2>
          <p className="text-muted-foreground">
            Your security and satisfaction are our top priorities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Secure Payment Methods */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-4">
              <CreditCard className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Secure Payment</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-border hover:border-gold/50 transition-colors"
                >
                  <method.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Partners */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-4">
              <Truck className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Trusted Delivery</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {deliveryPartners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-border hover:border-gold/50 transition-colors"
                >
                  <partner.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-4">
              <Shield className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Certified & Secure</h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center gap-3 px-3 py-2 bg-background rounded-lg border border-border hover:border-gold/50 transition-colors"
                >
                  <cert.icon className="w-4 h-4 text-gold flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{cert.name}</div>
                    <div className="text-xs text-muted-foreground">{cert.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Trust Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            All transactions are encrypted and secure. We never store your card details. 
            Your order is handled with care from our warehouse to your doorstep.
          </p>
        </div>
      </div>
    </section>
  );
}
