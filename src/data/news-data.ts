import {
  AnnouncementItem,
  UpcomingEventItem,
  NewsPostItem,
  ProgrammeUpdateSummary,
  ImpactStoryItem,
  PodcastEpisodeItem,
} from "@/types/news";
import { IndexProgramme } from "@/types/gallery";
import { INDEX_PROGRAMMES } from "@/data/gallery-data";

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-01",
    text: "Applications are now open for upcoming UDBHAV volunteer programmes across 11 Index Programmes • Join our grassroots mission",
    linkUrl: "/volunteers",
    priority: "high",
    publishedAt: "2026-07-10T08:00:00Z",
  },
  {
    id: "ann-02",
    text: "Join our next Community Plantation Drive in Bhubaneswar on 20 July 2026 • Register to plant saplings",
    linkUrl: "#upcoming-events",
    priority: "normal",
    publishedAt: "2026-07-11T09:00:00Z",
  },
  {
    id: "ann-03",
    text: "New UDBHAV Podcast Episode 01 released: Student Achiever & Young Changemaker journey of giving back",
    linkUrl: "#udbhav-podcast",
    priority: "normal",
    publishedAt: "2026-07-12T10:00:00Z",
  },
];

export const UPCOMING_EVENTS: UpcomingEventItem[] = [
  {
    id: "uev-01",
    title: "Community Plantation Campaign 2026",
    slug: "community-plantation-campaign-2026",
    category: "PLANTATION DRIVE",
    programmeSlug: "plantation-drive",
    description:
      "Join UDBHAV volunteers in creating a greener and more sustainable community by planting indigenous shade and fruit saplings.",
    imageUrl: "/hero/hero-01.png",
    location: "Bhubaneswar, Odisha",
    eventDate: "20 July 2026",
    dayMonthBadge: { day: "20", month: "JUL" },
    startTime: "7:00 AM",
    endTime: "11:30 AM",
    registrationStatus: "Registration Open",
    registrationDeadline: "18 July 2026",
    registrationUrl: "/volunteers",
  },
  {
    id: "uev-02",
    title: "UDBHAV Siksha Samman Mentorship Orientation",
    slug: "siksha-samman-mentorship-orientation",
    category: "EDUCATION & MENTORSHIP",
    programmeSlug: "udbhav-siksha-samman",
    description:
      "An interactive academic mentoring session for meritorious rural students starting their higher secondary journey.",
    imageUrl: "/hero/hero-04.png",
    location: "Cuttack, Odisha",
    eventDate: "26 July 2026",
    dayMonthBadge: { day: "26", month: "JUL" },
    startTime: "10:00 AM",
    endTime: "1:30 PM",
    registrationStatus: "Registration Open",
    registrationDeadline: "24 July 2026",
    registrationUrl: "/volunteers",
  },
  {
    id: "uev-03",
    title: "Free Civil Services Aspirants Conclave",
    slug: "free-civil-services-aspirants-conclave",
    category: "FREE CIVIL SERVICES COACHING",
    programmeSlug: "free-civil-services-coaching",
    description:
      "Open classroom session with experienced mentors guiding UPSC and OPSC aspirants on answer writing and ethics.",
    imageUrl: "/hero/hero-02.png",
    location: "Bhubaneswar, Odisha",
    eventDate: "02 August 2026",
    dayMonthBadge: { day: "02", month: "AUG" },
    startTime: "10:30 AM",
    endTime: "3:30 PM",
    registrationStatus: "Coming Soon",
  },
  {
    id: "uev-04",
    title: "Monsoon Health Check-up & Screening Camp",
    slug: "monsoon-health-checkup-camp",
    category: "HEALTH CHECK-UP CAMPS",
    programmeSlug: "health-checkup-camps",
    description:
      "Free community screening camp providing general check-ups, diagnostic guidance, and pediatric consultations.",
    imageUrl: "/hero/hero-08.png",
    location: "Angul, Odisha",
    eventDate: "09 August 2026",
    dayMonthBadge: { day: "09", month: "AUG" },
    startTime: "8:30 AM",
    endTime: "2:00 PM",
    registrationStatus: "Registration Open",
    registrationUrl: "/volunteers",
  },
  {
    id: "uev-05",
    title: "Puri Coastal Climate Action Marathon",
    slug: "puri-coastal-climate-action-marathon",
    category: "CLIMATE ACTION RUN",
    programmeSlug: "climate-action-run",
    description:
      "A sunrise community marathon along the Puri beach road promoting environmental awareness and clean oceans.",
    imageUrl: "/hero/hero-03.png",
    location: "Puri, Odisha",
    eventDate: "16 August 2026",
    dayMonthBadge: { day: "16", month: "AUG" },
    startTime: "6:00 AM",
    endTime: "9:00 AM",
    registrationStatus: "Coming Soon",
  },
];

