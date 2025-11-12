import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderData {
  order_id: string;
  user_id: string;
  subtotal: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { order_id, user_id, subtotal }: OrderData = await req.json();

    if (!order_id || !user_id || !subtotal) {
      console.error('Missing required fields:', { order_id, user_id, subtotal });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Awarding loyalty points for order:', { order_id, user_id, subtotal });

    // Calculate points (1 point per ₦1)
    const pointsEarned = Math.floor(subtotal);

    // Get current loyalty points
    const { data: currentPoints, error: fetchError } = await supabase
      .from('loyalty_points')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching loyalty points:', fetchError);
      throw fetchError;
    }

    let newBalance = pointsEarned;
    let newLifetimePoints = pointsEarned;

    if (currentPoints) {
      newBalance = currentPoints.points_balance + pointsEarned;
      newLifetimePoints = currentPoints.lifetime_points + pointsEarned;

      // Update existing points
      const { error: updateError } = await supabase
        .from('loyalty_points')
        .update({
          points_balance: newBalance,
          lifetime_points: newLifetimePoints,
        })
        .eq('user_id', user_id);

      if (updateError) {
        console.error('Error updating loyalty points:', updateError);
        throw updateError;
      }
    } else {
      // Create new loyalty points record
      const { error: insertError } = await supabase
        .from('loyalty_points')
        .insert({
          user_id,
          points_balance: newBalance,
          lifetime_points: newLifetimePoints,
        });

      if (insertError) {
        console.error('Error creating loyalty points:', insertError);
        throw insertError;
      }
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('loyalty_transactions')
      .insert({
        user_id,
        order_id,
        points_change: pointsEarned,
        transaction_type: 'earned',
        description: `Earned ${pointsEarned} points from order ${order_id.slice(0, 8)}`,
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }

    console.log('Successfully awarded points:', {
      user_id,
      points_earned: pointsEarned,
      new_balance: newBalance,
    });

    return new Response(
      JSON.stringify({
        success: true,
        points_earned: pointsEarned,
        new_balance: newBalance,
        lifetime_points: newLifetimePoints,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in award-loyalty-points function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
