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
    <div className="relative flex flex-col items-center justify-center h-full bg-white rounded-2xl border border-gray-200/70 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:-translate-y-[2px] transition-all duration-300 overflow-hidden group p-5 sm:p-6">
      
      {/* Profile Picture (Top Center) */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-full bg-white shadow-sm ring-2 ring-[#006633]/15 transition-transform duration-300 group-hover:scale-[1.02] shrink-0 p-0.5">
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
      <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#12245F] text-center mb-2.5 line-clamp-1 w-full">
        {volunteer.full_name}
      </h3>

      {/* Accent Line */}
      <div className="w-8 h-0.5 bg-[#006633]/30 rounded-full mb-2.5" />

      {/* Role / Designation */}
      <div className="text-center w-full">
        <span className="text-[13px] sm:text-[14px] font-medium text-[#006633]">
          {volunteer.volunteer_role || "Volunteer"}
        </span>
      </div>

    </div>
  );
}
