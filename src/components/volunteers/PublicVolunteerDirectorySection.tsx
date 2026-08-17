"use client";

import { Award, Clock, Search, ShieldCheck, User } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

import { VolunteerProfileCard, type PublicVolunteer } from "./VolunteerProfileCard";


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
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[200px] sm:h-[260px] bg-white rounded-2xl border border-[#E6EBE9] animate-pulse p-4 sm:p-6" />
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
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {volunteers.map((vol, index) => (
              <RevealCard key={vol.id}>
                <VolunteerProfileCard volunteer={vol} index={index} />
              </RevealCard>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