export const NEWS_POSTS: NewsPostItem[] = [
  {
    id: "post-01",
    title: "Planting Hope: Volunteers Join Community Plantation Drive",
    slug: "planting-hope-volunteers-join-community-plantation-drive",
    excerpt:
      "UDBHAV Foundation volunteers came together to plant over 500 indigenous saplings and encourage environmental responsibility in residential neighborhoods.",
    content: `
UDBHAV Foundation volunteers gathered early Sunday morning across Bhubaneswar for the annual Monsoon Plantation Drive, an initiative designed to expand urban green cover and foster community environmental ownership.

Over 120 young volunteers, college students, and local residents participated in planting indigenous shade and fruit-bearing saplings along community parks and school campuses. Each sapling was paired with a local volunteer guardian who committed to watering and monitoring its growth through the dry season.

“Environmental stewardship starts with personal responsibility,” shared the volunteer coordinator. “When community members plant and nurture trees together, it builds lasting bonds and protects local biodiversity.”
    `.trim(),
    coverImageUrl: "/hero/hero-01.png",
    category: "Programme Activities",
    programmeSlug: "plantation-drive",
    programmeTitle: "Plantation Drive",
    location: "Bhubaneswar, Odisha",
    activityDate: "12 July 2026",
    activityTime: "8:30 AM",
    publishedAt: "2026-07-12T14:00:00Z",
    readingTime: "3 min read",
    author: "UDBHAV Foundation",
    isFeatured: true,
  },
  {
    id: "post-02",
    title: "UDBHAV Siksha Samman 2026 Honors 80 Meritorious Students",
    slug: "udbhav-siksha-samman-2026-honors-80-meritorious-students",
    excerpt:
      "Celebrating rural and underserved students who excelled in higher secondary examinations with scholarships, mentorship support, and study material kits.",
    content: `
At the annual UDBHAV Siksha Samman conclave held in Cuttack, 80 meritorious students from rural and economically challenged backgrounds across Odisha were honored for their scholastic achievements.

Each student received an academic scholarship certificate, comprehensive study material bundles, and enrollment in UDBHAV’s structured year-round mentorship network. Education leaders and governing body members addressed the gathering, emphasizing that talent is universal but opportunity must be actively created.

“Seeing the determination of these young scholars inspires our entire team,” noted one of the mentors.
    `.trim(),
    coverImageUrl: "/hero/hero-04.png",
    category: "Achievements",
    programmeSlug: "udbhav-siksha-samman",
    programmeTitle: "UDBHAV Siksha Samman",
    location: "Cuttack, Odisha",
    activityDate: "05 July 2026",
    activityTime: "10:00 AM",
    publishedAt: "2026-07-06T11:00:00Z",
    readingTime: "4 min read",
    author: "UDBHAV Foundation",
  },
  {
    id: "post-03",
    title: "Empowering UPSC & OPSC Aspirants with Dedicated Mentorship",
    slug: "empowering-upsc-opsc-aspirants-dedicated-mentorship",
    excerpt:
      "Free civil services coaching workshop equips aspiring administrative leaders with essay writing strategies, current affairs analysis, and ethical reasoning.",
    content: `
Under the Free Civil Services Coaching Programme, UDBHAV Foundation conducted an intensive weekend mentorship orientation for over 150 civil services aspirants preparing for state and national examinations.

Senior educators and public administration alumni conducted interactive sessions on analytical essay structure, syllabus decoding, and maintaining mental balance during long preparation cycles. The programme removes financial hurdles for dedicated aspirants from low-income households.
    `.trim(),
    coverImageUrl: "/hero/hero-02.png",
    category: "Daily Updates",
    programmeSlug: "free-civil-services-coaching",
    programmeTitle: "Free Civil Services Coaching",
    location: "Bhubaneswar, Odisha",
    activityDate: "28 June 2026",
    activityTime: "11:00 AM",
    publishedAt: "2026-06-29T09:30:00Z",
    readingTime: "3 min read",
    author: "UDBHAV Foundation",
  },
  {
    id: "post-04",
    title: "Youth Climate Action Run Mobilizes 400+ Runners in Puri",
    slug: "youth-climate-action-run-mobilizes-400-runners-in-puri",
    excerpt:
      "Sunrise coastal run unites citizens, students, and athletes to raise awareness on coastal ecosystem protection and waste reduction.",
    content: `
More than 400 runners participated in the UDBHAV Climate Action Run along the Puri shoreline at sunrise. The event raised awareness about coastal plastic pollution and marine ecosystem conservation.

Following the marathon run, participants joined an organized beach cleaning drive, collecting over 300 kilograms of recyclable marine debris.
    `.trim(),
    coverImageUrl: "/hero/hero-03.png",
    category: "Community Stories",
    programmeSlug: "climate-action-run",
    programmeTitle: "Climate Action Run",
    location: "Puri, Odisha",
    activityDate: "20 June 2026",
    activityTime: "6:00 AM",
    publishedAt: "2026-06-21T10:00:00Z",
    readingTime: "3 min read",
    author: "UDBHAV Foundation",
  },
  {
    id: "post-05",
    title: "Distributing 1,200 Book Kits to Primary Schools in Berhampur",
    slug: "distributing-1200-book-kits-to-primary-schools-berhampur",
    excerpt:
      "Grassroots volunteers deliver essential textbooks, notebooks, and learning stationery to primary school children in underserved rural blocks.",
    content: `
Access to basic learning materials is a foundational building block for quality elementary education. Last week, UDBHAV Foundation volunteers distributed 1,200 curated book sets and stationery supplies across five primary schools in Berhampur.

Teachers reported heightened classroom engagement as every child received independent workbooks and reading storybooks.
    `.trim(),
    coverImageUrl: "/hero/hero-05.png",
    category: "Programme Activities",
    programmeSlug: "books-study-materials-distribution",
    programmeTitle: "Books & Study Materials",
    location: "Berhampur, Odisha",
    activityDate: "14 June 2026",
    activityTime: "9:00 AM",
    publishedAt: "2026-06-15T12:00:00Z",
    readingTime: "2 min read",
    author: "UDBHAV Foundation",
  },
  {
    id: "post-06",
    title: "Cyber Safety Workshop Educates College Students on Digital Ethics",
    slug: "cyber-safety-workshop-educates-college-students",
    excerpt:
      "Practical interactive session teaching students how to identify phishing scams, secure digital accounts, and protect personal privacy online.",
    content: `
In an era of increasing digital connectivity, cyber awareness is vital for young adults. UDBHAV Foundation hosted a comprehensive Cyber Safety Awareness seminar at a women's college in Rourkela.

Cybersecurity experts demonstrated real-world examples of identity theft, financial fraud alerts, and privacy safeguards on social media platforms.
    `.trim(),
    coverImageUrl: "/hero/hero-06.png",
    category: "Announcements",
    programmeSlug: "cyber-safety-awareness",
    programmeTitle: "Cyber Safety Awareness",
    location: "Rourkela, Odisha",
    activityDate: "08 June 2026",
    activityTime: "10:30 AM",
    publishedAt: "2026-06-09T15:00:00Z",
    readingTime: "3 min read",
    author: "UDBHAV Foundation",
  },
  {
    id: "post-07",
    title: "Breaking Stigmas: Community Mental Health Resilience Circles",
    slug: "breaking-stigmas-community-mental-health-resilience-circles",
    excerpt:
      "Creating supportive safe spaces for youth and parents to discuss academic stress, emotional well-being, and mindfulness.",
    content: `
Mental health wellness requires empathy, open conversation, and non-judgmental community support. UDBHAV Foundation organized a Mental Health Awareness workshop in Sambalpur led by experienced counselors.

Participants practiced mindfulness techniques, peer listening exercises, and learned practical strategies for coping with academic and career pressures.
    `.trim(),
    coverImageUrl: "/hero/hero-07.png",
    category: "Daily Updates",
    programmeSlug: "mental-health-awareness",
    programmeTitle: "Mental Health Awareness",
    location: "Sambalpur, Odisha",
    activityDate: "01 June 2026",
    activityTime: "3:00 PM",
    publishedAt: "2026-06-02T16:00:00Z",
    readingTime: "3 min read",
    author: "UDBHAV Foundation",
  },
  {
    id: "post-08",
    title: "Free Community Medical Screening Camp Reaches 350+ Residents",
    slug: "free-community-medical-screening-camp-reaches-350-residents",
    excerpt:
      "Volunteer doctors and nurses offer diagnostic check-ups, eye screenings, and nutritional counseling for rural families.",
    content: `
Providing preventive healthcare access directly in underserved neighborhoods, UDBHAV Foundation conducted a one-day Comprehensive Health Check-up Camp in Angul.

A multidisciplinary team of voluntary physicians screened over 350 residents for hypertension, diabetes, vision health, and pediatric nutrition.
    `.trim(),
    coverImageUrl: "/hero/hero-08.png",
    category: "Programme Activities",
    programmeSlug: "health-checkup-camps",
    programmeTitle: "Health Check-up Camps",
    location: "Angul, Odisha",
    activityDate: "24 May 2026",
    activityTime: "8:30 AM",
    publishedAt: "2026-05-25T13:00:00Z",
    readingTime: "3 min read",
    author: "UDBHAV Foundation",
  },
];

