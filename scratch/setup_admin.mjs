import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  const email = 'admin@udbhav.org';
  const password = 'password123';

  console.log(`Setting up user ${email}...`);

  // 1. Create or get user
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  
  let user = usersData?.users.find(u => u.email === email);
  if (!user) {
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (createError) {
      console.error('Failed to create user:', createError);
      process.exit(1);
    }
    user = createData.user;
    console.log(`Created user ${user.id}`);
  } else {
    console.log(`User already exists: ${user.id}`);
  }

  // 2. Get super-admin role
  const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('slug', 'super-admin')
    .single();

  if (roleError || !roleData) {
    console.error('Failed to find super-admin role:', roleError);
    process.exit(1);
  }

  console.log(`Found super-admin role: ${roleData.id}`);

  // 3. Assign role
  const { error: assignError } = await supabase
    .from('user_roles')
    .upsert({
      user_id: user.id,
      role_id: roleData.id,
      is_primary: true,
      is_active: true
    }, { onConflict: 'user_id,role_id' });

  if (assignError) {
    console.error('Failed to assign role:', assignError);
    process.exit(1);
  }

  console.log('Role assigned successfully');

  // 4. Upsert profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      slug: 'super-admin',
      primary_email: email,
      first_name: 'Super',
      last_name: 'Admin',
      phone: '1234567890',
      status: 'active'
    });

  if (profileError) {
    console.error('Failed to upsert profile:', profileError);
    process.exit(1);
  }

  console.log('Profile created successfully');
  console.log('Admin setup complete!');
}

setupAdmin().catch(console.error);
