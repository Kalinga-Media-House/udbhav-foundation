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
    <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 bg-white overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#F4F8F6] to-transparent pointer-events-none" />

      <Container className="relative z-10">
        
        {/* Compact Hero Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-4">
          <RevealCard>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#12245F] tracking-tight mb-4">
              Meet Our Volunteers
            </h2>
            <p className="text-[15px] md:text-[17px] text-[#4F5E57] max-w-2xl mx-auto leading-relaxed">
              People who contribute their time, skills and passion to create meaningful change with <span className="font-medium text-[#006633]">UDBHAV FOUNDATION</span>.
            </p>
          </RevealCard>
        </div>

        {/* Directory Flex Grid */}
        {isLoading ? (
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[140px] md:w-[160px] flex flex-col items-center animate-pulse">
                <div className="w-[85px] h-[85px] md:w-[115px] md:h-[115px] rounded-full bg-gray-100 mb-4" />
                <div className="w-24 h-4 bg-gray-100 rounded mb-2" />
                <div className="w-16 h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : volunteers.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-[#7A8A82]/50 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#17231D]">No Volunteers Found</h3>
            <p className="text-sm text-[#4F5E57] mt-1">
              There are currently no active public volunteers.
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16 lg:gap-20">
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
