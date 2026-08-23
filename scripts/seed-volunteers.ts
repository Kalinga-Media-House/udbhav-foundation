/* eslint-disable */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding Volunteers & Applications...");

  // 1. Seed Historical Applications (never converted in-place per decision #1)
  const applications = [
    {
      id: "a1111111-1111-1111-1111-111111111111",
      full_name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      mobile_number: "9876543210",
      age: 24,
      occupation: "Working Professional",
      city_district: "Guwahati",
      state: "Assam",
      preferred_areas: ["Education & Mentorship", "Technology & Digital Support"],
      skills: "React, Teaching, Event Organizing",
      availability: "Weekends",
      motivation: "Passionate about bridging the digital literacy gap in rural schools.",
      consent: true,
      status: "accepted",
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "a2222222-2222-2222-2222-222222222222",
      full_name: "Meera Nair",
      email: "meera.nair@example.com",
      mobile_number: "9876543211",
      age: 28,
      occupation: "Social Worker",
      city_district: "Kolkata",
      state: "West Bengal",
      preferred_areas: ["Health & Well-being", "Emergency & Community Support"],
      skills: "Medical first aid, counseling, community leadership",
      availability: "Flexible",
      motivation: "Dedicated to improving health outcomes in underserved communities.",
      consent: true,
      status: "pending",
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "a3333333-3333-3333-3333-333333333333",
      full_name: "Rohan Patel",
      email: "rohan.patel@example.com",
      mobile_number: "9876543212",
      age: 21,
      occupation: "College/University Student",
      city_district: "Delhi",
      state: "Delhi",
      preferred_areas: ["Environmental Action", "Events & Campaigns"],
      skills: "Photography, logistics, environmental awareness",
      availability: "Weekends",
      motivation: "Eager to lead campus ambassador initiatives for climate resilience.",
      consent: true,
      status: "pending",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  for (const app of applications) {
    const { error } = await supabase
      .from("volunteer_applications")
      .upsert(app as any, { onConflict: "id" });
    if (error) {
      console.error(`Failed to seed application ${app.full_name}:`, error.message);
    } else {
      console.log(`Seeded application: ${app.full_name} (${app.status})`);
    }
  }

  // 2. Fetch or create a system profile for seeding volunteer records
  const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
  const sampleProfileId = profiles?.[0]?.id || "00000000-0000-0000-0000-000000000000";

  // 3. Seed Active Volunteers with deterministic immutable codes
  const volunteers = [
    {
      id: "v1111111-1111-1111-1111-111111111111",
      profile_id: sampleProfileId,
      volunteer_code: "UDV-2026-0001",
      status: "Active",
      volunteer_type: "Core",
      bio: "Senior Community Educator & Mentor driving STEM education in Assam.",
      motivation: "Empowering rural youth through modern technical education.",
      availability: "Weekends & Flexible",
      total_hours: 48,
      event_count: 6,
      metadata: {
        skills: "Teaching, Project Leadership, Mentorship",
        city_district: "Guwahati",
        state: "Assam",
        activity_logs: [
          {
            id: "act-01",
            hours: 12,
            notes: "Conducted STEM workshop in Guwahati Govt School",
            created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
          },
          {
            id: "act-02",
            hours: 36,
            notes: "Curriculum development & volunteer training",
            created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
          },
        ],
      },
      is_deleted: false,
    },
    {
      id: "v2222222-2222-2222-2222-222222222222",
      profile_id: sampleProfileId,
      volunteer_code: "UDV-2026-0002",
      status: "Active",
      volunteer_type: "Medical",
      bio: "Volunteer Medical Officer assisting in health camps and hygiene awareness.",
      motivation: "Ensuring accessible healthcare for vulnerable populations.",
      availability: "Event Based",
      total_hours: 32,
      event_count: 4,
      metadata: {
        skills: "Medical Care, Health Counseling, Hygiene Awareness",
        city_district: "Kolkata",
        state: "West Bengal",
        activity_logs: [
          {
            id: "act-03",
            hours: 32,
            notes: "Annual Free Medical & Eye Camp",
            created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
          },
        ],
      },
      is_deleted: false,
    },
    {
      id: "v3333333-3333-3333-3333-333333333333",
      profile_id: sampleProfileId,
      volunteer_code: "UDV-2026-0003",
      status: "Active",
      volunteer_type: "Campus Ambassador",
      bio: "University Campus Lead organizing youth environmental rallies and campaigns.",
      motivation: "Mobilizing youth for sustainable climate action.",
      availability: "Weekdays",
      total_hours: 24,
      event_count: 3,
      metadata: {
        skills: "Youth Leadership, Social Media, Public Speaking",
        city_district: "Delhi",
        state: "Delhi",
        activity_logs: [
          {
            id: "act-04",
            hours: 24,
            notes: "Campus Sustainability Drive & Awareness Campaign",
            created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
          },
        ],
      },
      is_deleted: false,
    },
  ];

  for (const vol of volunteers) {
    const { error } = await supabase
      .from("volunteers")
      .upsert(vol as any, { onConflict: "volunteer_code" });
    if (error) {
      console.error(`Failed to seed volunteer ${vol.volunteer_code}:`, error.message);
    } else {
      console.log(`Seeded active volunteer: ${vol.volunteer_code}`);
    }
  }

  console.log("Volunteer seeding complete.");
}

seed().catch(console.error);

