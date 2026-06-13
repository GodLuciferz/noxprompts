import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id, user_email, cashfree_order_id, easysmm_order_id,
      service_id, service_name, link, quantity, amount, status, refill_eligible
    } = body;

    const { error } = await supabase.from('smm_orders').insert({
      user_id,
      user_email,
      cashfree_order_id,
      easysmm_order_id,
      service_id: String(service_id),
      service_name,
      link,
      quantity,
      amount,
      status: status || 'pending',
      refill_eligible: refill_eligible || false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
