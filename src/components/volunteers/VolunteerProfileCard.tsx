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

export function VolunteerProfileCard({ volunteer }: VolunteerProfileCardProps) {
  const bioText =
    volunteer.public_bio ||
    volunteer.skills ||
    "Dedicated volunteer contributing to community welfare and grassroots social impact.";

  const visibleTags = volunteer.preferred_areas?.slice(0, 2) || [];
  const remainingTagsCount = Math.max(0, (volunteer.preferred_areas?.length || 0) - 2);

  return (
    <div className="relative flex flex-col h-full bg-white rounded-[22px] border border-gray-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-[3px] transition-all duration-300 overflow-hidden group p-6 sm:p-7">
      
      {/* Profile Picture (Top Center) */}
      <div className="flex justify-center mb-5 mt-1">
        <div className="w-20 h-20 sm:w-[92px] sm:h-[92px] rounded-full bg-white shadow-sm ring-[3px] ring-[#006633]/15 transition-transform duration-300 group-hover:scale-[1.02] shrink-0 p-0.5">
          {volunteer.profile_picture_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={volunteer.profile_picture_url}
              alt={volunteer.full_name}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl text-[#006633] bg-[#E8F2EC]">
              {volunteer.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#12245F] text-center mb-2 line-clamp-1">
        {volunteer.full_name}
      </h3>

      {/* Accent Line */}
      <div className="flex justify-center mb-3">
        <div className="w-12 h-0.5 bg-[#006633]/30 rounded-full" />
      </div>

      {/* Role / Designation */}
      <div className="text-center mb-4">
        <span className="text-[14px] sm:text-[15px] font-medium text-[#006633]">
          {volunteer.volunteer_role || "Volunteer"}
        </span>
      </div>

      {/* Location & Occupation */}
      <div className="flex flex-col items-center justify-center text-[13px] sm:text-[14px] text-[#5E6B63] mb-5 space-y-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{volunteer.city_district}, {volunteer.state}</span>
        </div>
        <span className="truncate font-medium">{volunteer.occupation}</span>
      </div>

      {/* Bio */}
      <p className="text-[13px] sm:text-[14px] text-gray-500 line-clamp-2 text-center mb-6 leading-relaxed flex-grow">
        {bioText}
      </p>

      {/* Tags and Verification Footer */}
      <div className="mt-auto">
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-5">
            {visibleTags.map((area, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-[11px] sm:text-[12px] font-medium text-[#006633] bg-[#006633]/5 border border-[#006633]/10"
              >
                {area}
              </span>
            ))}
            {remainingTagsCount > 0 && (
              <span className="px-2.5 py-1 rounded-md text-[11px] sm:text-[12px] font-medium text-[#5E6B63] bg-gray-50 border border-gray-100">
                +{remainingTagsCount} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-center pt-5 border-t border-gray-100">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#006633]/10 text-[#006633] text-[12px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified UDBHAV Member
          </span>
        </div>
      </div>
    </div>
  );
}
