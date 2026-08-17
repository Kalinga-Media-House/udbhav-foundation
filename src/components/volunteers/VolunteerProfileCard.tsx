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
  index?: number;
}

export function VolunteerProfileCard({ volunteer }: VolunteerProfileCardProps) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-white rounded-2xl border border-gray-200/70 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:-translate-y-[2px] transition-all duration-300 overflow-hidden group p-4 sm:p-5 lg:p-6">
      
      {/* Profile Picture (Top Center) */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] lg:w-[78px] lg:h-[78px] rounded-full bg-white shadow-sm ring-2 ring-[#006633]/15 transition-transform duration-300 group-hover:scale-[1.02] shrink-0 p-0.5">
          {volunteer.profile_picture_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={volunteer.profile_picture_url}
              alt={volunteer.full_name}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl text-[#006633] bg-[#E8F2EC]">
              {volunteer.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-[14px] sm:text-[16px] lg:text-[18px] leading-tight sm:leading-snug font-semibold text-[#12245F] text-center mb-2 sm:mb-2.5 w-full break-words">
        {volunteer.full_name}
      </h3>

      {/* Accent Line */}
      <div className="w-6 sm:w-8 h-0.5 bg-[#006633]/30 rounded-full mb-2 sm:mb-2.5" />

      {/* Role / Designation */}
      <div className="text-center w-full">
        <span className="text-[12px] sm:text-[13px] lg:text-[14px] leading-tight font-medium text-[#006633]">
          {volunteer.volunteer_role || "Volunteer"}
        </span>
      </div>

    </div>
  );
}
