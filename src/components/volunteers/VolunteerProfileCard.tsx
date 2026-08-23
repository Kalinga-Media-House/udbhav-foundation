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
    <div className="relative flex flex-col items-center justify-center bg-transparent group p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1">
      
      {/* Profile Picture */}
      <div className="flex justify-center mb-4 md:mb-5">
        <div className="w-[85px] h-[85px] sm:w-[95px] sm:h-[95px] md:w-[115px] md:h-[115px] rounded-full bg-white ring-1 ring-[#006633]/30 group-hover:ring-[#006633]/60 transition-all duration-500 group-hover:scale-105 shrink-0 p-1 md:p-1.5 shadow-sm group-hover:shadow-md">
          {volunteer.profile_picture_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={volunteer.profile_picture_url}
              alt={volunteer.full_name}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-3xl md:text-4xl text-[#006633] bg-[#F4F8F6]">
              {volunteer.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-[17px] md:text-[19px] leading-snug font-semibold text-[#12245F] text-center mb-1.5 w-full">
        {volunteer.full_name}
      </h3>

      {/* Subtle Divider */}
      <div className="w-6 h-px bg-[#006633]/20 mb-2 transition-all duration-300 group-hover:bg-[#006633]/50 group-hover:w-8" />

      {/* Role / Designation */}
      <div className="text-center w-full">
        <span className="text-[13px] md:text-[14px] leading-tight font-medium text-[#006633] transition-colors duration-300">
          {volunteer.volunteer_role || "Volunteer"}
        </span>
      </div>

    </div>
  );
}
