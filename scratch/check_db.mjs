import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find(u => u.email === 'admin@udbhav.org');
  console.log('User ID:', user?.id);
  
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    console.log('Profile:', profile);
    
    const { data: roles } = await supabase.from('user_roles').select('role_id, is_active, roles(slug)').eq('user_id', user.id);
    console.log('Roles:', JSON.stringify(roles, null, 2));
  }
}
check();
