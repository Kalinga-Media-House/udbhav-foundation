import path from 'path';
import { fileURLToPath } from 'url';

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.from('enquiries').select('status').limit(100);
  if (error) {
    console.error('Error fetching enquiries:', error);
  } else {
    const statuses = new Set(data.map(d => d.status));
    console.log('Unique statuses in DB:', Array.from(statuses));
  }
}
run();
