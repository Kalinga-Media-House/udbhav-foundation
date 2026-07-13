import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  OFFICIAL_INDEX_PROGRAMMES,
  ADHYAYA_FLAGSHIP_DATA,
  INDEX_PROGRAMME_EVENTS,
  INDEX_PROGRAMME_PHOTOS,
} from "@/data/index-programmes-data";
import { ProgrammeDetailView } from "@/components/index-page/ProgrammeDetailView";
import { IndexProgrammeDetail } from "@/types/index-programme";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const programmeSlugs = OFFICIAL_INDEX_PROGRAMMES.map((p) => ({
    slug: p.slug,
  }));
  const adhyayaSlug = { slug: ADHYAYA_FLAGSHIP_DATA.slug };

  return [...programmeSlugs, adhyayaSlug];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let title = "Programme Not Found | UDBHAV FOUNDATION";
  let description = "Explore UDBHAV Foundation community action programmes.";
  let coverImage = "/hero/hero-01.png";

  if (slug === ADHYAYA_FLAGSHIP_DATA.slug) {
    title = `${ADHYAYA_FLAGSHIP_DATA.title} | UDBHAV FOUNDATION`;
    description = ADHYAYA_FLAGSHIP_DATA.description;
    coverImage = ADHYAYA_FLAGSHIP_DATA.coverImageUrl;
  } else {
    const programme = OFFICIAL_INDEX_PROGRAMMES.find((p) => p.slug === slug);
    if (programme) {
      title = `${programme.programmeNumber}: ${programme.title} | UDBHAV FOUNDATION Index`;
      description = programme.shortDescription;
      coverImage = programme.coverImageUrl;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [coverImage],
      url: `https://udbhavfoundation.org/index/${slug}`,
    },
    alternates: {
      canonical: `https://udbhavfoundation.org/index/${slug}`,
    },
  };
}

export default async function ProgrammeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let programme: IndexProgrammeDetail | undefined =
    OFFICIAL_INDEX_PROGRAMMES.find((p) => p.slug === slug);

  // If slug matches ADHYAYA flagship inclusion initiative, adapt it cleanly
  if (!programme && slug === ADHYAYA_FLAGSHIP_DATA.slug) {
    programme = {
      id: "adhyaya-flagship",
      programmeNumber: "FLAGSHIP",
      title: ADHYAYA_FLAGSHIP_DATA.title,
      tagline: ADHYAYA_FLAGSHIP_DATA.subtitle,
      slug: ADHYAYA_FLAGSHIP_DATA.slug,
      category: "Community Support",
      shortDescription:
        "Odisha’s First Ramp of Inclusion celebrating diversity, dignity, and representation.",
      fullDescription: ADHYAYA_FLAGSHIP_DATA.description,
      coverImageUrl: ADHYAYA_FLAGSHIP_DATA.coverImageUrl,
      accentColor: "#3C9D23",
      impactPreview: "Shared Stage for Marginalised Communities",
      impactStats: [
        { id: "adh-1", label: "Inclusion Ambassadors", value: "120+" },
        { id: "adh-2", label: "Community Groups Represented", value: "15" },
        { id: "adh-3", label: "Audience & Supporters", value: "1,500+" },
      ],
      purpose:
        "To break sociocultural barriers and provide an empowered public platform for persons with disabilities and underrepresented voices.",
      communityNeed:
        "Marginalized individuals rarely receive inclusive public spaces to demonstrate leadership, artistic excellence, and dignity.",
      approach:
        "Collaborative runway, performance, and storytelling showcases bringing together designers, activists, and diverse community leaders.",
      targetBeneficiaries: [
        "Persons with disabilities across Odisha",
        "Transgender community members and grassroots artisans",
      ],
      majorActivities: [
        "ADHYAYA Inclusion Runway & Leadership Showcase",
        "Accessible Fashion & Design Mentorship Workshops",
        "Community Storytelling & Dignity Forums",
      ],
      photoCount: 6,
      eventCount: 2,
    };
  }

  if (!programme) {
    notFound();
  }

  const events = INDEX_PROGRAMME_EVENTS.filter(
    (e) => e.programmeSlug === slug || e.programmeId === programme.id
  );

  const photos = INDEX_PROGRAMME_PHOTOS.filter(
    (p) => p.programmeSlug === slug || p.programmeId === programme.id
  );

  const relatedProgrammes = OFFICIAL_INDEX_PROGRAMMES.filter(
    (p) => p.slug !== slug
  ).slice(0, 3);

  return (
    <ProgrammeDetailView
      programme={programme}
      events={events}
      photos={photos}
      relatedProgrammes={relatedProgrammes}
    />
  );
}
