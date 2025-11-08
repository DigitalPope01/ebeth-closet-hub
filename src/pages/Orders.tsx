import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OrderTracker from "@/components/OrderTracker";
import { Eye, Package } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  order_items: OrderItem[];
  shipped_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  phone: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_image,
          quantity,
          unit_price
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchOrders();

      // Subscribe to real-time order updates
      const channel = supabase
        .channel('order-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Order update received:', payload);
            toast.success('Order status updated!');
            fetchOrders(); // Refresh orders when changes occur
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-gold" />
          <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
              <Button onClick={() => navigate("/shop")} variant="luxury">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-secondary/50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                      <CardTitle className="text-lg md:text-xl">
                        Order #{order.order_number}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(order.created_at), "PPP")}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className={
                          order.status === "delivered"
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                            : order.status === "cancelled"
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            : order.status === "shipped"
                            ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                            : "bg-secondary"
                        }
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Track Order</span>
                            <span className="sm:hidden">Track</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order #{order.order_number}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            <OrderTracker
                              status={order.status}
                              shippedAt={order.shipped_at}
                              deliveredAt={order.delivered_at}
                              cancelledAt={order.cancelled_at}
                              trackingNumber={order.tracking_number}
                              carrier={order.carrier}
                            />
                            
                            <Separator />
                            
                            <div>
                              <h4 className="font-semibold mb-3">Order Items</h4>
                              <div className="space-y-3">
                                {order.order_items.map((item) => (
                                  <div key={item.id} className="flex gap-3">
                                    <img
                                      src={item.product_image || "/placeholder.svg"}
                                      alt={item.product_name}
                                      className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-semibold text-sm truncate">
                                        {item.product_name}
                                      </h5>
                                      <p className="text-xs text-muted-foreground">
                                        Qty: {item.quantity} × {formatPrice(item.unit_price)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h4 className="font-semibold mb-2">Delivery Address</h4>
                              <p className="text-sm text-muted-foreground">
                                {order.shipping_address}<br />
                                {order.shipping_city}, {order.shipping_state}<br />
                                Phone: {order.phone}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {order.order_items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex gap-3 sm:gap-4">
                        <img
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold">
                            {formatPrice(item.unit_price)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.order_items.length > 2 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{order.order_items.length - 2} more item(s)
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg sm:text-xl font-bold text-gold">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
