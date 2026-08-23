/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

import { listPrograms } from '@/features/programs/actions';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: rawData, error: rawError } = await supabase.from('programs').select('*');

    const result = await listPrograms({ page: 1, limit: 100 }, { visibility: 'public' });
    
    return NextResponse.json({ 
      raw: { data: rawData, error: rawError },
      action: result 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
