require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  console.log('Using URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  // 1. Fetch as admin (bypass RLS if we have service key, otherwise just use anon)
  const { data: allPrograms, error: err1 } = await supabase.from('programs').select('*');
  console.log('All Programs Count:', allPrograms?.length);
  if (allPrograms && allPrograms.length > 0) {
    console.log('First Program Raw:', JSON.stringify(allPrograms[0], null, 2));
  }
  if (err1) console.error('Error fetching all:', err1);

  // 2. Fetch exactly as public page does (using Anon key to trigger RLS)
  const anonClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: publicPrograms, error: err2 } = await anonClient
    .from('programs')
    .select('*, cover_image:media_files!programs_cover_image_id_fkey(r2_object_key)', { count: 'exact' })
    .eq('is_deleted', false)
    .eq('visibility', 'public');
  
  console.log('Public Query Returned Count:', publicPrograms?.length);
  if (publicPrograms && publicPrograms.length > 0) {
    console.log('First Public Program Raw:', JSON.stringify(publicPrograms[0], null, 2));
  }
  if (err2) console.error('Public Query Error:', err2);
}
test();
