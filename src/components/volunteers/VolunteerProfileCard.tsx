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
    <div className="relative flex flex-col items-center justify-center bg-transparent group p-1.5 min-[375px]:p-2 sm:p-4 md:p-6 transition-all duration-300 hover:-translate-y-1">
      
      {/* Profile Picture */}
      <div className="flex justify-center mb-2 min-[375px]:mb-3 sm:mb-4 md:mb-5">
        <div className="w-[60px] h-[60px] min-[375px]:w-[70px] min-[375px]:h-[70px] sm:w-[95px] sm:h-[95px] md:w-[115px] md:h-[115px] rounded-full bg-white ring-1 ring-[#006633]/30 group-hover:ring-[#006633]/60 transition-all duration-500 group-hover:scale-105 shrink-0 p-1 md:p-1.5 shadow-sm group-hover:shadow-md">
          {volunteer.profile_picture_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={volunteer.profile_picture_url}
              alt={volunteer.full_name}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-2xl min-[375px]:text-3xl md:text-4xl text-[#006633] bg-[#F4F8F6]">
              {volunteer.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-[13px] min-[375px]:text-[14px] sm:text-[17px] md:text-[19px] leading-tight sm:leading-snug font-semibold text-[#12245F] text-center mb-1 sm:mb-1.5 w-full break-words line-clamp-2">
        {volunteer.full_name}
      </h3>

      {/* Subtle Divider */}
      <div className="w-4 sm:w-6 h-px bg-[#006633]/20 mb-1 sm:mb-2 transition-all duration-300 group-hover:bg-[#006633]/50 group-hover:w-6 sm:group-hover:w-8" />

      {/* Role / Designation */}
      <div className="text-center w-full">
        <span className="text-[11px] min-[375px]:text-[12px] sm:text-[13px] md:text-[14px] leading-tight font-medium text-[#006633] transition-colors duration-300 line-clamp-2">
          {volunteer.volunteer_role || "Volunteer"}
        </span>
      </div>

    </div>
  );
}
