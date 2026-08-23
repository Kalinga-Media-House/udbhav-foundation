/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: 'c:\\Projects\\udbhav-foundation\\.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('gallery_albums').select('*').limit(1);
  if (error) {
    console.error('Error fetching gallery_albums:', error.message);
  } else {
    console.log('Success:', data);
  }
}

check();

