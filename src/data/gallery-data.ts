import { IndexProgramme, GalleryPhoto } from "@/types/gallery";

export const INDEX_PROGRAMMES: IndexProgramme[] = [
  {
    id: "prog-01",
    title: "UDBHAV Siksha Samman",
    slug: "udbhav-siksha-samman",
    category: "Education",
    accentColor: "#439B25",
  },
  {
    id: "prog-02",
    title: "Free Civil Services Coaching Programme",
    slug: "free-civil-services-coaching",
    category: "Education",
    accentColor: "#202B78",
  },
  {
    id: "prog-03",
    title: "Plantation Drive",
    slug: "plantation-drive",
    category: "Environment",
    accentColor: "#439B25",
  },
  {
    id: "prog-04",
    title: "Climate Action Run",
    slug: "climate-action-run",
    category: "Environment",
    accentColor: "#439B25",
  },
  {
    id: "prog-05",
    title: "Books & Study Materials Distribution",
    slug: "books-study-materials-distribution",
    category: "Education",
    accentColor: "#202B78",
  },
  {
    id: "prog-06",
    title: "Cyber Safety Awareness Programme",
    slug: "cyber-safety-awareness",
    category: "Education",
    accentColor: "#12245F",
  },
  {
    id: "prog-07",
    title: "Mental Health Awareness Initiative",
    slug: "mental-health-awareness",
    category: "Health",
    accentColor: "#439B25",
  },
  {
    id: "prog-08",
    title: "Health Check-up Camps",
    slug: "health-checkup-camps",
    category: "Health",
    accentColor: "#439B25",
  },
  {
    id: "prog-09",
    title: "Sanitation & Dengue Awareness Campaign",
    slug: "sanitation-dengue-awareness",
    category: "Health",
    accentColor: "#439B25",
  },
  {
    id: "prog-10",
    title: "Blood Donation Camp",
    slug: "blood-donation-camp",
    category: "Health",
    accentColor: "#202B78",
  },
  {
    id: "prog-11",
    title: "Emergency Blood Donation",
    slug: "emergency-blood-donation",
    category: "Community",
    accentColor: "#12245F",
  },
];

