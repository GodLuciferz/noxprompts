import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function auth(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // All orders sorted by newest
  const { data: orders, error } = await supabase
    .from('smm_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = (orders || []).filter(o => new Date(o.created_at) >= today);
  const uniqueUsers = new Set((orders || []).map(o => o.user_email).filter(Boolean));
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);

  return NextResponse.json({
    orders: orders || [],
    stats: {
      totalOrders: orders?.length || 0,
      todayOrders: todayOrders.length,
      totalUsers: uniqueUsers.size,
      totalRevenue: totalRevenue.toFixed(2),
      todayRevenue: todayRevenue.toFixed(2),
    }
  });
}
