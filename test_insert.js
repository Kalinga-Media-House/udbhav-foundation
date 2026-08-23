/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: 'c:\\Projects\\udbhav-foundation\\.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const newAlbum = {
    album_code: `TEST-${Date.now()}`,
    slug: `test-album-${Date.now()}`,
    title: 'Test Album with Location',
    location: 'Bhubaneswar, Odisha'
  };

  const { data: inserted, error: insertError } = await supabase
    .from('gallery_albums')
    .insert([newAlbum])
    .select();

  if (insertError) {
    console.error('Insert error:', insertError);
    return;
  }
  
  console.log('Inserted:', inserted);
  
  const { data: updated, error: updateError } = await supabase
    .from('gallery_albums')
    .update({ location: 'Cuttack, Odisha' })
    .eq('id', inserted[0].id)
    .select();
    
  if (updateError) {
    console.error('Update error:', updateError);
    return;
  }
  
  console.log('Updated:', updated);
}

testInsert();