export const PROGRAMME_UPDATE_SUMMARIES: ProgrammeUpdateSummary[] =
  INDEX_PROGRAMMES.map((prog: IndexProgramme, idx: number) => {
    const matchingPosts = NEWS_POSTS.filter(
      (p) => p.programmeSlug === prog.slug
    );
    const latestPost = matchingPosts[0];

    const imageList = [
      "/hero/hero-01.png",
      "/hero/hero-04.png",
      "/hero/hero-02.png",
      "/hero/hero-03.png",
      "/hero/hero-05.png",
      "/hero/hero-06.png",
      "/hero/hero-07.png",
      "/hero/hero-08.png",
      "/hero/hero-09.png",
      "/hero/hero-01.png",
      "/hero/hero-02.png",
    ];

    return {
      programmeSlug: prog.slug,
      programmeTitle: prog.title,
      iconName: prog.category,
      coverImageUrl: imageList[idx % imageList.length],
      publishedUpdatesCount: 12 + idx * 3,
      latestUpdateTitle:
        latestPost?.title || `${prog.title} Community Field Initiative`,
      latestActivityDate: latestPost?.activityDate || "05 July 2026",
    };
  });

export const IMPACT_STORIES: ImpactStoryItem[] = [
  {
    id: "story-01",
    title: "A Book, a Dream, and a New Beginning",
    slug: "a-book-a-dream-and-a-new-beginning",
    category: "STUDENT TRANSFORMATION",
    personName: "Subhashree Nayak",
    excerpt:
      "What began as access to study materials became renewed confidence, opportunity, and hope for a student determined to continue learning.",
    content: `
Subhashree grew up in a farming household near Berhampur where purchasing competitive examination guides and reference books often competed with basic family expenses. Despite securing top grades in secondary school, she worried about preparing for higher secondary examinations without standard textbooks.

Through UDBHAV Foundation’s Books & Study Materials Distribution initiative, Subhashree received a complete science reference library along with weekly mentorship check-ins.

“Having the right books in my hands told me that my education mattered to people outside my village,” Subhashree reflects. Today, she is pursuing a Bachelor of Science degree and regularly mentors younger students in her community block.
    `.trim(),
    imageUrl: "/hero/hero-04.png",
    programmeSlug: "books-study-materials-distribution",
    programmeTitle: "Books & Study Materials Distribution",
    location: "Berhampur, Odisha",
    publishedAt: "2026-06-25",
    isFeatured: true,
  },
  {
    id: "story-02",
    title: "From Aspirant to Civic Leader: The Mentorship Difference",
    slug: "from-aspirant-to-civic-leader",
    category: "CIVIL SERVICES JOURNEY",
    personName: "Debasish Pradhan",
    excerpt:
      "How consistent peer guidance and structured coaching helped a young graduate overcome exam anxiety and achieve administrative success.",
    content: `
Preparing for state civil services examinations can feel isolating without structured guidance. Debasish joined the UDBHAV Free Civil Services Coaching study circle in 2024.

With feedback on essay composition and mock interview panels conducted by experienced public servants, Debasish built clarity and discipline. He now serves in state administrative services and returns every quarter to conduct volunteer lectures for new UDBHAV aspirants.
    `.trim(),
    imageUrl: "/hero/hero-02.png",
    programmeSlug: "free-civil-services-coaching",
    programmeTitle: "Free Civil Services Coaching Programme",
    location: "Bhubaneswar, Odisha",
    publishedAt: "2026-06-18",
  },
  {
    id: "story-03",
    title: "Nurturing 200 Trees: A Village Youth Green Collective",
    slug: "nurturing-200-trees-village-youth-collective",
    category: "ENVIRONMENTAL LEADERSHIP",
    personName: "Priyabrata & Eco Volunteers",
    excerpt:
      "A group of college volunteers adopted an open school playground, turning it into a thriving green community grove.",
    content: `
Inspired by UDBHAV Foundation’s Plantation Drive, Priyabrata and ten fellow college students adopted an exposed school boundary in rural Cuttack.

Over two monsoon seasons, they planted native shade trees and created a community watering roster. Today, the grove provides shelter for school gatherings and serves as a model for neighboring villages.
    `.trim(),
    imageUrl: "/hero/hero-01.png",
    programmeSlug: "plantation-drive",
    programmeTitle: "Plantation Drive",
    location: "Cuttack, Odisha",
    publishedAt: "2026-06-10",
  },
  {
    id: "story-04",
    title: "Lifesaving Blood Support at Midnight",
    slug: "lifesaving-blood-support-at-midnight",
    category: "EMERGENCY BLOOD SUPPORT",
    personName: "Ankit Mohapatra & Emergency Team",
    excerpt:
      "When an urgent hospital call came in late at night, UDBHAV’s volunteer blood network mobilized within 30 minutes.",
    content: `
Emergency blood requirements cannot wait until morning. When a district hospital near Puri requested rare blood units for an accident survivor, UDBHAV’s Emergency Blood Donation network coordinated immediately.

Volunteer donors arrived within thirty minutes, providing critical support that helped stabilize the patient’s condition.
    `.trim(),
    imageUrl: "/hero/hero-09.png",
    programmeSlug: "emergency-blood-donation",
    programmeTitle: "Emergency Blood Donation",
    location: "Puri, Odisha",
    publishedAt: "2026-05-28",
  },
];

