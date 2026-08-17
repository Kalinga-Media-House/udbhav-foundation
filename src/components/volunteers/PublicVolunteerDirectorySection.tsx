"use client";

import { Award } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

import { VolunteerProfileCard, type PublicVolunteer } from "./VolunteerProfileCard";

export function PublicVolunteerDirectorySection() {
  const [volunteers, setVolunteers] = useState<PublicVolunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVolunteers() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/public/volunteers?limit=100`);
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
  }, []);

  return (
    <section className="relative pt-16 md:pt-24 pb-20 bg-gradient-to-b from-white via-[#F8FAF9] to-white border-b border-[#E6EBE9] overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#E8F2EC]/60 to-transparent pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-[150%] w-72 h-72 bg-[#006633]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-1/2 translate-x-[50%] w-72 h-72 bg-[#12245F]/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        
        {/* Premium Hero Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-4 sm:px-6">
          <RevealCard>
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#E8F2EC] text-[#006633] text-[11px] md:text-xs font-bold tracking-widest uppercase mb-4 sm:mb-5 shadow-sm border border-[#006633]/10">
              Our Change Makers
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#12245F] tracking-tight mb-4 sm:mb-6 leading-tight">
              Meet Our Active Changemakers
            </h2>
            <p className="text-[14px] sm:text-[15px] md:text-lg text-[#4F5E57] max-w-2xl mx-auto leading-relaxed">
              People who volunteer their time, skills, and passion to create meaningful change with UDBHAV FOUNDATION.
            </p>
          </RevealCard>
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
              There are currently no active public volunteers.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {volunteers.map((vol, index) => (
              <RevealCard key={vol.id} index={index}>
                <VolunteerProfileCard volunteer={vol} />
              </RevealCard>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
