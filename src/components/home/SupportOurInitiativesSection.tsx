 import React from "react";
import { listPrograms } from "@/features/programs/actions";
import { SupportOurInitiativesClient, InitiativeItem } from "./SupportOurInitiativesClient";
import type { ProgrammeCategory } from "@/types/index-programme";

const THEMES = [
  {
    gradient: "from-indigo-700 to-blue-700",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    progressFill: "bg-indigo-600",
    buttonBg: "bg-indigo-600",
    buttonHover: "hover:bg-indigo-700",
  },
  {
    gradient: "from-blue-700 to-violet-700",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    progressFill: "bg-blue-600",
    buttonBg: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
  },
  {
    gradient: "from-emerald-700 to-green-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    progressFill: "bg-emerald-600",
    buttonBg: "bg-emerald-600",
    buttonHover: "hover:bg-emerald-700",
  },
  {
    gradient: "from-teal-700 to-emerald-600",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    progressFill: "bg-teal-600",
    buttonBg: "bg-teal-600",
    buttonHover: "hover:bg-teal-700",
  },
  {
    gradient: "from-amber-600 to-orange-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    progressFill: "bg-amber-600",
    buttonBg: "bg-amber-600",
    buttonHover: "hover:bg-amber-700",
  },
  {
    gradient: "from-sky-700 to-cyan-600",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    progressFill: "bg-sky-600",
    buttonBg: "bg-sky-600",
    buttonHover: "hover:bg-sky-700",
  },
  {
    gradient: "from-purple-700 to-pink-600",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    progressFill: "bg-purple-600",
    buttonBg: "bg-purple-600",
    buttonHover: "hover:bg-purple-700",
  },
  {
    gradient: "from-cyan-700 to-teal-600",
    badgeBg: "bg-cyan-50",
    badgeText: "text-cyan-700",
    progressFill: "bg-cyan-600",
    buttonBg: "bg-cyan-600",
    buttonHover: "hover:bg-cyan-700",
  },
  {
    gradient: "from-lime-600 to-teal-700",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    progressFill: "bg-teal-600",
    buttonBg: "bg-teal-600",
    buttonHover: "hover:bg-teal-700",
  },
  {
    gradient: "from-red-600 to-rose-700",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    progressFill: "bg-red-600",
    buttonBg: "bg-red-600",
    buttonHover: "hover:bg-red-700",
  },
  {
    gradient: "from-rose-800 to-red-900",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-800",
    progressFill: "bg-rose-700",
    buttonBg: "bg-rose-800",
    buttonHover: "hover:bg-rose-900",
  },
];

const CATEGORY_ICON_MAP: Record<string, string> = {
  "Education & Recognition": "GraduationCap",
  "Public Service Education": "BookOpen",
  "Environment & Sustainability": "Sprout",
  "Climate Awareness": "Footprints",
  "Educational Resources": "Library",
  "Digital Safety & Ethics": "ShieldCheck",
  "Mental Well-being": "HeartHandshake",
  "Preventive Healthcare": "Stethoscope",
  "Public Health & Hygiene": "Sparkles",
  "Community Healthcare": "HeartPulse",
  "Emergency Healthcare Support": "Siren",
};

// Deterministic generator using string hash
function generateFundraisingValues(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }

  const goalBase = (Math.abs(hash) % 4) + 2; // 2 to 5
  const goalAmount = goalBase * 100000;

  const raisedBase = Math.abs(hash * 31) % 100;
  const raisedPct = Math.max(20, Math.min(100, raisedBase));
  const raisedAmount = Math.round((goalAmount * raisedPct) / 100 / 1000) * 1000;

  const availableAmount = goalAmount - raisedAmount;
  const percentage = Math.round((raisedAmount / goalAmount) * 100);

  return {
    goalAmount,
    raisedAmount,
    availableAmount,
    percentage,
    formattedGoal: `₹${goalAmount.toLocaleString('en-IN')}`,
    formattedRaised: `₹${raisedAmount.toLocaleString('en-IN')}`,
    formattedAvailable: `₹${availableAmount.toLocaleString('en-IN')}`,
  };
}

/**
 * Deterministically selects a theme colour for a program based on its UUID.
 * Same program ID → same colour, always. No randomness involved.
 */
function getProgramTheme(programId: string) {
  let hash = 0;
  for (let i = 0; i < programId.length; i++) {
    hash = (hash << 5) - hash + programId.charCodeAt(i);
    hash |= 0;
  }
  return THEMES[Math.abs(hash) % THEMES.length];
}

export async function SupportOurInitiativesSection() {
  const result = await listPrograms({ page: 1, limit: 100 }, { visibility: 'public', status: 'active' });

  let initiatives: InitiativeItem[] = [];

  if (result.success && result.data) {
    const activePrograms = result.data.data;

    const canonicalPrograms = [...activePrograms].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    initiatives = canonicalPrograms.map((p, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = (p.metadata || {}) as any;
      const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.udbhavfoundation.in';
      const resolvedCover = p.cover_image?.r2_object_key
        ? `${r2Url}/${p.cover_image.r2_object_key}`
        : (meta.coverImageUrl as string) || '/hero/hero-01.png';

      const category = (meta.category as ProgrammeCategory) || 'Community Support';
      const theme = getProgramTheme(p.id);
      const iconName = CATEGORY_ICON_MAP[category] || "Heart";

      const fundValues = generateFundraisingValues(p.id);

      return {
        id: p.id,
        slug: p.slug,
        number: (index + 1).toString().padStart(2, '0'),
        title: p.title,
        category: category,
        description: p.short_description || '',
        image: resolvedCover,
        iconName,
        theme,
        donationUrl: `/donate?program=${p.slug}`,
        detailsUrl: `/programmes/${p.slug}`,
        ...fundValues,
      };
    });
  }

  return <SupportOurInitiativesClient initiatives={initiatives} />;
}