export const PODCAST_EPISODES: PodcastEpisodeItem[] = [
  {
    id: "pod-01",
    episodeNumber: "EPISODE 01",
    title:
      "From Opportunity to Impact: A Journey of Learning, Growth and Giving Back",
    slug: "from-opportunity-to-impact-journey-of-learning",
    excerpt:
      "In this conversation, we explore the challenges behind the achievement, the importance of mentorship and community support, and how access to the right platform helped transform ambition into meaningful social impact.",
    description: `
The UDBHAV Podcast brings students, young achievers, changemakers, volunteers, educators, and community leaders into meaningful conversations about their struggles, achievements, social impact, and the people and platforms that helped shape their journey.

Through honest conversations, we explore how education, mentorship, opportunity, community support, and platforms such as UDBHAV contributed to their growth—and how their journey now inspires others to create positive change.
    `.trim(),
    thumbnailUrl: "/hero/hero-02.png",
    guest: {
      id: "guest-01",
      fullName: "Student Achiever / Young Changemaker",
      profilePhotoUrl: "/hero/hero-04.png",
      role: "UDBHAV Siksha Samman Scholar & Community Mentor",
      achievement: "Merit Scholar & Grassroots Youth Coordinator",
      biography:
        "An inspiring student leader who overcame socioeconomic barriers through education and now leads local literacy mentorship initiatives.",
      socialImpact:
        "Mentoring 40+ rural school students and coordinating weekend study circles.",
      udbhavContribution:
        "Received UDBHAV academic scholarship support and leadership training through community action programmes.",
    },
    duration: "42:15",
    releaseDate: "10 July 2026",
    youtubeUrl: "https://www.youtube.com/watch?v=udbhav_ep01",
    topics: ["Education", "Student Journey", "Achievement", "Social Impact"],
    isFeatured: true,
  },
  {
    id: "pod-02",
    episodeNumber: "EPISODE 02",
    title: "Building Grassroots Environmental Movement Block by Block",
    slug: "building-grassroots-environmental-movement",
    excerpt:
      "Exploring how youth volunteer collectives mobilize hundreds of citizens for sustainable urban plantation and coastal conservation.",
    description:
      "In our second episode, we speak with grassroots environmental coordinators on the power of community plantation drives and youth stewardship.",
    thumbnailUrl: "/hero/hero-01.png",
    guest: {
      id: "guest-02",
      fullName: "Arati Behera",
      profilePhotoUrl: "/hero/hero-03.png",
      role: "Environmental Action Coordinator",
      achievement: "Led planting of 2,000+ urban trees",
    },
    duration: "38:40",
    releaseDate: "24 June 2026",
    youtubeUrl: "https://www.youtube.com/watch?v=udbhav_ep02",
    topics: ["Environment", "Youth Leadership", "Plantation Drive"],
  },
  {
    id: "pod-03",
    episodeNumber: "EPISODE 03",
    title: "Navigating Civil Services Preparation with Courage and Ethics",
    slug: "navigating-civil-services-preparation-ethics",
    excerpt:
      "Senior mentors share insights on analytical writing, mental resilience, and serving society with compassion and integrity.",
    description:
      "An insightful conversation for every UPSC and OPSC aspirant on balancing rigorous academic prep with community service.",
    thumbnailUrl: "/hero/hero-05.png",
    guest: {
      id: "guest-03",
      fullName: "Prashant Mishra",
      profilePhotoUrl: "/hero/hero-06.png",
      role: "Civil Services Mentor & Educator",
      achievement: "Mentored 300+ public administration aspirants",
    },
    duration: "48:20",
    releaseDate: "12 June 2026",
    youtubeUrl: "https://www.youtube.com/watch?v=udbhav_ep03",
    topics: ["Civil Services", "Mentorship", "Public Service"],
  },
  {
    id: "pod-04",
    episodeNumber: "EPISODE 04",
    title: "Mental Well-Being & Resilience in Student Life",
    slug: "mental-wellbeing-resilience-in-student-life",
    excerpt:
      "Why open conversations around stress, peer pressure, and self-worth are crucial for healthy youth development.",
    description:
      "We discuss destigmatizing mental health support in schools and colleges with volunteer community psychologists.",
    thumbnailUrl: "/hero/hero-07.png",
    guest: {
      id: "guest-04",
      fullName: "Dr. Swati Patnaik",
      profilePhotoUrl: "/hero/hero-08.png",
      role: "Community Mental Health Counselor",
      achievement: "Conducted 50+ youth well-being circles",
    },
    duration: "35:10",
    releaseDate: "28 May 2026",
    youtubeUrl: "https://www.youtube.com/watch?v=udbhav_ep04",
    topics: ["Mental Health", "Youth Well-Being", "Counseling"],
  },
];
