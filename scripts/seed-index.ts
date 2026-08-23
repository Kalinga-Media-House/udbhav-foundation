/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

import { OFFICIAL_INDEX_PROGRAMMES } from '../src/data/index-programmes-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedIndexInitiatives() {
  console.log('Seeding Foundation Index Initiatives (Historical Booklet Archive)...');

  const yearsMap: Record<string, number> = {
    '01': 2025,
    '02': 2024,
    '03': 2024,
    '04': 2023,
    '05': 2025,
    '06': 2023,
    '07': 2024,
    '08': 2022,
    '09': 2025,
    '10': 2023,
    '11': 2024,
  };

  const toInsert = OFFICIAL_INDEX_PROGRAMMES.map((prog) => {
    const num = prog.programmeNumber;
    return {
      title: prog.title,
      slug: prog.slug,
      initiative_type: prog.category,
      short_summary: prog.shortDescription,
      description: prog.fullDescription,
      event_date: null,
      year: yearsMap[num] || 2024,
      location: 'Bhubaneswar, Odisha',
      beneficiaries: prog.impactPreview || 'Community Members Supported',
      volunteers: '25+ Active Volunteers',
      chief_guest: 'Honorable Community Leaders & Educators',
      outcome: prog.purpose,
      duration: 'Annual / Ongoing Initiative',
      partner_name: prog.partnerText || null,
      featured: num === '01' || num === '02' || num === '05',
      display_order: parseInt(num, 10),
      seo_title: `${prog.title} | Programs & Initiatives Archive`,
      seo_description: prog.shortDescription,
      seo_keywords: ['udbhav foundation', prog.category.toLowerCase(), 'odisha', 'community action'],
      status: 'Published',
      published_at: new Date().toISOString(),
      is_deleted: false,
    };
  });

  for (const item of toInsert) {
    const { data: existing } = await supabase
      .from('index_initiatives')
      .select('id')
      .eq('slug', item.slug)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('index_initiatives')
        .update(item)
        .eq('id', existing.id);
      if (error) {
        console.error(`Error updating initiative ${item.title}:`, error.message);
      } else {
        console.log(`Updated initiative: ${item.title}`);
      }
    } else {
      const { error } = await supabase.from('index_initiatives').insert(item);
      if (error) {
        console.error(`Error inserting initiative ${item.title}:`, error.message);
      } else {
        console.log(`Inserted initiative: ${item.title}`);
      }
    }
  }

  console.log('Finished seeding Foundation Index Initiatives!');
}

seedIndexInitiatives()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding script failed:', err);
    process.exit(1);
  });

