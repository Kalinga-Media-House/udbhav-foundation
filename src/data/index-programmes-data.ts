import {
  IndexProgrammeDetail,
  AdhyayaFlagshipData,
  ProgrammeEventItem,
  ProgrammePhotoItem,
} from "@/types/index-programme";

export const OFFICIAL_INDEX_PROGRAMMES: IndexProgrammeDetail[] = [
  {
    id: "idx-prog-01",
    programmeNumber: "01",
    title: "UDBHAV Siksha Samman",
    tagline: "Recognising the Edu-Warriors",
    category: "Education",
    slug: "udbhav-siksha-samman",
    shortDescription:
      "A flagship initiative recognising meritorious underprivileged students from HSC and CHSE backgrounds in Bhubaneswar and nearby regions.",
    fullDescription:
      "UDBHAV Siksha Samman is an annual scholarship and recognition platform dedicated to honoring underprivileged students who have demonstrated extraordinary academic resilience in their Higher Secondary Certificate (HSC) and Council of Higher Secondary Education (CHSE) examinations. Beyond financial scholarship, the programme provides career mentorship, study resources, and continuous guidance.",
    coverImageUrl: "/hero/hero-02.png",
    accentColor: "#439B25",
    impactPreview: "30 Students Supported Annually",
    impactStats: [
      { id: "stat-1-1", label: "Students Supported Annually", value: "30+" },
      { id: "stat-1-2", label: "Higher Education Access Rate", value: "98%" },
      { id: "stat-1-3", label: "Years of Recognition", value: "5+" },
    ],
    purpose:
      "To remove financial and mentorship barriers for meritorious students from low-income communities after standard 10th and 12th board examinations.",
    communityNeed:
      "Underprivileged high achievers often drop out of formal education after high school due to economic strain and lack of structured career guidance.",
    approach:
      "Annual selection of deserving candidates across district schools followed by formal felicitation, scholarship disbursement, and assigned academic mentors.",
    targetBeneficiaries: [
      "Meritorious HSC and CHSE passouts from low-income households",
      "First-generation college learners across Odisha",
    ],
    majorActivities: [
      "Annual Siksha Samman Felicitation Ceremony",
      "One-on-one higher education career counseling",
      "Financial aid and study kit distribution",
    ],
    photoCount: 18,
    eventCount: 4,
  },
  {
    id: "idx-prog-02",
    programmeNumber: "02",
    title: "Free Civil Services Coaching Programme",
    tagline: "Empowering Aspirations, Enabling Leadership",
    category: "Education",
    slug: "free-civil-services-coaching",
    partnerText: "In association with Odisha IAS Academy",
    shortDescription:
      "Free coaching support for SC/ST civil-services aspirants through structured academic guidance, mentorship, and competitive-examination preparation.",
    fullDescription:
      "In proud collaboration with Odisha IAS Academy, UDBHAV Foundation conducts rigorous, structured, and completely free civil services coaching for dedicated aspirants from SC, ST, and underserved communities. The initiative provides classroom coaching, standard reference library access, test series, and mentorship from serving administrative officers.",
    coverImageUrl: "/hero/hero-05.png",
    accentColor: "#202B78",
    impactPreview: "50+ Aspirants Supported",
    impactStats: [
      { id: "stat-2-1", label: "Aspirants Supported", value: "50+" },
      { id: "stat-2-2", label: "Mock Test Modules", value: "40+" },
      { id: "stat-2-3", label: "Expert Mentorship Sessions", value: "100+" },
    ],
    purpose:
      "To democratize administrative leadership by offering elite competitive examination preparation at zero cost to deserving SC/ST candidates.",
    communityNeed:
      "High costs of standard civil services coaching institutes prevent talented rural and marginalized students from entering executive public service.",
    approach:
      "Merit-based intake exam followed by full-time structured coaching in partnership with institutional faculty and administrative leaders.",
    targetBeneficiaries: [
      "SC/ST graduates aspiring for UPSC and OPSC examinations",
      "Economically disadvantaged rural degree holders",
    ],
    majorActivities: [
      "Foundation GS & CSAT Lectures",
      "Weekly Prelims & Mains Answer Writing Workshops",
      "Personalized Mentorship with Administrative Alumni",
    ],
    photoCount: 14,
    eventCount: 3,
  },
  {
    id: "idx-prog-03",
    programmeNumber: "03",
    title: "Plantation Drive",
    tagline: "Think Green. Act Green. Live Green.",
    category: "Environment",
    slug: "plantation-drive",
    shortDescription:
      "A community-driven tree-plantation initiative encouraging environmental responsibility, public participation, and long-term ecological awareness.",
    fullDescription:
      "UDBHAV Foundation’s Plantation Drive is an active ecological movement engaging student volunteers, neighborhood associations, and corporate partners to restore urban green cover and protect indigenous flora across Odisha. Each sapling planted is geo-tagged and nurtured for a minimum of two years.",
    coverImageUrl: "/hero/hero-01.png",
    accentColor: "#439B25",
    impactPreview: "1,000+ Saplings Planted",
    impactStats: [
      { id: "stat-3-1", label: "Saplings Planted", value: "1,000+" },
      { id: "stat-3-2", label: "Volunteers Engaged", value: "200+" },
      { id: "stat-3-3", label: "Survival Rate Tracked", value: "88%" },
    ],
    purpose:
      "To combat climate vulnerability and deforestation while building environmental stewardship among youth and local communities.",
    communityNeed:
      "Rapid urban expansion across coastal Odisha has reduced shade canopy and biodiversity, requiring proactive community re-greening.",
    approach:
      "Seasonal plantation drives paired with local volunteer adoption models ensuring high survival rates for native shade and fruit trees.",
    targetBeneficiaries: [
      "Urban and peri-urban neighborhoods in Bhubaneswar & Cuttack",
      "Public schools and community institutions",
    ],
    majorActivities: [
      "Monsoon Green Odisha Plantation Drives",
      "School Eco-Club Sapling Distribution",
      "Post-Plantation Watering & Protective Fencing Audits",
    ],
    photoCount: 24,
    eventCount: 5,
  },
  {
    id: "idx-prog-04",
    programmeNumber: "04",
    title: "Climate Action Run",
    tagline: "Running for a Greener Tomorrow",
    category: "Environment",
    slug: "climate-action-run",
    shortDescription:
      "A public awareness run promoting climate responsibility, environmental consciousness, sustainable action, and community participation.",
    fullDescription:
      "The Climate Action Run brings together runners, students, fitness enthusiasts, and civic leaders in a vibrant public marathon and awareness rally. Participants pledge to adopt low-carbon lifestyles, reduce single-use plastic, and support clean-energy transitions across communities.",
    coverImageUrl: "/hero/hero-08.png",
    accentColor: "#439B25",
    impactPreview: "500+ Participants",
    impactStats: [
      { id: "stat-4-1", label: "Annual Participants", value: "500+" },
      { id: "stat-4-2", label: "Eco Pledges Signed", value: "1,200+" },
      { id: "stat-4-3", label: "Zero Waste Stations", value: "12" },
    ],
    purpose:
      "To mobilize citizen awareness around climate emergency through community health, collective sports, and environmental advocacy.",
    communityNeed:
      "Public engagement in climate advocacy requires energetic, community-wide formats that connect individual lifestyle choices with collective impact.",
    approach:
      "Organizing eco-friendly public marathons with zero single-use plastic, educational kiosks, and interactive climate pledge campaigns.",
    targetBeneficiaries: [
      "Youth, students, and civic groups across coastal Odisha",
      "Local environmental self-help groups",
    ],
    majorActivities: [
      "Annual Bhubaneswar Climate Action Mini-Marathon",
      "Zero-Waste Awareness Kiosks & Workshops",
      "Community Clean-up Walkathons",
    ],
    photoCount: 20,
    eventCount: 3,
  },
  {
    id: "idx-prog-05",
    programmeNumber: "05",
    title: "Books & Study Materials Distribution",
    tagline: "Bridging Gaps, Building Futures",
    category: "Education",
    slug: "books-study-materials-distribution",
    shortDescription:
      "Distribution of books, learning resources, and academic materials to support underprivileged students and reduce educational inequality.",
    fullDescription:
      "To ensure no child falls behind due to the cost of basic school supplies, UDBHAV Foundation systematically distributes textbooks, notebooks, science kits, stationery, and digital study aids to children in rural schools and slum learning centers.",
    coverImageUrl: "/about/about-02.png",
    accentColor: "#202B78",
    impactPreview: "500+ Students Benefited",
    impactStats: [
      { id: "stat-5-1", label: "Students Benefited", value: "500+" },
      { id: "stat-5-2", label: "Study Kits Distributed", value: "750+" },
      { id: "stat-5-3", label: "Partner Rural Schools", value: "15" },
    ],
    purpose:
      "To eliminate material poverty as an obstacle to foundational literacy and school attendance among underserved children.",
    communityNeed:
      "Families below the poverty line often struggle to afford textbooks and basic school supplies at the start of each academic year.",
    approach:
      "Direct verification of student requirements through school heads followed by dignity-first kit distribution and ongoing teacher check-ins.",
    targetBeneficiaries: [
      "Primary and secondary students in government schools",
      "Children residing in urban informal settlements",
    ],
    majorActivities: [
      "Academic Year Kickoff Stationery Drives",
      "Community Reading Corner Setups",
      "Board Examination Prep Kit Distribution",
    ],
    photoCount: 16,
    eventCount: 4,
  },
  {
    id: "idx-prog-06",
    programmeNumber: "06",
    title: "Cyber Safety Awareness Programme",
    tagline: "Promoting Responsible Digital Citizenship",
    category: "Awareness & Safety",
    slug: "cyber-safety-awareness",
    shortDescription:
      "An awareness initiative educating students and communities about safe internet practices, cyber security, digital responsibility, and online protection.",
    fullDescription:
      "With rapid smartphone adoption among youth, UDBHAV Foundation’s Cyber Safety Awareness Programme delivers interactive workshops in schools and colleges covering digital hygiene, protection against financial fraud, cyberbullying prevention, and safe social media citizenship.",
    coverImageUrl: "/hero/hero-07.png",
    accentColor: "#12245F",
    impactPreview: "300+ Students Reached",
    impactStats: [
      { id: "stat-6-1", label: "Students Reached", value: "300+" },
      { id: "stat-6-2", label: "Workshops Conducted", value: "18" },
      { id: "stat-6-3", label: "Safety Guides Distributed", value: "600+" },
    ],
    purpose:
      "To empower young digital users with critical awareness to safeguard their personal data, mental well-being, and financial security online.",
    communityNeed:
      "Students and elderly citizens in tier-2 and tier-3 regions face rising exposure to online scams, cyber harassment, and predatory misinformation.",
    approach:
      "Engaging expert cyber educators and law enforcement volunteers to conduct case-study based school seminars and helpline orientations.",
    targetBeneficiaries: [
      "High school and adolescent college learners",
      "Parents and community teachers",
    ],
    majorActivities: [
      "School Cyber Safety & Anti-Bullying Workshops",
      "Digital Fraud Prevention Community Camps",
      "Safe Internet Ambassador Training",
    ],
    photoCount: 15,
    eventCount: 3,
  },
  {
    id: "idx-prog-07",
    programmeNumber: "07",
    title: "Mental Health Awareness Initiative",
    tagline: "Minds Matter. Conversations Create Change.",
    category: "Health & Well-being",
    slug: "mental-health-awareness",
    shortDescription:
      "Promoting mental-health awareness, emotional resilience, open conversations, stigma reduction, and access to supportive community spaces.",
    fullDescription:
      "UDBHAV Foundation works to normalize mental health conversations through community listening circles, youth stress-management workshops, and professional counseling orientations. We create safe, judgment-free spaces where emotional resilience and psychological wellness are prioritized.",
    coverImageUrl: "/about/about-04.png",
    accentColor: "#439B25",
    impactPreview: "200+ Participants Engaged",
    impactStats: [
      { id: "stat-7-1", label: "Participants Engaged", value: "200+" },
      { id: "stat-7-2", label: "Listening Circles", value: "14" },
      { id: "stat-7-3", label: "Counselors & Mentors", value: "10" },
    ],
    purpose:
      "To break sociocultural stigma surrounding mental health and provide accessible emotional well-being frameworks for youth and caregivers.",
    communityNeed:
      "Academic pressure, economic anxiety, and social isolation frequently impact adolescent and adult mental health, yet stigma prevents timely help-seeking.",
    approach:
      "Peer-support training paired with guided psychological awareness sessions led by certified clinical psychologists and empathetic facilitators.",
    targetBeneficiaries: [
      "Adolescents and higher secondary students",
      "Working professionals and community volunteers",
    ],
    majorActivities: [
      "Minds Matter Campus Listening Sessions",
      "Exam Stress Management Workshops for CHSE/HSC Students",
      "Community Wellness & Emotional First Aid Orientations",
    ],
    photoCount: 12,
    eventCount: 3,
  },
  {
    id: "idx-prog-08",
    programmeNumber: "08",
    title: "Health Check-up Camps",
    tagline: "Ensuring Wellness for All",
    category: "Health & Well-being",
    slug: "health-check-up-camps",
    shortDescription:
      "Free health check-up and medical-support camps designed to improve access to essential healthcare services for underserved communities.",
    fullDescription:
      "Our mobile health camps bring qualified doctors, diagnostic screening, basic medications, and preventive healthcare counseling directly to remote habitations and urban informal settlements. Early detection of hypertension, diabetes, eye disorders, and anemia is a primary focus.",
    coverImageUrl: "/hero/hero-09.png",
    accentColor: "#439B25",
    impactPreview: "400+ Beneficiaries",
    impactStats: [
      { id: "stat-8-1", label: "Beneficiaries Examined", value: "400+" },
      { id: "stat-8-2", label: "Free Medications Given", value: "350+" },
      { id: "stat-8-3", label: "Medical Specialists Engaged", value: "22" },
    ],
    purpose:
      "To bridge primary healthcare gaps by delivering free diagnostic check-ups and medical guidance to marginalized populations.",
    communityNeed:
      "Low-income families frequently delay medical consultations due to daily wage loss and travel barriers to district hospitals.",
    approach:
      "Collaborating with hospital partners and voluntary medical teams to run multi-specialty neighborhood diagnostic and wellness clinics.",
    targetBeneficiaries: [
      "Slum dwellers and rural families across Khordha & Puri",
      "Senior citizens lacking regular healthcare access",
    ],
    majorActivities: [
      "Comprehensive Diagnostic Check-up Camps",
      "Free Eye Screening and Spectacle Distribution",
      "Maternal & Child Nutritional Consultation Camps",
    ],
    photoCount: 22,
    eventCount: 4,
  },
  {
    id: "idx-prog-09",
    programmeNumber: "09",
    title: "Sanitation & Dengue Awareness Campaign",
    tagline: "Awareness for Healthier Communities",
    category: "Awareness & Safety",
    slug: "sanitation-dengue-awareness",
    shortDescription:
      "Community awareness campaigns promoting sanitation, dengue prevention, cleanliness, responsible public-health practices, and healthier neighbourhoods.",
    fullDescription:
      "Before and during the monsoon season, UDBHAV Foundation mobilizes volunteers to lead door-to-door hygiene drives, stagnant water clearance, mosquito larvicidal awareness, and waste management campaigns to protect communities from vector-borne diseases like dengue and malaria.",
    coverImageUrl: "/about/about-01.png",
    accentColor: "#439B25",
    impactPreview: "500+ People Reached",
    impactStats: [
      { id: "stat-9-1", label: "Households Reached", value: "500+" },
      { id: "stat-9-2", label: "Cleanliness Drives", value: "16" },
      { id: "stat-9-3", label: "Breeding Sites Cleared", value: "120+" },
    ],
    purpose:
      "To prevent seasonal outbreaks of vector-borne illnesses through proactive community hygiene education and localized clean-up action.",
    communityNeed:
      "Dense settlements and monsoon waterlogging create high risks for dengue transmission requiring active civic awareness.",
    approach:
      "Grassroots volunteer squads working alongside local health inspectors to demonstrate larval control, safe water storage, and waste segregation.",
    targetBeneficiaries: [
      "High-density neighborhoods in Bhubaneswar municipal wards",
      "Primary school communities and market committees",
    ],
    majorActivities: [
      "Pre-Monsoon Dengue Prevention Street Plays",
      "Door-to-Door Water Sanitation Audits",
      "Community Clean Neighborhood Pledges",
    ],
    photoCount: 16,
    eventCount: 3,
  },
  {
    id: "idx-prog-10",
    programmeNumber: "10",
    title: "Blood Donation Camp",
    tagline: "Saving Lives Through Humanity",
    category: "Health & Well-being",
    slug: "blood-donation-camp",
    shortDescription:
      "Organised voluntary blood-donation camps encouraging community participation and strengthening access to life-saving blood resources.",
    fullDescription:
      "UDBHAV Foundation organizes structured voluntary blood donation camps in coordination with Red Cross and government blood banks. We foster a reliable donor registry among youth and institutional partners to ensure stable blood availability for thalassemia patients and surgery units.",
    coverImageUrl: "/hero/hero-06.png",
    accentColor: "#202B78",
    impactPreview: "100+ Units Collected",
    impactStats: [
      { id: "stat-10-1", label: "Blood Units Collected", value: "100+" },
      { id: "stat-10-2", label: "Registered Volunteer Donors", value: "350+" },
      { id: "stat-10-3", label: "Partner Blood Banks", value: "4" },
    ],
    purpose:
      "To cultivate a culture of voluntary, regular blood donation and prevent critical blood bank shortages in regional medical centers.",
    communityNeed:
      "State hospitals face recurring deficits of safe, tested blood units, especially for emergency trauma care and regular pediatric transfusions.",
    approach:
      "Hosting hygienic, well-organized community donation camps with medical counseling, refreshments, and donor appreciation badges.",
    targetBeneficiaries: [
      "Patients requiring emergency transfusions in district hospitals",
      "Thalassemia and sickle-cell anemia warriors",
    ],
    majorActivities: [
      "Annual UDBHAV Voluntary Blood Donation Mega-Camp",
      "Youth Blood Donor Motivation Awareness Drives",
      "Donor Recognition & Health Check Sessions",
    ],
    photoCount: 19,
    eventCount: 4,
  },
  {
    id: "idx-prog-11",
    programmeNumber: "11",
    title: "Emergency Blood Donation",
    tagline: "Responding When Every Drop Matters",
    category: "Community Support",
    slug: "emergency-blood-donation",
    shortDescription:
      "A rapid-response blood-support network connecting emergency requirements with eligible donors when timely support is critical.",
    fullDescription:
      "When life-threatening medical emergencies strike late at night or during rare blood group shortages, UDBHAV Foundation’s 24/7 Emergency Blood Donation squad activates immediately. Our verified donor network connects verified hospitals and families with compatible volunteer donors within minutes.",
    coverImageUrl: "/hero/hero-03.png",
    accentColor: "#12245F",
    impactPreview: "50+ Emergency Cases Supported",
    impactStats: [
      { id: "stat-11-1", label: "Emergency Cases Supported", value: "50+" },
      { id: "stat-11-2", label: "Average Mobilization Time", value: "35 min" },
      { id: "stat-11-3", label: "Rare Blood Groups Served", value: "100%" },
    ],
    purpose:
      "To serve as a trusted last-mile lifeline when institutional blood supplies are unavailable during urgent trauma or surgical emergencies.",
    communityNeed:
      "Critical patient survival in accidents and childbirth complications often depends on rapid bedside donor coordination.",
    approach:
      "Maintaining a real-time digital and phone registry of screened, active donors ready for dispatch to regional emergency wards.",
    targetBeneficiaries: [
      "Emergency surgery and trauma patients across Odisha",
      "Underserved families navigating urgent hospital crises",
    ],
    majorActivities: [
      "24/7 Volunteer Emergency Blood Dispatch Network",
      "Rare Blood Group Donor Mapping Drives",
      "Hospital Emergency Coordinator Collaboration",
    ],
    photoCount: 15,
    eventCount: 3,
  },
];

