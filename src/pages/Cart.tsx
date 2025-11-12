import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Minus, Plus, Trash2, ShoppingBag, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import LoyaltyPointsCard from "@/components/LoyaltyPointsCard";
import categoryFashion from "@/assets/category-fashion.jpg";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
  };
}

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const { loyaltyPoints, calculateDiscountFromPoints, calculatePointsFromAmount, redeemPoints } = useLoyaltyPoints();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product:products (
          id,
          name,
          price,
          stock_quantity
        )
      `)
      .eq("user_id", user.id);

    if (!error && data) {
      setCartItems(data as any);
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", itemId);

    if (!error) {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (!error) {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      toast.success("Item removed from cart");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 150000 ? 0 : 2500;
  const total = subtotal + shipping - pointsDiscount;
  const potentialPoints = calculatePointsFromAmount(subtotal);

  const handleRedeemPoints = async () => {
    const points = parseInt(pointsToRedeem);
    if (isNaN(points) || points < 100) {
      toast.error("Please enter at least 100 points");
      return;
    }

    if (!loyaltyPoints || points > loyaltyPoints.points_balance) {
      toast.error("Insufficient points");
      return;
    }

    const discount = calculateDiscountFromPoints(points);
    if (discount > subtotal) {
      toast.error("Points discount cannot exceed subtotal");
      return;
    }

    setPointsDiscount(discount);
    setShowRedeemDialog(false);
    toast.success(`${points} points redeemed for ₦${discount.toFixed(2)} discount!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to add items to your cart
          </p>
          <Button variant="luxury" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={categoryFashion}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-xl font-bold text-gold mb-4">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock_quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Loyalty Points Card */}
              <LoyaltyPointsCard 
                showRedeemButton={true}
                onRedeem={() => setShowRedeemDialog(true)}
              />

              {/* Order Summary */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {pointsDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Gift className="h-4 w-4" />
                        Points Discount
                      </span>
                      <span className="font-semibold">-{formatPrice(pointsDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                  {subtotal < 150000 && (
                    <p className="text-sm text-muted-foreground">
                      Add {formatPrice(150000 - subtotal)} more for free shipping
                    </p>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-gold">{formatPrice(total)}</span>
                    </div>
                    {potentialPoints > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        You'll earn {potentialPoints} points on this order
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" className="w-full">
                      Apply Coupon
                    </Button>
                  </div>

                  <Button variant="luxury" className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate("/shop")}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Redeem Points Dialog */}
        <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redeem Loyalty Points</DialogTitle>
              <DialogDescription>
                Enter the number of points you want to redeem for a discount.
                <br />
                1 point = ₦0.50 discount (Minimum: 100 points)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Points to Redeem</label>
                <Input
                  type="number"
                  min="100"
                  max={loyaltyPoints?.points_balance || 0}
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(e.target.value)}
                  placeholder="Enter points (min. 100)"
                />
              </div>
              {pointsToRedeem && parseInt(pointsToRedeem) >= 100 && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">
                    {pointsToRedeem} points = ₦{calculateDiscountFromPoints(parseInt(pointsToRedeem)).toFixed(2)} discount
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRedeemDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRedeemPoints}>
                Redeem Points
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
