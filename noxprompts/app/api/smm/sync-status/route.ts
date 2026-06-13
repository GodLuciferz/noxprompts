import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const EASYSMM_URL = 'https://easysmmpanel.com/api/v2';
const API_KEY = process.env.EASYSMM_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { orderIds } = await req.json(); // array of easysmm_order_id strings

    if (!orderIds || orderIds.length === 0) {
      return NextResponse.json({ updated: 0 });
    }

    // Fetch statuses from EasySMM
    const res = await fetch(EASYSMM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        key: API_KEY,
        action: 'status',
        orders: orderIds.join(','),
      }),
    });

    const statusData = await res.json();

    // Update each order in Supabase
    let updated = 0;
    for (const [orderId, info] of Object.entries(statusData as Record<string, any>)) {
      if (info?.status) {
        await supabase
          .from('smm_orders')
          .update({ status: info.status.toLowerCase() })
          .eq('easysmm_order_id', orderId);
        updated++;
      }
    }

    return NextResponse.json({ updated, statusData });
  } catch (err) {
    console.error('sync-status error:', err);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
