/* eslint-disable */

import { createClient } from '@supabase/supabase-js';

import { OFFICIAL_INDEX_PROGRAMMES, ADHYAYA_FLAGSHIP_DATA } from '../src/data/index-programmes-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Programs...');

  const programsToInsert = OFFICIAL_INDEX_PROGRAMMES.map((prog, i) => {
    return {
      program_code: `PRG-100${i + 1}`,
      slug: prog.slug,
      title: prog.title,
      subtitle: prog.tagline,
      short_description: prog.shortDescription,
      full_description: prog.fullDescription,
      status: 'active', // Mapping to active
      visibility: 'public',
      is_featured: false,
      display_order: parseInt(prog.programmeNumber, 10),
      metadata: {
        category: prog.category,
        impactPreview: prog.impactPreview,
        impactStats: prog.impactStats,
        purpose: prog.purpose,
        communityNeed: prog.communityNeed,
        approach: prog.approach,
        targetBeneficiaries: prog.targetBeneficiaries,
        majorActivities: prog.majorActivities,
        photoCount: prog.photoCount,
        eventCount: prog.eventCount,
        coverImageUrl: prog.coverImageUrl, // We store original URL in metadata for fallback
        accentColor: prog.accentColor,
      },
    };
  });

  const flagship = {
    program_code: 'FLAGSHIP-001',
    slug: ADHYAYA_FLAGSHIP_DATA.slug,
    title: ADHYAYA_FLAGSHIP_DATA.title,
    subtitle: ADHYAYA_FLAGSHIP_DATA.subtitle,
    short_description: ADHYAYA_FLAGSHIP_DATA.description.substring(0, 500),
    full_description: ADHYAYA_FLAGSHIP_DATA.description,
    status: 'active',
    visibility: 'public',
    is_featured: true,
    display_order: 0,
    metadata: {
      category: 'Community Support',
      coverImageUrl: ADHYAYA_FLAGSHIP_DATA.coverImageUrl,
      secondaryImageUrls: ADHYAYA_FLAGSHIP_DATA.secondaryImageUrls,
      ctaText: ADHYAYA_FLAGSHIP_DATA.ctaText,
      ctaHref: ADHYAYA_FLAGSHIP_DATA.ctaHref,
    }
  };

  const allPrograms = [...programsToInsert, flagship];

  for (const prog of allPrograms) {
    const { error } = await supabase.from('programs').upsert(prog as any, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed to seed ${prog.slug}:`, error.message);
    } else {
      console.log(`Seeded: ${prog.slug}`);
    }
  }

  console.log('Seeding complete.');
}

seed().catch(console.error);

