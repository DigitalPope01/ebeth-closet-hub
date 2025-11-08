import { Check, Package, Truck, MapPin, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface OrderTrackerProps {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  trackingNumber?: string | null;
  carrier?: string | null;
}

export default function OrderTracker({
  status,
  shippedAt,
  deliveredAt,
  cancelledAt,
  trackingNumber,
  carrier,
}: OrderTrackerProps) {
  const steps = [
    {
      name: "Order Placed",
      status: "pending",
      icon: Package,
      completed: ["pending", "processing", "shipped", "delivered"].includes(status),
    },
    {
      name: "Processing",
      status: "processing",
      icon: Package,
      completed: ["processing", "shipped", "delivered"].includes(status),
    },
    {
      name: "Shipped",
      status: "shipped",
      icon: Truck,
      completed: ["shipped", "delivered"].includes(status),
      timestamp: shippedAt,
    },
    {
      name: "Delivered",
      status: "delivered",
      icon: MapPin,
      completed: status === "delivered",
      timestamp: deliveredAt,
    },
  ];

  if (status === "cancelled") {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-destructive mb-2">Order Cancelled</h3>
        {cancelledAt && (
          <p className="text-sm text-muted-foreground">
            Cancelled on {format(new Date(cancelledAt), "PPP 'at' p")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tracking Info */}
      {trackingNumber && (
        <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <p className="font-mono font-semibold">{trackingNumber}</p>
            </div>
            {carrier && (
              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">Carrier</p>
                <p className="font-semibold">{carrier}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline - Mobile & Desktop */}
      <div className="relative">
        {/* Desktop Timeline */}
        <div className="hidden md:block">
          <div className="flex justify-between items-start">
            {steps.map((step, index) => (
              <div key={step.name} className="flex flex-col items-center flex-1 relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-6 left-[50%] w-full h-0.5 -z-10",
                      step.completed ? "bg-gold" : "bg-border"
                    )}
                  />
                )}

                {/* Icon Circle */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300",
                    step.completed
                      ? "bg-gold text-primary-foreground shadow-lg shadow-gold/30"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step.completed ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>

                {/* Label */}
                <div className="text-center">
                  <p
                    className={cn(
                      "text-sm font-semibold mb-1",
                      step.completed ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </p>
                  {step.timestamp && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(step.timestamp), "MMM d, h:mm a")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-4">
          {steps.map((step, index) => (
            <div key={step.name} className="flex items-start gap-4">
              {/* Icon Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    step.completed
                      ? "bg-gold text-primary-foreground shadow-lg shadow-gold/30"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-12 mt-2",
                      step.completed ? "bg-gold" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <p
                  className={cn(
                    "font-semibold mb-1",
                    step.completed ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </p>
                {step.timestamp && (
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(step.timestamp), "PPP 'at' p")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <div
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold",
            status === "delivered" && "bg-green-500/10 text-green-500",
            status === "shipped" && "bg-blue-500/10 text-blue-500",
            status === "processing" && "bg-yellow-500/10 text-yellow-500",
            status === "pending" && "bg-gray-500/10 text-gray-500"
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
    </div>
  );
}
