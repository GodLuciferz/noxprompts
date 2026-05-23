import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data } = await supabase
      .from('site_info')
      .select('*')
      .eq('id', 1)
      .single();
    return NextResponse.json(data || {
      title: '', description: '', links: []
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ title: '', description: '', links: [] });
  }
}

export async function POST(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  if (pw !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  await supabase.from('site_info').upsert({ id: 1, ...body });
  return NextResponse.json({ ok: true });
}
