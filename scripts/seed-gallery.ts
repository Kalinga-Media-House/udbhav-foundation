/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Fetching programs to associate gallery albums with...');

  const { data: programs, error: programError } = await supabase.from('programs').select('id, slug, title');

  if (programError || !programs || programs.length === 0) {
    console.error('No programs found. Please seed programs first.');
    process.exit(1);
  }

  const flagshipProgram = programs.find((p) => p.slug === 'adhyaya-ramp-of-inclusion') || programs[0];
  const secondProgram = programs.length > 1 ? programs[1] : programs[0];

  console.log('Inserting sample media objects for gallery seed...');
  const mediaSamples = [
    {
      bucket_name: 'udbhav-media',
      file_path: 'gallery/sample-1.jpg',
      file_name: 'sample-1.jpg',
      file_size_bytes: 245000,
      mime_type: 'image/jpeg',
      public_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 800,
      alt_text: 'Students studying in classroom',
      caption: 'Children learning mathematics at Adhyaya learning center',
      is_deleted: false,
    },
    {
      bucket_name: 'udbhav-media',
      file_path: 'gallery/sample-2.jpg',
      file_name: 'sample-2.jpg',
      file_size_bytes: 310000,
      mime_type: 'image/jpeg',
      public_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 800,
      alt_text: 'Community outreach gathering',
      caption: 'Community meeting with village elders and parents',
      is_deleted: false,
    },
    {
      bucket_name: 'udbhav-media',
      file_path: 'gallery/sample-3.jpg',
      file_name: 'sample-3.jpg',
      file_size_bytes: 280000,
      mime_type: 'image/jpeg',
      public_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 800,
      alt_text: 'Volunteer teaching young students',
      caption: 'Dedicated volunteers mentoring primary school students',
      is_deleted: false,
    },
  ];

  const { data: insertedMedia, error: mediaError } = await supabase
    .from('media_objects')
    .insert(mediaSamples)
    .select('id, public_url');

  if (mediaError) {
    console.error('Error inserting media samples:', mediaError);
    process.exit(1);
  }

  console.log(`Inserted ${insertedMedia?.length || 0} media objects.`);

  console.log('Inserting gallery albums...');
  const albumsToInsert = [
    {
      album_code: 'GAL-2026-001',
      slug: 'annual-adhyaya-scholarship-gala-2026',
      title: 'Annual Adhyaya Scholarship Gala 2026',
      description: 'A visual celebration of scholarship distribution and student achievements across Odisha.',
      visibility: 'public',
      program_id: flagshipProgram.id,
      cover_image_id: insertedMedia && insertedMedia.length > 0 ? insertedMedia[0].id : null,
      is_featured: true,
      display_order: 1,
      is_deleted: false,
    },
    {
      album_code: 'GAL-2026-002',
      slug: 'community-healthcare-drive-2026',
      title: 'Community Healthcare & Wellness Outreach',
      description: 'Photos from our recent mobile health camps in remote rural communities.',
      visibility: 'public',
      program_id: secondProgram.id,
      cover_image_id: insertedMedia && insertedMedia.length > 1 ? insertedMedia[1].id : null,
      is_featured: true,
      display_order: 2,
      is_deleted: false,
    },
  ];

  const { data: insertedAlbums, error: albumError } = await supabase
    .from('gallery_albums')
    .upsert(albumsToInsert, { onConflict: 'slug' })
    .select('id, slug, title');

  if (albumError) {
    console.error('Error seeding albums:', albumError);
    process.exit(1);
  }

  console.log('Successfully seeded gallery albums:', insertedAlbums?.map((a) => a.title).join(', '));

  if (insertedAlbums && insertedAlbums.length > 0 && insertedMedia && insertedMedia.length > 0) {
    console.log('Associating photos with seeded albums...');
    const galleryItems = [
      {
        album_id: insertedAlbums[0].id,
        media_id: insertedMedia[0].id,
        title: 'Classroom Session',
        caption: 'Students engaged in interactive science learning.',
        display_order: 1,
        is_featured: true,
        is_deleted: false,
      },
      {
        album_id: insertedAlbums[0].id,
        media_id: insertedMedia[2].id,
        title: 'Mentorship Workshop',
        caption: 'Volunteers helping children with reading skills.',
        display_order: 2,
        is_featured: false,
        is_deleted: false,
      },
      {
        album_id: insertedAlbums[1].id,
        media_id: insertedMedia[1].id,
        title: 'Community Meeting',
        caption: 'Village leaders discussing healthcare initiatives.',
        display_order: 1,
        is_featured: true,
        is_deleted: false,
      },
    ];

    const { error: itemsError } = await supabase.from('gallery_items').insert(galleryItems);
    if (itemsError) {
      console.error('Error inserting gallery items:', itemsError);
    } else {
      console.log('Successfully added gallery items to albums.');
    }
  }

  console.log('Gallery seeding complete!');
}

seed().catch((err) => {
  console.error('Unexpected error during gallery seed:', err);
  process.exit(1);
});

