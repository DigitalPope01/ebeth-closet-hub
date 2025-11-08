import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { orderStatusSchema } from "@/schemas/adminSchemas";
import { Eye, Truck, Calendar } from "lucide-react";
import { format } from "date-fns";
import OrderTracker from "@/components/OrderTracker";
import { Skeleton } from "@/components/ui/skeleton";

type Order = {
  id: string;
  order_number: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  created_at: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  phone: string;
  shipped_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
  order_items?: any[];
};

export default function AdminOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    const checkAdminStatus = async () => {
      if (!user) return;

      const { data } = await supabase.rpc("is_admin", { _user_id: user.id });

      if (!data) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchOrders();
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to real-time order updates
    const channel = supabase
      .channel('admin-order-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order update received:', payload);
          fetchOrders(); // Refresh orders when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const fetchOrders = async () => {
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
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
      return;
    }

    setOrders(data || []);
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const validationResult = orderStatusSchema.safeParse(newStatus);
    if (!validationResult.success) {
      toast.error("Invalid order status");
      return;
    }

    const updateData: any = { 
      status: newStatus as "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    };

    // Set timestamps based on status
    if (newStatus === "shipped") {
      updateData.shipped_at = new Date().toISOString();
    } else if (newStatus === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    } else if (newStatus === "cancelled") {
      updateData.cancelled_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
      return;
    }

    toast.success("Order status updated");
    fetchOrders();
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return;

    const { error } = await supabase
      .from("orders")
      .update({
        tracking_number: trackingNumber,
        carrier: carrier,
        status: "shipped",
        shipped_at: new Date().toISOString()
      })
      .eq("id", selectedOrder.id);

    if (error) {
      toast.error("Failed to update tracking information");
      return;
    }

    toast.success("Tracking information updated");
    setSelectedOrder(null);
    setTrackingNumber("");
    setCarrier("");
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "processing":
        return "bg-blue-500/10 text-blue-500";
      case "shipped":
        return "bg-purple-500/10 text-purple-500";
      case "delivered":
        return "bg-green-500/10 text-green-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  if (authLoading || loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Order Management</h1>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">#{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "PP")}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              
              <div className="text-sm space-y-1">
                <p><strong>Total:</strong> ₦{order.total_amount.toLocaleString()}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p className="truncate"><strong>Address:</strong> {order.shipping_address}</p>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Order #{order.order_number}</DialogTitle>
                    </DialogHeader>
                    <OrderTracker
                      status={order.status}
                      shippedAt={order.shipped_at}
                      deliveredAt={order.delivered_at}
                      cancelledAt={order.cancelled_at}
                      trackingNumber={order.tracking_number}
                      carrier={order.carrier}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setTrackingNumber(order.tracking_number || "");
                        setCarrier(order.carrier || "");
                      }}
                    >
                      <Truck className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Tracking Info</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Tracking Number</Label>
                        <Input
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                        />
                      </div>
                      <div>
                        <Label>Carrier</Label>
                        <Input
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          placeholder="e.g., DHL, FedEx"
                        />
                      </div>
                      <Button onClick={handleUpdateTracking} className="w-full">
                        Update & Mark as Shipped
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Select 
                  value={order.status} 
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>₦{order.total_amount.toLocaleString()}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{order.shipping_address}</TableCell>
                  <TableCell>{format(new Date(order.created_at), "PP")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order #{order.order_number}</DialogTitle>
                          </DialogHeader>
                          <OrderTracker
                            status={order.status}
                            shippedAt={order.shipped_at}
                            deliveredAt={order.delivered_at}
                            cancelledAt={order.cancelled_at}
                            trackingNumber={order.tracking_number}
                            carrier={order.carrier}
                          />
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedOrder(order);
                              setTrackingNumber(order.tracking_number || "");
                              setCarrier(order.carrier || "");
                            }}
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Tracking Info</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Tracking Number</Label>
                              <Input
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                              />
                            </div>
                            <div>
                              <Label>Carrier</Label>
                              <Input
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                placeholder="e.g., DHL, FedEx"
                              />
                            </div>
                            <Button onClick={handleUpdateTracking} className="w-full">
                              Update & Mark as Shipped
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Select 
                        value={order.status} 
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
