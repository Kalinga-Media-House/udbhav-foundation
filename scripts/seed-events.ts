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
  console.log('Fetching programs to associate events with...');
  
  const { data: programs, error: programError } = await supabase.from('programs').select('id, slug, title');
  
  if (programError || !programs || programs.length === 0) {
    console.error('No programs found. Please seed programs first.');
    process.exit(1);
  }

  // Get the flagship program or just use the first one
  const flagshipProgram = programs.find(p => p.slug === 'adhyaya-ramp-of-inclusion') || programs[0];

  const eventsToInsert = [
    {
      event_code: 'EVT-2026-001',
      slug: 'annual-adhyaya-scholarship-distribution',
      title: 'Annual Adhyaya Scholarship Distribution',
      subtitle: 'Empowering the next generation of leaders.',
      description: 'A ceremony to distribute scholarships to meritorius students from underprivileged backgrounds.',
      program_id: flagshipProgram.id,
      status: 'Published',
      visibility: 'public',
      event_type: 'Ceremony',
      venue_name: 'Main Auditorium, Community Center',
      city: 'Bhubaneswar',
      state: 'Odisha',
      start_time: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      end_time: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      max_attendees: 500,
      registered_count: 0,
      is_featured: true,
      metadata: {
        is_virtual: false,
        registration_deadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    },
    {
      event_code: 'EVT-2026-002',
      slug: 'virtual-mentorship-kickoff',
      title: 'Virtual Mentorship Kickoff 2026',
      subtitle: 'Connecting students with industry professionals.',
      description: 'Online kickoff event for our new mentorship program.',
      program_id: flagshipProgram.id,
      status: 'Registration Open',
      visibility: 'public',
      event_type: 'Workshop',
      is_featured: false,
      start_time: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      max_attendees: 100,
      registered_count: 0,
      metadata: {
        is_virtual: true,
        virtual_link: 'https://zoom.us/j/placeholder',
      }
    }
  ];

  console.log('Seeding Events...');

  for (const evt of eventsToInsert) {
    const { error } = await supabase.from('events').upsert(evt as any, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed to seed ${evt.slug}:`, error.message);
    } else {
      console.log(`Seeded: ${evt.slug}`);
    }
  }

  console.log('Seeding complete.');
}

seed().catch(console.error);

