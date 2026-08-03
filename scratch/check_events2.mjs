import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'events' });
  // Since we might not have a generic RPC, let's just insert a dummy row.
  const { data: d, error: e } = await supabase.from('events').insert({ title: 'Test Event', slug: 'test-event-1' }).select();
  if (d && d.length > 0) {
      console.log('Columns:', Object.keys(d[0]));
  } else {
      console.log('Insert error:', e);
  }
}
check();
