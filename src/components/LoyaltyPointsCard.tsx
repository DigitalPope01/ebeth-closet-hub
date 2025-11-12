import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Gift } from 'lucide-react';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { Skeleton } from '@/components/ui/skeleton';

interface LoyaltyPointsCardProps {
  showRedeemButton?: boolean;
  onRedeem?: () => void;
}

const LoyaltyPointsCard = ({ showRedeemButton = false, onRedeem }: LoyaltyPointsCardProps) => {
  const { loyaltyPoints, loading, calculateDiscountFromPoints } = useLoyaltyPoints();

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyPoints) return null;

  const discountValue = calculateDiscountFromPoints(loyaltyPoints.points_balance);
  const canRedeem = loyaltyPoints.points_balance >= 100;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Loyalty Rewards
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            <Gift className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
        <CardDescription>
          Earn 1 point for every ₦1 spent. Redeem for discounts!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Available Points</p>
            <p className="text-3xl font-bold text-primary">
              {loyaltyPoints.points_balance.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              ≈ ₦{discountValue.toFixed(2)} discount
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Lifetime Points
            </p>
            <p className="text-3xl font-bold text-foreground">
              {loyaltyPoints.lifetime_points.toLocaleString()}
            </p>
          </div>
        </div>

        {showRedeemButton && (
          <Button
            onClick={onRedeem}
            disabled={!canRedeem}
            className="w-full"
            variant="default"
          >
            {canRedeem 
              ? `Redeem Points (Min. 100)`
              : `Need ${100 - loyaltyPoints.points_balance} more points`
            }
          </Button>
        )}

        {!canRedeem && (
          <p className="text-xs text-muted-foreground text-center">
            Minimum 100 points required for redemption
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsCard;