export const ALL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "photo-01",
    imageUrl: "/hero/hero-01.png",
    title: "Planting Hope for a Greener Tomorrow",
    caption:
      "UDBHAV Foundation volunteers planting saplings as part of a community environmental initiative.",
    altText:
      "UDBHAV Foundation volunteers planting saplings during the Plantation Drive in Bhubaneswar.",
    photographerName: "Arunav Mishra",
    aspectRatio: "portrait",
    createdAt: "2026-07-12T09:30:00Z",
    programme: INDEX_PROGRAMMES[2], // Plantation Drive
    event: {
      id: "ev-01",
      title: "Community Plantation Campaign 2026",
      slug: "community-plantation-campaign-2026",
      location: "Bhubaneswar, Odisha",
      eventDate: "12 July 2026",
      startTime: "9:30 AM",
      endTime: "1:00 PM",
    },
  },
  {
    id: "photo-02",
    imageUrl: "/hero/hero-04.png",
    title: "Honour for Educational Excellence",
    caption:
      "Recognizing meritorious students from rural backgrounds at the UDBHAV Siksha Samman ceremony.",
    altText:
      "UDBHAV Siksha Samman ceremony honoring outstanding students in Cuttack.",
    photographerName: "Siddharth Patnaik",
    aspectRatio: "landscape",
    createdAt: "2026-07-05T10:00:00Z",
    programme: INDEX_PROGRAMMES[0], // UDBHAV Siksha Samman
    event: {
      id: "ev-02",
      title: "UDBHAV Siksha Samman Annual Conclave",
      slug: "udbhav-siksha-samman-annual-conclave",
      location: "Cuttack, Odisha",
      eventDate: "05 July 2026",
      startTime: "10:00 AM",
      endTime: "2:30 PM",
    },
  },
  {
    id: "photo-03",
    imageUrl: "/hero/hero-02.png",
    title: "Empowering Future Civil Servants",
    caption:
      "Interactive mentorship workshop for UPSC and OPSC aspirants under the Free Civil Services Coaching Programme.",
    altText:
      "Mentorship and classroom coaching session for civil services aspirants in Bhubaneswar.",
    photographerName: "Deepak Pradhan",
    aspectRatio: "landscape",
    createdAt: "2026-06-28T11:00:00Z",
    programme: INDEX_PROGRAMMES[1], // Free Civil Services Coaching
    event: {
      id: "ev-03",
      title: "Civil Services Aspirants Orientation",
      slug: "civil-services-aspirants-orientation",
      location: "Bhubaneswar, Odisha",
      eventDate: "28 June 2026",
      startTime: "11:00 AM",
      endTime: "4:00 PM",
    },
  },
  {
    id: "photo-04",
    imageUrl: "/hero/hero-03.png",
    title: "Run for Climate Consciousness",
    caption:
      "Youth and community runners uniting at sunrise during the Climate Action Run for environmental stewardship.",
    altText:
      "Participants running along the Puri beach road during the UDBHAV Climate Action Run.",
    photographerName: "Ananya Ray",
    aspectRatio: "square",
    createdAt: "2026-06-20T06:00:00Z",
    programme: INDEX_PROGRAMMES[3], // Climate Action Run
    event: {
      id: "ev-04",
      title: "Puri Coastal Climate Action Marathon",
      slug: "puri-coastal-climate-action-marathon",
      location: "Puri, Odisha",
      eventDate: "20 June 2026",
      startTime: "6:00 AM",
      endTime: "9:00 AM",
    },
  },
  {
    id: "photo-05",
    imageUrl: "/hero/hero-05.png",
    title: "Equipping Minds with Knowledge",
    caption:
      "Volunteers distributing textbooks, workbooks, and study supplies to children in underserved schools.",
    altText:
      "UDBHAV Foundation volunteers distributing books and study materials to school students in Berhampur.",
    photographerName: "Manas Jena",
    aspectRatio: "landscape",
    createdAt: "2026-06-14T09:00:00Z",
    programme: INDEX_PROGRAMMES[4], // Books & Study Materials Distribution
    event: {
      id: "ev-05",
      title: "Rural Literacy Support Drive",
      slug: "rural-literacy-support-drive",
      location: "Berhampur, Odisha",
      eventDate: "14 June 2026",
      startTime: "9:00 AM",
      endTime: "1:30 PM",
    },
  },
  {
    id: "photo-06",
    imageUrl: "/hero/hero-06.png",
    title: "Navigating the Digital World Safely",
    caption:
      "Cyber safety seminar educating college students on digital hygiene, privacy, and online fraud prevention.",
    altText:
      "Cyber safety workshop and student interactive seminar conducted in Rourkela.",
    photographerName: "Priyanka Das",
    aspectRatio: "portrait",
    createdAt: "2026-06-08T10:30:00Z",
    programme: INDEX_PROGRAMMES[5], // Cyber Safety Awareness
    event: {
      id: "ev-06",
      title: "Youth Cyber Literacy Seminar",
      slug: "youth-cyber-literacy-seminar",
      location: "Rourkela, Odisha",
      eventDate: "08 June 2026",
      startTime: "10:30 AM",
      endTime: "1:00 PM",
    },
  },
  {
    id: "photo-07",
    imageUrl: "/hero/hero-07.png",
    title: "Breaking the Silence on Mental Health",
    caption:
      "Community dialogue and counseling session fostering emotional well-being and stress resilience.",
    altText:
      "Mental health awareness and supportive counseling workshop in Sambalpur.",
    photographerName: "Tanmay Sahoo",
    aspectRatio: "landscape",
    createdAt: "2026-06-01T15:00:00Z",
    programme: INDEX_PROGRAMMES[6], // Mental Health Awareness
    event: {
      id: "ev-07",
      title: "Well-Being & Resilience Circle",
      slug: "wellbeing-resilience-circle",
      location: "Sambalpur, Odisha",
      eventDate: "01 June 2026",
      startTime: "3:00 PM",
      endTime: "5:30 PM",
    },
  },
  {
    id: "photo-08",
    imageUrl: "/hero/hero-08.png",
    title: "Healthcare at the Doorstep",
    caption:
      "Free community health check-up camp providing diagnostic screenings and medical consultations.",
    altText:
      "Doctors and medical volunteers conducting free health check-ups for rural residents in Angul.",
    photographerName: "Rakesh Mohanty",
    aspectRatio: "square",
    createdAt: "2026-05-24T08:30:00Z",
    programme: INDEX_PROGRAMMES[7], // Health Check-up Camps
    event: {
      id: "ev-08",
      title: "Comprehensive Community Medical Camp",
      slug: "comprehensive-community-medical-camp",
      location: "Angul, Odisha",
      eventDate: "24 May 2026",
      startTime: "8:30 AM",
      endTime: "2:00 PM",
    },
  },
  {
    id: "photo-09",
    imageUrl: "/hero/hero-09.png",
    title: "Clean Neighborhoods, Healthy Lives",
    caption:
      "Grassroots sanitation campaign and dengue prevention drive raising hygiene awareness in residential blocks.",
    altText:
      "Volunteers conducting dengue awareness and neighborhood sanitation drive in Balasore.",
    photographerName: "Sushil Rout",
    aspectRatio: "landscape",
    createdAt: "2026-05-18T07:30:00Z",
    programme: INDEX_PROGRAMMES[8], // Sanitation & Dengue Awareness
    event: {
      id: "ev-09",
      title: "Monsoon Dengue Prevention Outreach",
      slug: "monsoon-dengue-prevention-outreach",
      location: "Balasore, Odisha",
      eventDate: "18 May 2026",
      startTime: "7:30 AM",
      endTime: "11:30 AM",
    },
  },
  {
    id: "photo-10",
    imageUrl: "/hero/hero-01.png",
    title: "The Gift of Life Through Blood Donation",
    caption:
      "Volunteers and youth donors participating in the annual UDBHAV mega blood donation camp.",
    altText:
      "Volunteer donating blood during the annual community blood donation camp in Bhubaneswar.",
    photographerName: "Arunav Mishra",
    aspectRatio: "landscape",
    createdAt: "2026-05-10T09:00:00Z",
    programme: INDEX_PROGRAMMES[9], // Blood Donation Camp
    event: {
      id: "ev-10",
      title: "Mega Voluntary Blood Donation Camp",
      slug: "mega-voluntary-blood-donation-camp",
      location: "Bhubaneswar, Odisha",
      eventDate: "10 May 2026",
      startTime: "9:00 AM",
      endTime: "4:00 PM",
    },
  },
  {
    id: "photo-11",
    imageUrl: "/hero/hero-02.png",
    title: "Urgent Lifesaving Blood Support",
    caption:
      "Rapid-response volunteer network coordinating emergency blood units for critical hospital patients.",
    altText:
      "Emergency blood donation volunteer network coordinating urgent hospital blood requests in Cuttack.",
    photographerName: "Siddharth Patnaik",
    aspectRatio: "portrait",
    createdAt: "2026-05-02T14:00:00Z",
    programme: INDEX_PROGRAMMES[10], // Emergency Blood Donation
    event: {
      id: "ev-11",
      title: "Emergency Donor Network Mobilization",
      slug: "emergency-donor-network-mobilization",
      location: "Cuttack, Odisha",
      eventDate: "02 May 2026",
      startTime: "2:00 PM",
      endTime: "6:00 PM",
    },
  },
  {
    id: "photo-12",
    imageUrl: "/hero/hero-03.png",
    title: "Greening Urban Public Spaces",
    caption:
      "Planting indigenous shade and fruit trees to restore ecological diversity in public parks.",
    altText:
      "Community members planting indigenous saplings in urban park in Bhubaneswar.",
    photographerName: "Ananya Ray",
    aspectRatio: "landscape",
    createdAt: "2026-04-25T08:00:00Z",
    programme: INDEX_PROGRAMMES[2], // Plantation Drive
    event: {
      id: "ev-01",
      title: "Community Plantation Campaign 2026",
      slug: "community-plantation-campaign-2026",
      location: "Bhubaneswar, Odisha",
      eventDate: "25 April 2026",
      startTime: "8:00 AM",
      endTime: "12:00 PM",
    },
  },
  {
    id: "photo-13",
    imageUrl: "/hero/hero-04.png",
    title: "Fostering Reading Culture in Schools",
    caption:
      "Setting up community library corners and distributing children's literature in government primary schools.",
    altText:
      "Students exploring newly donated library books and educational materials in Puri.",
    photographerName: "Deepak Pradhan",
    aspectRatio: "square",
    createdAt: "2026-04-18T10:30:00Z",
    programme: INDEX_PROGRAMMES[4], // Books & Study Materials Distribution
    event: {
      id: "ev-05",
      title: "Rural Literacy Support Drive",
      slug: "rural-literacy-support-drive",
      location: "Puri, Odisha",
      eventDate: "18 April 2026",
      startTime: "10:30 AM",
      endTime: "2:00 PM",
    },
  },
  {
    id: "photo-14",
    imageUrl: "/hero/hero-05.png",
    title: "Empowering Rural Student Achievers",
    caption:
      "Felicitating academic champions and providing scholarship certificates during UDBHAV Siksha Samman.",
    altText:
      "Scholastic award presentation ceremony recognizing student achievers in Berhampur.",
    photographerName: "Manas Jena",
    aspectRatio: "landscape",
    createdAt: "2026-04-10T11:00:00Z",
    programme: INDEX_PROGRAMMES[0], // UDBHAV Siksha Samman
    event: {
      id: "ev-02",
      title: "UDBHAV Siksha Samman Annual Conclave",
      slug: "udbhav-siksha-samman-annual-conclave",
      location: "Berhampur, Odisha",
      eventDate: "10 April 2026",
      startTime: "11:00 AM",
      endTime: "3:00 PM",
    },
  },
  {
    id: "photo-15",
    imageUrl: "/hero/hero-06.png",
    title: "Focused Mentorship for Civil Services",
    caption:
      "Expert guidance session analyzing essay writing and ethical governance for civil services aspirants.",
    altText:
      "Students attending expert civil services coaching session in Bhubaneswar.",
    photographerName: "Priyanka Das",
    aspectRatio: "portrait",
    createdAt: "2026-04-04T10:00:00Z",
    programme: INDEX_PROGRAMMES[1], // Free Civil Services Coaching
    event: {
      id: "ev-03",
      title: "Civil Services Aspirants Orientation",
      slug: "civil-services-aspirants-orientation",
      location: "Bhubaneswar, Odisha",
      eventDate: "04 April 2026",
      startTime: "10:00 AM",
      endTime: "1:30 PM",
    },
  },
  {
    id: "photo-16",
    imageUrl: "/hero/hero-07.png",
    title: "Striding Forward for Climate Justice",
    caption:
      "Enthusiastic volunteers crossing the finish line at the annual UDBHAV Climate Action Run.",
    altText:
      "Runners carrying green flags at the finish line of the Climate Action Run in Rourkela.",
    photographerName: "Tanmay Sahoo",
    aspectRatio: "landscape",
    createdAt: "2026-03-28T07:00:00Z",
    programme: INDEX_PROGRAMMES[3], // Climate Action Run
    event: {
      id: "ev-04",
      title: "Puri Coastal Climate Action Marathon",
      slug: "puri-coastal-climate-action-marathon",
      location: "Rourkela, Odisha",
      eventDate: "28 March 2026",
      startTime: "7:00 AM",
      endTime: "10:00 AM",
    },
  },
  {
    id: "photo-17",
    imageUrl: "/hero/hero-08.png",
    title: "Cyber Shield for Schools",
    caption:
      "Interactive demonstration on spotting phishing attempts and securing personal social media profiles.",
    altText:
      "School students participating in cyber safety interactive workshop in Sambalpur.",
    photographerName: "Rakesh Mohanty",
    aspectRatio: "landscape",
    createdAt: "2026-03-20T11:30:00Z",
    programme: INDEX_PROGRAMMES[5], // Cyber Safety Awareness
    event: {
      id: "ev-06",
      title: "Youth Cyber Literacy Seminar",
      slug: "youth-cyber-literacy-seminar",
      location: "Sambalpur, Odisha",
      eventDate: "20 March 2026",
      startTime: "11:30 AM",
      endTime: "2:00 PM",
    },
  },
  {
    id: "photo-18",
    imageUrl: "/hero/hero-09.png",
    title: "Mindfulness and Youth Emotional Health",
    caption:
      "Mindfulness workshop assisting teenagers in overcoming examination stress and building self-confidence.",
    altText:
      "Youth emotional health and mindfulness counseling circle in Balasore.",
    photographerName: "Sushil Rout",
    aspectRatio: "square",
    createdAt: "2026-03-12T16:00:00Z",
    programme: INDEX_PROGRAMMES[6], // Mental Health Awareness
    event: {
      id: "ev-07",
      title: "Well-Being & Resilience Circle",
      slug: "wellbeing-resilience-circle",
      location: "Balasore, Odisha",
      eventDate: "12 March 2026",
      startTime: "4:00 PM",
      endTime: "6:00 PM",
    },
  },
  {
    id: "photo-19",
    imageUrl: "/hero/hero-01.png",
    title: "Specialist Pediatric Screening Camp",
    caption:
      "Voluntary pediatricians conducting growth and nutritional screenings for village children.",
    altText:
      "Pediatric health camp screening rural children in Angul district.",
    photographerName: "Arunav Mishra",
    aspectRatio: "landscape",
    createdAt: "2026-03-05T09:30:00Z",
    programme: INDEX_PROGRAMMES[7], // Health Check-up Camps
    event: {
      id: "ev-08",
      title: "Comprehensive Community Medical Camp",
      slug: "comprehensive-community-medical-camp",
      location: "Angul, Odisha",
      eventDate: "05 March 2026",
      startTime: "9:30 AM",
      endTime: "2:00 PM",
    },
  },
  {
    id: "photo-20",
    imageUrl: "/hero/hero-02.png",
    title: "Community Cleanliness & Hygiene Awareness",
    caption:
      "Door-to-door sanitation campaign educating families on safe water storage and mosquito control.",
    altText:
      "Volunteers distributing sanitation guides during neighborhood dengue awareness drive in Cuttack.",
    photographerName: "Siddharth Patnaik",
    aspectRatio: "portrait",
    createdAt: "2026-02-22T08:00:00Z",
    programme: INDEX_PROGRAMMES[8], // Sanitation & Dengue Awareness
    event: {
      id: "ev-09",
      title: "Monsoon Dengue Prevention Outreach",
      slug: "monsoon-dengue-prevention-outreach",
      location: "Cuttack, Odisha",
      eventDate: "22 February 2026",
      startTime: "8:00 AM",
      endTime: "11:30 AM",
    },
  },
  {
    id: "photo-21",
    imageUrl: "/hero/hero-03.png",
    title: "Youth Blood Donors Leading by Example",
    caption:
      "College volunteers stepping forward to donate blood and support regional blood bank reserves.",
    altText:
      "Youth blood donors at voluntary blood donation drive in Bhubaneswar.",
    photographerName: "Deepak Pradhan",
    aspectRatio: "landscape",
    createdAt: "2026-02-14T10:00:00Z",
    programme: INDEX_PROGRAMMES[9], // Blood Donation Camp
    event: {
      id: "ev-10",
      title: "Mega Voluntary Blood Donation Camp",
      slug: "mega-voluntary-blood-donation-camp",
      location: "Bhubaneswar, Odisha",
      eventDate: "14 February 2026",
      startTime: "10:00 AM",
      endTime: "3:30 PM",
    },
  },
  {
    id: "photo-22",
    imageUrl: "/hero/hero-04.png",
    title: "24/7 Lifeline for Emergency Patients",
    caption:
      "Rapid blood unit handover to family members of emergency accident survivors.",
    altText:
      "Emergency blood donation volunteer handing over blood unit at hospital in Puri.",
    photographerName: "Ananya Ray",
    aspectRatio: "square",
    createdAt: "2026-02-04T19:00:00Z",
    programme: INDEX_PROGRAMMES[10], // Emergency Blood Donation
    event: {
      id: "ev-11",
      title: "Emergency Donor Network Mobilization",
      slug: "emergency-donor-network-mobilization",
      location: "Puri, Odisha",
      eventDate: "04 February 2026",
      startTime: "7:00 PM",
      endTime: "9:00 PM",
    },
  },
  {
    id: "photo-23",
    imageUrl: "/hero/hero-05.png",
    title: "Nurturing Fruit Orchards for Rural Schools",
    caption:
      "Planting fruit-bearing saplings on school grounds to promote ecology and nutrition.",
    altText:
      "Volunteers planting fruit tree saplings at government high school in Berhampur.",
    photographerName: "Manas Jena",
    aspectRatio: "landscape",
    createdAt: "2026-01-25T09:00:00Z",
    programme: INDEX_PROGRAMMES[2], // Plantation Drive
    event: {
      id: "ev-01",
      title: "Community Plantation Campaign 2026",
      slug: "community-plantation-campaign-2026",
      location: "Berhampur, Odisha",
      eventDate: "25 January 2026",
      startTime: "9:00 AM",
      endTime: "1:00 PM",
    },
  },
  {
    id: "photo-24",
    imageUrl: "/hero/hero-06.png",
    title: "Celebrating Merit and Dedication",
    caption:
      "Annual felicitation ceremony inspiring young minds to reach their fullest potential.",
    altText:
      "Award ceremony recognizing student excellence at UDBHAV Siksha Samman in Rourkela.",
    photographerName: "Priyanka Das",
    aspectRatio: "portrait",
    createdAt: "2026-01-18T11:00:00Z",
    programme: INDEX_PROGRAMMES[0], // UDBHAV Siksha Samman
    event: {
      id: "ev-02",
      title: "UDBHAV Siksha Samman Annual Conclave",
      slug: "udbhav-siksha-samman-annual-conclave",
      location: "Rourkela, Odisha",
      eventDate: "18 January 2026",
      startTime: "11:00 AM",
      endTime: "3:00 PM",
    },
  },
];

