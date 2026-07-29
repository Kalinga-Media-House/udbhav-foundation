import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  console.log('--- Automations Verification ---');
  // Check tables
  const tables = ['automation_audit_logs', 'background_jobs', 'email_logs', 'notifications', 'tax_receipts'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.error(`❌ Table ${table} is not accessible:`, error.message);
    } else {
      console.log(`✅ Table ${table} is accessible (rows: ${data.length >= 0 ? 'ok' : 'err'})`);
    }
  }

  // Check new columns
  const { data: taxData, error: taxError } = await supabase.from('tax_receipts').select('r2_url, financial_year').limit(1);
  if (taxError) {
    console.error('❌ Tax receipts columns missing:', taxError.message);
  } else {
    console.log('✅ Tax receipts new columns exist.');
  }

  console.log('Verification completed.');
}

run();
