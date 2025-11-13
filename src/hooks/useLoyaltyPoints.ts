import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LoyaltyPoints {
  id: string;
  points_balance: number;
  lifetime_points: number;
}

export interface LoyaltyTransaction {
  id: string;
  points_change: number;
  transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  description: string | null;
  created_at: string;
}

export const useLoyaltyPoints = () => {
  const { user } = useAuth();
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const POINTS_PER_NAIRA = 1; // 1 point per ₦1 spent
  const NAIRA_PER_POINT = 0.5; // 1 point = ₦0.50 discount

  const fetchLoyaltyPoints = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('loyalty_points' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Initialize points for user if not exists
        const { data: newPoints, error: insertError } = await supabase
          .from('loyalty_points' as any)
          .insert([{ user_id: user.id, points_balance: 0, lifetime_points: 0 }])
          .select()
          .single();

        if (insertError) throw insertError;
        setLoyaltyPoints(newPoints as any);
      } else {
        setLoyaltyPoints(data as any);
      }
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
      toast.error('Failed to load loyalty points');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_transactions' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions((data || []) as any);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const redeemPoints = async (pointsToRedeem: number): Promise<number> => {
    if (!user || !loyaltyPoints) {
      throw new Error('User not authenticated');
    }

    if (pointsToRedeem > loyaltyPoints.points_balance) {
      throw new Error('Insufficient points');
    }

    if (pointsToRedeem < 100) {
      throw new Error('Minimum redemption is 100 points');
    }

    const discountAmount = pointsToRedeem * NAIRA_PER_POINT;

    try {
      // Update points balance
      const { error: updateError } = await supabase
        .from('loyalty_points' as any)
        .update({ points_balance: loyaltyPoints.points_balance - pointsToRedeem })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from('loyalty_transactions' as any)
        .insert([{
          user_id: user.id,
          points_change: -pointsToRedeem,
          transaction_type: 'redeemed',
          description: `Redeemed ${pointsToRedeem} points for ₦${discountAmount.toFixed(2)} discount`
        }]);

      if (transactionError) throw transactionError;

      await fetchLoyaltyPoints();
      await fetchTransactions();

      return discountAmount;
    } catch (error) {
      console.error('Error redeeming points:', error);
      throw error;
    }
  };

  const calculatePointsFromAmount = (amount: number): number => {
    return Math.floor(amount * POINTS_PER_NAIRA);
  };

  const calculateDiscountFromPoints = (points: number): number => {
    return points * NAIRA_PER_POINT;
  };

  useEffect(() => {
    fetchLoyaltyPoints();
    fetchTransactions();
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('loyalty_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loyalty_points',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchLoyaltyPoints();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'loyalty_transactions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    loyaltyPoints,
    transactions,
    loading,
    redeemPoints,
    calculatePointsFromAmount,
    calculateDiscountFromPoints,
    refresh: fetchLoyaltyPoints,
  };
};
