import { ShieldCheck, MapPin } from "lucide-react";
import React from "react";

export interface PublicVolunteer {
  id: string;
  full_name: string;
  profile_picture_url?: string | null;
  occupation: string;
  city_district: string;
  state: string;
  preferred_areas?: string[] | null;
  skills?: string | null;
  public_bio?: string | null;
  volunteer_role?: string | null;
}

interface VolunteerProfileCardProps {
  volunteer: PublicVolunteer;
  index: number;
}

// UDBHAV inspired colour palettes for the cards
const colorPalettes = [
  {
    header: "bg-gradient-to-br from-blue-900 to-teal-700",
    ring: "ring-teal-100",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    tagBg: "bg-blue-50",
    tagText: "text-blue-700",
  },
  {
    header: "bg-gradient-to-br from-teal-700 to-emerald-500",
    ring: "ring-emerald-100",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
  },
  {
    header: "bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600",
    ring: "ring-amber-100",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    tagBg: "bg-emerald-50",
    tagText: "text-emerald-700",
  },
  {
    header: "bg-gradient-to-br from-indigo-800 to-teal-600",
    ring: "ring-indigo-100",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
  },
];

export function VolunteerProfileCard({ volunteer, index }: VolunteerProfileCardProps) {
  // Use volunteer ID to deterministically pick a palette, fallback to index
  const paletteIndex = volunteer.id
    ? volunteer.id.charCodeAt(0) % colorPalettes.length
    : index % colorPalettes.length;
  const palette = colorPalettes[paletteIndex];

  const bioText =
    volunteer.public_bio ||
    volunteer.skills ||
    "Dedicated volunteer contributing to community welfare and grassroots social impact.";

  const visibleTags = volunteer.preferred_areas?.slice(0, 2) || [];
  const remainingTagsCount = Math.max(0, (volunteer.preferred_areas?.length || 0) - 2);

  return (
    <div className="relative flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Colourful Header */}
      <div className={`h-24 sm:h-28 w-full ${palette.header} relative`} />

      <div className="px-6 pb-6 flex-grow flex flex-col relative z-10 -mt-12 sm:-mt-14">
        {/* Profile Picture */}
        <div className="flex justify-center mb-3">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1 shadow-md ring-4 ${palette.ring} transition-transform duration-300 group-hover:scale-105 shrink-0`}
          >
            {volunteer.profile_picture_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={volunteer.profile_picture_url}
                alt={volunteer.full_name}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            ) : (
              <div
                className={`w-full h-full rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl text-white ${palette.header}`}
              >
                {volunteer.full_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Role Badge */}
        <div className="flex justify-center mb-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${palette.badgeBg} ${palette.badgeText}`}
          >
            {volunteer.volunteer_role || "Volunteer"}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-xl sm:text-2xl font-bold text-[#12245F] text-center mb-1 line-clamp-1">
          {volunteer.full_name}
        </h3>

        {/* Location & Occupation */}
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-4">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {volunteer.city_district}, {volunteer.state}
          </span>
          <span className="text-gray-300 px-0.5">•</span>
          <span className="truncate">{volunteer.occupation}</span>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 line-clamp-2 text-center mb-5 leading-relaxed flex-grow">
          {bioText}
        </p>

        {/* Tags and Verification Footer */}
        <div className="mt-auto">
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {visibleTags.map((area, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border border-opacity-20 border-current ${palette.tagBg} ${palette.tagText}`}
                >
                  {area}
                </span>
              ))}
              {remainingTagsCount > 0 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-md text-[11px] font-semibold border border-gray-100">
                  +{remainingTagsCount} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-center pt-4 border-t border-gray-50">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" /> Verified UDBHAV Member
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
