const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: albums, error: err1 } = await supabase.from('gallery_albums').select('*');
  console.log('Albums:', albums?.length, err1 ? err1.message : '');
  if (albums?.length) console.log(albums[0]);

  const { data: items, error: err2 } = await supabase.from('gallery_items').select('*');
  console.log('Items:', items?.length, err2 ? err2.message : '');
  if (items?.length) console.log(items[0]);
}

check();
