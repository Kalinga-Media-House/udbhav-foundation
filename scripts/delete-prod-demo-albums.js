/* eslint-disable */
require('dotenv').config({ path: '.env.production' }); // Ensure you run this with your production env variables
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDemoAlbums() {
  const targetTitles = ['XFDFBCB', 'Trail'];
  console.log(`Starting cleanup for albums matching titles: ${targetTitles.join(', ')}`);

  try {
    // 1. Identify albums
    const { data: albums, error: albumsError } = await supabase
      .from('gallery_albums')
      .select('id, title')
      .in('title', targetTitles);

    if (albumsError) throw albumsError;

    if (!albums || albums.length === 0) {
      console.log('No matching demo albums found in the database. They may have already been deleted.');
      return;
    }

    const albumIds = albums.map(a => a.id);
    console.log(`Found ${albums.length} album(s) to delete:`, albums);

    // 2. Identify gallery items associated with these albums
    const { data: items, error: itemsError } = await supabase
      .from('gallery_items')
      .select('id, media_file_id')
      .in('album_id', albumIds);

    if (itemsError) throw itemsError;
    
    const mediaIds = (items || []).map(i => i.media_file_id).filter(id => id);
    const itemIds = (items || []).map(i => i.id);

    console.log(`Found ${itemIds.length} associated gallery item(s).`);

    // 3. Delete gallery items (to respect foreign key constraints)
    if (itemIds.length > 0) {
      const { error: delItemsError } = await supabase
        .from('gallery_items')
        .delete()
        .in('id', itemIds);
      if (delItemsError) throw delItemsError;
      console.log(`Successfully deleted ${itemIds.length} gallery items.`);
    }

    // 4. Delete the albums themselves
    const { error: delAlbumsError } = await supabase
      .from('gallery_albums')
      .delete()
      .in('id', albumIds);
    if (delAlbumsError) throw delAlbumsError;
    console.log(`Successfully deleted ${albumIds.length} gallery albums.`);

    // 5. Delete orphaned media_files (and let storage triggers handle R2 if configured, or manually prune)
    if (mediaIds.length > 0) {
      // Safety check: ensure these media files aren't linked to other remaining gallery_items
      const { data: references } = await supabase
        .from('gallery_items')
        .select('id')
        .in('media_file_id', mediaIds);
        
      if (!references || references.length === 0) {
        const { error: delMediaError } = await supabase
          .from('media_files')
          .delete()
          .in('id', mediaIds);
        if (delMediaError) {
          console.error('Warning: Could not delete media files:', delMediaError);
        } else {
          console.log(`Successfully deleted ${mediaIds.length} orphaned media file records.`);
        }
      } else {
        console.log('Some media files are still referenced by other items. Skipping media deletion.');
      }
    }

    console.log('\n✅ Cleanup complete!');
    console.log(`- Albums deleted: ${albumIds.length}`);
    console.log(`- Gallery Items deleted: ${itemIds.length}`);
    console.log(`- Media records removed: ${mediaIds.length}`);
    console.log('Please verify the public gallery at https://udbhavfoundation.in/gallery');

  } catch (error) {
    console.error('An error occurred during cleanup:', error);
  }
}

cleanDemoAlbums();