export const ADHYAYA_FLAGSHIP_DATA: AdhyayaFlagshipData = {
  badge: "FLAGSHIP INCLUSION INITIATIVE",
  title: "ADHYAYA: Odisha’s First Ramp of Inclusion",
  subtitle: "Adding a New Chapter of Inclusion",
  slug: "adhyaya-ramp-of-inclusion",
  description:
    "ADHYAYA is a pioneering UDBHAV Foundation initiative celebrating diversity, dignity, representation, and equal opportunity. More than a fashion event, it creates a shared platform for persons with disabilities, marginalised communities, and underrepresented voices to showcase their leadership, pride, and artistic expression on stage.",
  coverImageUrl: "/hero/hero-04.png",
  secondaryImageUrls: [
    "/about/about-03.png",
    "/hero/hero-06.png",
    "/hero/hero-07.png",
  ],
  ctaText: "Discover ADHYAYA",
  ctaHref: "/index/adhyaya-ramp-of-inclusion",
};

export const INDEX_PROGRAMME_EVENTS: ProgrammeEventItem[] = [
  {
    id: "evt-01",
    programmeId: "idx-prog-01",
    programmeSlug: "udbhav-siksha-samman",
    title: "Annual Siksha Samman Felicitation 2026",
    slug: "siksha-samman-felicitation-2026",
    shortDescription:
      "Felicitation and scholarship disbursement for 30 meritorious HSC and CHSE toppers.",
    fullDescription:
      "Dignitaries and educators gathered to celebrate 30 extraordinary students from underprivileged households who excelled in their board exams.",
    coverImageUrl: "/hero/hero-02.png",
    location: "Bhubaneswar, Odisha",
    venue: "Rabindra Mandap Auditorium",
    eventDate: "2026-06-15",
    startTime: "10:30 AM",
    endTime: "01:30 PM",
    status: "completed",
    photoCount: 8,
  },
  {
    id: "evt-02",
    programmeId: "idx-prog-03",
    programmeSlug: "plantation-drive",
    title: "Monsoon Green Odisha Plantation Drive",
    slug: "monsoon-green-odisha-plantation",
    shortDescription:
      "Planting 350 native shade saplings with school eco-clubs across urban corridors.",
    fullDescription:
      "Volunteers and student eco-warriors joined hands to plant indigenous fruit and shade trees along community avenues.",
    coverImageUrl: "/hero/hero-01.png",
    location: "Cuttack, Odisha",
    venue: "Mahanadi Riverbank Community Park",
    eventDate: "2026-07-05",
    startTime: "06:30 AM",
    endTime: "09:30 AM",
    status: "completed",
    photoCount: 12,
  },
  {
    id: "evt-03",
    programmeId: "idx-prog-04",
    programmeSlug: "climate-action-run",
    title: "Bhubaneswar Climate Action Marathon",
    slug: "bhubaneswar-climate-action-marathon",
    shortDescription:
      "500+ citizens running together to pledge zero single-use plastic and sustainable living.",
    fullDescription:
      "A high-energy community marathon uniting youth, athletes, and families for urgent environmental action and ecological awareness.",
    coverImageUrl: "/hero/hero-08.png",
    location: "Bhubaneswar, Odisha",
    venue: "Kalinga Stadium Gate 3",
    eventDate: "2026-05-20",
    startTime: "05:45 AM",
    endTime: "08:30 AM",
    status: "completed",
    photoCount: 10,
  },
  {
    id: "evt-04",
    programmeId: "idx-prog-08",
    programmeSlug: "health-check-up-camps",
    title: "Mega Neighborhood Wellness & Diagnostic Camp",
    slug: "mega-neighborhood-wellness-camp",
    shortDescription:
      "Multi-specialty free diagnostic screening and consultation for 180 beneficiaries.",
    fullDescription:
      "Specialist doctors provided free blood pressure, sugar, cardiac screening, eye examinations, and nutritional advice to underserved families.",
    coverImageUrl: "/hero/hero-09.png",
    location: "Puri District, Odisha",
    venue: "Community Health Center Ground",
    eventDate: "2026-06-28",
    startTime: "09:00 AM",
    endTime: "03:00 PM",
    status: "completed",
    photoCount: 9,
  },
];

