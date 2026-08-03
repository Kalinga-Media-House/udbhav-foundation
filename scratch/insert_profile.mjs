import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find(u => u.email === 'admin@udbhav.org');
  
  if (user) {
    const { data: profile, error } = await supabase.from('profiles').insert({
        id: user.id,
        primary_email: 'admin@udbhav.org',
        first_name: 'Test',
        last_name: 'Admin'
    }).select();
    console.log('Insert Result:', profile);
    console.log('Insert Error:', error);
  }
}
check();
