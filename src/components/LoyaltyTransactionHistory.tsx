import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const LoyaltyTransactionHistory = () => {
  const { transactions, loading } = useLoyaltyPoints();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'redeemed':
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'adjusted':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTransactionBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      earned: 'default',
      redeemed: 'secondary',
      expired: 'outline',
      adjusted: 'outline',
    };
    return variants[type] || 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Your recent loyalty points activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Start shopping to earn points!</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getTransactionIcon(transaction.transaction_type)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getTransactionBadge(transaction.transaction_type)}>
                          {transaction.transaction_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {transaction.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.points_change > 0
                          ? 'text-green-500'
                          : 'text-orange-500'
                      }`}
                    >
                      {transaction.points_change > 0 ? '+' : ''}
                      {transaction.points_change}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyTransactionHistory;
