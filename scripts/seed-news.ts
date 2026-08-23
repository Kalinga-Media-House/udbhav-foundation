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
  console.log('Seeding News & Stories...');

  const articlesToInsert = [
    {
      article_code: 'ART-2026-001',
      slug: 'udbhav-expands-adhyaya-scholarship',
      title: 'UDBHAV Foundation Expands Adhyaya Scholarship to 5 New Districts',
      subtitle: 'Bringing higher education within reach for over 500 rural girls.',
      summary: 'Our flagship Adhyaya scholarship programme is expanding to Koraput, Kalahandi, Rayagada, Nabarangpur, and Malkangiri, supporting tuition, mentorship, and digital devices.',
      content: `# Expanding Educational Horizons Across Southern Odisha

We are thrilled to announce that the **Adhyaya — Ramp of Inclusion** scholarship programme is officially expanding to five new districts in southern Odisha: Koraput, Kalahandi, Rayagada, Nabarangpur, and Malkangiri.

## What the Expansion Includes
- **Full Tuition Coverage:** For 500 meritorious students from tribal and rural communities.
- **Digital Empowerment:** Every scholar receives a dedicated learning tablet with preloaded offline educational modules.
- **Dedicated Mentorship:** Pairing each student with a university graduate or professional mentor for career guidance.

> "Education is the most sustainable bridge out of poverty. By reaching the remotest corners of Odisha, we ensure talent never goes unrecognized." — *UDBHAV Leadership*

We invite donors and volunteers to join us in supporting these extraordinary young learners.`,
      category: 'News',
      author_name: 'UDBHAV Communications Team',
      author_role: 'Media Desk',
      status: 'Published',
      visibility: 'public',
      is_featured: true,
      published_at: new Date('2026-07-15T09:00:00Z').toISOString(),
      reading_time: 3,
      tags: ['Education', 'Scholarship', 'Odisha', 'Adhyaya', 'GirlsEducation'],
      metadata: {
        seo_title: 'Adhyaya Scholarship Expansion in Odisha | UDBHAV Foundation',
        seo_description: 'UDBHAV Foundation expands the Adhyaya scholarship programme to 5 new tribal districts across Odisha, empowering over 500 rural students.',
        canonical_url: '/news-and-stories/udbhav-expands-adhyaya-scholarship',
      },
    },
    {
      article_code: 'ART-2026-002',
      slug: 'meera-digital-education-transformation',
      title: 'How Meera Found Her Voice Through Digital Education',
      subtitle: 'From a remote village in Kalahandi to a state-level STEM scholarship recipient.',
      summary: 'Read how 16-year-old Meera broke barriers in digital literacy, becoming a mentor for young girls in her village and securing a STEM scholarship.',
      content: `# Meera's Journey of Determination and Tech Literacy

In a quiet village near Bhawanipatna, Kalahandi, 16-year-old Meera used to travel 8 kilometers by bicycle each day just to attend high school. When computer literacy classes were introduced via UDBHAV's **Adhyaya** initiative, Meera was the first to register.

## Overcoming Hurdles
"I had never touched a laptop before," Meera recalls. "At first, I was terrified I would break it. But our mentor showed us that technology is just a tool for learning."

Within six months, Meera not only mastered basic computing but began learning introductory Python programming and web design.

## Paying It Forward
Today, Meera conducts Sunday digital literacy workshops for 20 younger girls in her community. Her story is a testament to the ripple effect of grassroots education.`,
      category: 'Story',
      author_name: 'Priya Sharma',
      author_role: 'Community Storyteller',
      status: 'Published',
      visibility: 'public',
      is_featured: true,
      published_at: new Date('2026-07-10T10:30:00Z').toISOString(),
      reading_time: 4,
      tags: ['Changemakers', 'DigitalLiteracy', 'Kalahandi', 'WomenInSTEM'],
      metadata: {
        seo_title: 'Meera’s Transformation Story | UDBHAV Foundation',
        seo_description: 'How a 16-year-old from Kalahandi became a digital literacy mentor and STEM scholar through UDBHAV Foundation.',
        canonical_url: '/news-and-stories/meera-digital-education-transformation',
      },
    },
    {
      article_code: 'ART-2026-003',
      slug: 'solar-initiative-1000-homes',
      title: 'Community Solar Power Initiative Reaches 1,000 Homes in Koraput',
      subtitle: 'Sustainable clean energy bringing light and safety to off-grid tribal hamlets.',
      summary: 'Our Project Grama Jyoti milestone marks 1,000 households equipped with community-managed solar lighting systems and streetlamps.',
      content: `# Light for Every Hamlet: Project Grama Jyoti Milestone

Access to reliable lighting after sunset transforms rural life—enabling children to study safely, protecting livestock, and fostering evening community gatherings.

## By The Numbers
- **1,000 Households:** Equipped with independent home solar lighting kits.
- **45 Streetlamps:** Installed in community squares across 12 hamlets.
- **30 Local Technicians:** Trained in basic solar maintenance and battery care.

This project demonstrates the power of decentralized clean energy in rural Odisha.`,
      category: 'Story',
      author_name: 'Rajesh Mohanty',
      author_role: 'Programme Coordinator',
      status: 'Published',
      visibility: 'public',
      is_featured: false,
      published_at: new Date('2026-07-02T14:00:00Z').toISOString(),
      reading_time: 3,
      tags: ['CleanEnergy', 'Koraput', 'RuralDevelopment', 'Sustainability'],
      metadata: {
        seo_title: 'Community Solar Lighting Reaches 1000 Homes | UDBHAV Foundation',
        seo_description: 'UDBHAV Foundation reaches milestone of 1,000 homes lighted with solar power across tribal hamlets in Koraput.',
        canonical_url: '/news-and-stories/solar-initiative-1000-homes',
      },
    },
    {
      article_code: 'ART-2026-004',
      slug: 'annual-transparency-report-2025',
      title: 'UDBHAV Foundation Annual Transparency & Impact Report 2025-2026',
      subtitle: 'Complete financial accountability, audited metrics, and programme outcomes.',
      summary: 'Download and explore our comprehensive annual report detailing how every rupee contributed to grassroots transformation across our 11 Index Programmes.',
      content: `# Our Pledge of Radical Transparency

At UDBHAV Foundation, we believe trust is earned through clear, verifiable reporting. Our Annual Impact & Financial Transparency Report for 2025–2026 is now available.

## Key Highlights of the Report
- **89.4% Programme Efficiency:** More than 89 paise of every rupee directly funded on-the-ground initiatives.
- **11 Index Programmes:** Reached over 45,000 direct beneficiaries across 14 districts in Odisha.
- **100% Digital Audit Compliance:** Full traceability of funds from donation to execution.

We thank our global community of donors, volunteers, and well-wishers for making this impact possible.`,
      category: 'Report',
      author_name: 'UDBHAV Finance & Audit Committee',
      author_role: 'Governance Board',
      status: 'Published',
      visibility: 'public',
      is_featured: false,
      published_at: new Date('2026-06-25T08:00:00Z').toISOString(),
      reading_time: 5,
      tags: ['Transparency', 'AnnualReport', 'ImpactMetrics', 'Governance'],
      metadata: {
        seo_title: 'Annual Transparency & Impact Report 2025-26 | UDBHAV Foundation',
        seo_description: 'Read the official UDBHAV Foundation Annual Transparency and Impact Report for 2025-2026.',
        canonical_url: '/news-and-stories/annual-transparency-report-2025',
      },
    },
  ];

  for (const art of articlesToInsert) {
    const { error } = await supabase.from('news_articles').upsert(art as any, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed to seed ${art.slug}:`, error.message);
    } else {
      console.log(`Seeded: ${art.slug}`);
    }
  }

  console.log('News & Stories Seeding Complete.');
}

seed().catch(console.error);

