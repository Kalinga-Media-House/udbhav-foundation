"use client";

import { Award, Clock, Search, ShieldCheck, User } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

interface PublicVolunteer {
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


export function PublicVolunteerDirectorySection() {
  const [volunteers, setVolunteers] = useState<PublicVolunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadVolunteers() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/public/volunteers?type=${encodeURIComponent(selectedType)}&q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setVolunteers(data.volunteers || []);
        }
      } catch {
        // Fallback or silent error
      } finally {
        setIsLoading(false);
      }
    }
    loadVolunteers();
  }, [selectedType, searchQuery]);

  return (
    <section className="py-20 bg-gradient-to-b from-pure-white via-[#F8FAF9] to-pure-white border-b border-[#E6EBE9]">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#17231D] tracking-tight mb-6">
            Meet Our Active Changemakers
          </h2>
          
          {/* Search Field */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8A82]" />
              <input
                type="text"
                placeholder="Search by bio or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[#D9E2DE] bg-white text-base text-[#17231D] placeholder-[#7A8A82] focus:outline-none focus:border-[#006633] focus:ring-2 focus:ring-[#006633]/10 shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-2xl border border-[#E6EBE9] animate-pulse p-6" />
            ))}
          </div>
        ) : volunteers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E6EBE9]">
            <Award className="w-12 h-12 text-[#7A8A82] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#17231D]">No Volunteers Found</h3>
            <p className="text-sm text-[#4F5E57] mt-1">
              No active volunteers match your current filter or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((vol) => (
              <RevealCard key={vol.id}>
                <div className="h-full bg-white rounded-2xl border border-[#E6EBE9] p-6 flex flex-col justify-between hover:shadow-xl transition-all hover:border-[#006633]/40 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2EC] text-[#006633] text-xs font-bold tracking-wider">
                        <Award className="w-3.5 h-3.5" />
                        {vol.volunteer_role || "Volunteer"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      {vol.profile_picture_url ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E8F2EC] shadow-sm shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={vol.profile_picture_url} 
                            alt={vol.full_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#006633] to-[#004D26] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                          {vol.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-base text-[#17231D] group-hover:text-[#006633] transition-colors">
                          {vol.full_name}
                        </h4>
                        <p className="text-xs text-[#7A8A82]">
                          {vol.city_district}, {vol.state}
                        </p>
                        <p className="text-xs text-[#4F5E57] font-medium mt-0.5">
                          {vol.occupation}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#4F5E57] line-clamp-3 mb-4">
                      {vol.public_bio || vol.skills || "Dedicated volunteer contributing to community welfare and grassroots social impact."}
                    </p>
                    
                    {vol.preferred_areas && vol.preferred_areas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {vol.preferred_areas.slice(0, 3).map((area, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[#F3F7F5] text-[#4F5E57] rounded-md text-[10px] font-semibold border border-[#E6EBE9]">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#F0F4F2] flex items-center justify-between text-xs text-[#4F5E57]">
                    <span className="inline-flex items-center gap-1 text-[#006633] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified UDBHAV Member
                    </span>
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
