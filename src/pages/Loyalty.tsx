import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import LoyaltyPointsCard from '@/components/LoyaltyPointsCard';
import LoyaltyTransactionHistory from '@/components/LoyaltyTransactionHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react';

const Loyalty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <SEO
        title="Loyalty Rewards - Ebeth Boutique"
        description="Earn points on every purchase and redeem them for exclusive discounts. Join our loyalty rewards program today!"
        keywords="loyalty program, rewards, points, discounts, shopping benefits"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                Loyalty Rewards
              </h1>
              <p className="text-muted-foreground text-lg">
                Earn points with every purchase and enjoy exclusive benefits
              </p>
            </div>

            {/* Points Summary */}
            <LoyaltyPointsCard />

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Simple and rewarding - earn points every time you shop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">1. Shop</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn 1 point for every ₦1 you spend on any purchase
                    </p>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">2. Accumulate</h3>
                    <p className="text-sm text-muted-foreground">
                      Watch your points grow with every order you place
                    </p>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">3. Redeem</h3>
                    <p className="text-sm text-muted-foreground">
                      Use points for discounts (1 point = ₦0.50 off, min. 100 points)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <LoyaltyTransactionHistory />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Loyalty;
