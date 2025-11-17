import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import LoyaltyPointsCard from '@/components/LoyaltyPointsCard';
import LoyaltyTransactionHistory from '@/components/LoyaltyTransactionHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, ShoppingBag, Sparkles, TrendingUp, Crown, Star, Award, Truck, Tag, Calendar, Zap } from 'lucide-react';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';

const Loyalty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loyaltyPoints } = useLoyaltyPoints();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Tier definitions
  const tiers = [
    {
      name: 'Bronze',
      minPoints: 0,
      maxPoints: 4999,
      icon: Award,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      benefits: ['Earn 1 point per ₦1', 'Birthday reward', 'Email newsletters']
    },
    {
      name: 'Silver',
      minPoints: 5000,
      maxPoints: 14999,
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      benefits: ['Earn 1.2 points per ₦1', 'Early sale access', 'Free shipping on orders over ₦100k', 'Priority support']
    },
    {
      name: 'Gold',
      minPoints: 15000,
      maxPoints: 49999,
      icon: Sparkles,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      benefits: ['Earn 1.5 points per ₦1', 'Exclusive deals', 'Free shipping all orders', 'VIP support', 'Special gifts']
    },
    {
      name: 'Platinum',
      minPoints: 50000,
      maxPoints: Infinity,
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      benefits: ['Earn 2 points per ₦1', 'Personal stylist', 'Free express shipping', 'VIP events', 'Concierge service', 'Premium gifts']
    }
  ];

  const getCurrentTier = () => {
    const lifetimePoints = loyaltyPoints?.lifetime_points || 0;
    return tiers.find(tier => lifetimePoints >= tier.minPoints && lifetimePoints <= tier.maxPoints) || tiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = tiers.findIndex(t => t.name === currentTier.name);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const calculateProgress = () => {
    const lifetimePoints = loyaltyPoints?.lifetime_points || 0;
    const currentTier = getCurrentTier();
    const nextTier = getNextTier();
    
    if (!nextTier) return 100;
    
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    const currentProgress = lifetimePoints - currentTier.minPoints;
    return (currentProgress / tierRange) * 100;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progress = calculateProgress();
  const CurrentTierIcon = currentTier.icon;

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

            {/* Current Tier Status */}
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CurrentTierIcon className={`h-6 w-6 ${currentTier.color}`} />
                    Current Tier: {currentTier.name}
                  </CardTitle>
                  <Badge className={`${currentTier.bgColor} ${currentTier.color}`}>
                    {loyaltyPoints?.lifetime_points.toLocaleString()} Lifetime Points
                  </Badge>
                </div>
                <CardDescription>
                  {nextTier 
                    ? `${(nextTier.minPoints - (loyaltyPoints?.lifetime_points || 0)).toLocaleString()} points until ${nextTier.name} tier`
                    : 'You\'ve reached the highest tier!'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {nextTier && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                )}
                <div className="grid gap-2 pt-2">
                  <h4 className="font-semibold text-sm">Your Current Benefits:</h4>
                  <div className="grid gap-2">
                    {currentTier.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-gold" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Points Summary */}
            <LoyaltyPointsCard />

            {/* All Reward Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>Rewards Tiers</CardTitle>
                <CardDescription>
                  Unlock more benefits as you shop and earn lifetime points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {tiers.map((tier) => {
                    const TierIcon = tier.icon;
                    const isCurrentTier = tier.name === currentTier.name;
                    return (
                      <div
                        key={tier.name}
                        className={`relative p-6 rounded-lg border-2 transition-all ${
                          isCurrentTier
                            ? 'border-gold bg-gold/5 shadow-lg'
                            : 'border-border bg-card hover:border-gold/50'
                        }`}
                      >
                        {isCurrentTier && (
                          <Badge className="absolute -top-3 left-4 bg-gold text-gold-foreground">
                            Current Tier
                          </Badge>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-full ${tier.bgColor}`}>
                            <TierIcon className={`h-6 w-6 ${tier.color}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{tier.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {tier.minPoints.toLocaleString()}
                              {tier.maxPoints !== Infinity && `- ${tier.maxPoints.toLocaleString()}`}
                              {tier.maxPoints === Infinity && '+'} points
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {tier.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <div className="mt-0.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                              </div>
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Member Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Exclusive Member Benefits</CardTitle>
                <CardDescription>
                  Enjoy these perks as a valued member of our loyalty program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <div className="p-3 rounded-full bg-gold/10 w-fit">
                      <Truck className="h-6 w-6 text-gold" />
                    </div>
                    <h3 className="font-semibold">Free Shipping</h3>
                    <p className="text-sm text-muted-foreground">
                      Get free delivery on qualifying orders based on your tier level
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-full bg-gold/10 w-fit">
                      <Tag className="h-6 w-6 text-gold" />
                    </div>
                    <h3 className="font-semibold">Exclusive Deals</h3>
                    <p className="text-sm text-muted-foreground">
                      Access special promotions and member-only discounts
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-full bg-gold/10 w-fit">
                      <Calendar className="h-6 w-6 text-gold" />
                    </div>
                    <h3 className="font-semibold">Early Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Shop new collections before they're available to everyone
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-full bg-gold/10 w-fit">
                      <Gift className="h-6 w-6 text-gold" />
                    </div>
                    <h3 className="font-semibold">Birthday Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive a special birthday gift every year
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-full bg-gold/10 w-fit">
                      <Crown className="h-6 w-6 text-gold" />
                    </div>
                    <h3 className="font-semibold">VIP Treatment</h3>
                    <p className="text-sm text-muted-foreground">
                      Priority customer service and dedicated support
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-full bg-gold/10 w-fit">
                      <Sparkles className="h-6 w-6 text-gold" />
                    </div>
                    <h3 className="font-semibold">Surprise Perks</h3>
                    <p className="text-sm text-muted-foreground">
                      Random bonus points and exclusive surprise gifts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