export const INDEX_PROGRAMME_PHOTOS: ProgrammePhotoItem[] = [
  {
    id: "p-photo-01",
    programmeId: "idx-prog-01",
    programmeSlug: "udbhav-siksha-samman",
    eventId: "evt-01",
    title: "Honoring Meritorious Scholars",
    description:
      "Felicitation of CHSE science and arts toppers at the Siksha Samman ceremony.",
    imageUrl: "/hero/hero-02.png",
    thumbnailUrl: "/hero/hero-02.png",
    location: "Bhubaneswar, Odisha",
    photoDate: "2026-06-15",
    photoTime: "11:15 AM",
    photographerName: "UDBHAV Media Squad",
    altText: "Students receiving UDBHAV Siksha Samman award certificates",
    isFeatured: true,
  },
  {
    id: "p-photo-02",
    programmeId: "idx-prog-03",
    programmeSlug: "plantation-drive",
    eventId: "evt-02",
    title: "Sapling Adoption by Student Volunteers",
    description:
      "Young volunteers geo-tagging native Neem and Bakul saplings along river avenues.",
    imageUrl: "/hero/hero-01.png",
    thumbnailUrl: "/hero/hero-01.png",
    location: "Cuttack, Odisha",
    photoDate: "2026-07-05",
    photoTime: "07:30 AM",
    photographerName: "UDBHAV Eco Team",
    altText: "Volunteers planting saplings together during monsoon plantation drive",
    isFeatured: true,
  },
  {
    id: "p-photo-03",
    programmeId: "idx-prog-04",
    programmeSlug: "climate-action-run",
    eventId: "evt-03",
    title: "Runners Crossing the Eco-Pledge Finish Line",
    description:
      "Over 500 runners completing the climate rally and signing sustainable lifestyle commitments.",
    imageUrl: "/hero/hero-08.png",
    thumbnailUrl: "/hero/hero-08.png",
    location: "Bhubaneswar, Odisha",
    photoDate: "2026-05-20",
    photoTime: "07:15 AM",
    photographerName: "UDBHAV Media Squad",
    altText: "Marathon runners participating in the UDBHAV Climate Action Run",
    isFeatured: true,
  },
  {
    id: "p-photo-04",
    programmeId: "idx-prog-08",
    programmeSlug: "health-check-up-camps",
    eventId: "evt-04",
    title: "Free Specialist Medical Check-up",
    description:
      "Physician conducting health screening and diagnostic evaluation for community elderly.",
    imageUrl: "/hero/hero-09.png",
    thumbnailUrl: "/hero/hero-09.png",
    location: "Puri District, Odisha",
    photoDate: "2026-06-28",
    photoTime: "10:45 AM",
    photographerName: "UDBHAV Medical Team",
    altText: "Doctor checking blood pressure of senior citizen at free health camp",
    isFeatured: true,
  },
  {
    id: "p-photo-05",
    programmeId: "idx-prog-02",
    programmeSlug: "free-civil-services-coaching",
    title: "Interactive IAS Mentorship Workshop",
    description:
      "Serving administrative alumni delivering answer-writing tips to SC/ST aspirants.",
    imageUrl: "/hero/hero-05.png",
    thumbnailUrl: "/hero/hero-05.png",
    location: "Bhubaneswar, Odisha",
    photoDate: "2026-06-02",
    photoTime: "04:00 PM",
    altText: "Aspirants attending free civil services coaching session",
  },
  {
    id: "p-photo-06",
    programmeId: "idx-prog-06",
    programmeSlug: "cyber-safety-awareness",
    title: "Safe Digital Citizenship School Seminar",
    description:
      "Cyber safety educators explaining online fraud prevention to high school students.",
    imageUrl: "/hero/hero-07.png",
    thumbnailUrl: "/hero/hero-07.png",
    location: "Khordha, Odisha",
    photoDate: "2026-05-14",
    photoTime: "11:00 AM",
    altText: "Students learning about cyber safety practices",
  },
];
