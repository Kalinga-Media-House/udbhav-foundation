"use client";

import { Award, Clock, Search, ShieldCheck, User } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

interface PublicVolunteer {
  id: string;
  volunteer_code: string;
  status: string;
  volunteer_type: string;
  bio?: string | null;
  total_hours?: number;
  metadata?: {
    skills?: string;
    preferred_areas?: string[];
    city_district?: string;
    state?: string;
  };
}

const TYPE_FILTERS = [
  "All",
  "Event",
  "Core",
  "Mentor",
  "Trainer",
  "Medical",
  "Disaster Relief",
  "Technical",
];

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
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F2EC] text-[#006633] text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Public Volunteer Directory</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#17231D] tracking-tight">
            Meet Our Active Changemakers
          </h2>
          <p className="mt-4 text-base text-[#4F5E57]">
            Our verified volunteers drive ground-level impact across India. Recognized by their immutable UDBHAV Volunteer Codes, they represent integrity and service.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 bg-white p-4 rounded-2xl border border-[#E6EBE9] shadow-sm">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedType === type
                    ? "bg-[#006633] text-white shadow-md shadow-[#006633]/20"
                    : "bg-[#F3F7F5] text-[#4F5E57] hover:bg-[#E8F2EC] hover:text-[#006633]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8A82]" />
            <input
              type="text"
              placeholder="Search by bio or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D9E2DE] bg-white text-sm text-[#17231D] placeholder-[#7A8A82] focus:outline-none focus:border-[#006633] focus:ring-2 focus:ring-[#006633]/10"
            />
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
                        {vol.volunteer_code}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F3F7F5] text-[#4F5E57]">
                        {vol.volunteer_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006633] to-[#004D26] text-white flex items-center justify-center font-bold text-lg shadow-md">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#17231D] group-hover:text-[#006633] transition-colors">
                          UDBHAV Volunteer
                        </h4>
                        <p className="text-xs text-[#7A8A82]">
                          {vol.metadata?.city_district || "India"}{vol.metadata?.state ? `, ${vol.metadata.state}` : ""}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#4F5E57] line-clamp-3 mb-4">
                      {vol.bio || vol.metadata?.skills || "Dedicated volunteer contributing to community welfare and grassroots social impact."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F0F4F2] flex items-center justify-between text-xs text-[#4F5E57]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#006633]">
                      <Clock className="w-4 h-4" />
                      <span>{vol.total_hours || 0} Hours Contributed</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#006633] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
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