export function getGalleryStats() {
  const totalPhotos = ALL_GALLERY_PHOTOS.length;
  const uniqueEvents = new Set(ALL_GALLERY_PHOTOS.map((p) => p.event.id)).size;
  const uniqueProgrammes = INDEX_PROGRAMMES.length;
  const uniqueLocations = new Set(
    ALL_GALLERY_PHOTOS.map((p) => p.event.location)
  ).size;

  return {
    totalPhotos,
    eventsCovered: uniqueEvents,
    programmesRepresented: uniqueProgrammes,
    locationsReached: uniqueLocations,
  };
}

export type SortOption =
  | "newest"
  | "oldest"
  | "recently-added"
  | "event-name-az";

export function filterAndSortGalleryPhotos(
  photos: GalleryPhoto[],
  programmeSlug: string,
  searchQuery: string,
  sortOption: SortOption
): GalleryPhoto[] {
  let filtered = [...photos];

  // 1. Filter by programme
  if (programmeSlug && programmeSlug !== "all") {
    filtered = filtered.filter((p) => p.programme.slug === programmeSlug);
  }

  // 2. Filter by search query (matches photo title, event title, programme title, location, caption, altText)
  if (searchQuery && searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.event.title.toLowerCase().includes(q) ||
        p.programme.title.toLowerCase().includes(q) ||
        p.event.location.toLowerCase().includes(q) ||
        (p.caption && p.caption.toLowerCase().includes(q)) ||
        p.altText.toLowerCase().includes(q)
    );
  }

  // 3. Sort
  filtered.sort((a, b) => {
    switch (sortOption) {
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "recently-added":
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "event-name-az":
        return a.event.title.localeCompare(b.event.title);
      default:
        return 0;
    }
  });

  return filtered;
}
