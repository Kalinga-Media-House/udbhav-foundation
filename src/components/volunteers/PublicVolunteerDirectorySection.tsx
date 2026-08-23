"use client";

import { Award } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

import { VolunteerProfileCard, type PublicVolunteer } from "./VolunteerProfileCard";

function getGridConfig(count: number) {
  if (count === 1) return "grid-cols-1 max-w-sm mx-auto";
  if (count === 2) return "grid-cols-1 min-[480px]:grid-cols-2 max-w-2xl mx-auto";
  if (count === 3) return "grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 max-w-4xl mx-auto";
  if (count === 4) return "grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-4 max-w-5xl mx-auto";
  if (count === 5) return "grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto";
  if (count === 6) return "grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto";
  if (count === 7) return "grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 max-w-[1300px] mx-auto";
  
  // 8 or more items
  return "grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 max-w-[1440px] mx-auto";
}

export function PublicVolunteerDirectorySection() {
  const [volunteers, setVolunteers] = useState<PublicVolunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_INITIAL_ROWS = 3;
  const CARDS_PER_ROW_LARGE = 8;
  const INITIAL_MAX_CARDS = MAX_INITIAL_ROWS * CARDS_PER_ROW_LARGE;
  
  const totalCards = volunteers.length;
  const showViewMore = totalCards > INITIAL_MAX_CARDS;
  const visibleVolunteers = isExpanded ? volunteers : volunteers.slice(0, INITIAL_MAX_CARDS);

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
    <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 bg-white overflow-hidden transition-all duration-500">
      
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

        {/* Directory Responsive Grid */}
        {isLoading ? (
          <div className={`grid gap-4 sm:gap-6 md:gap-8 w-full ${getGridConfig(8)}`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse p-4">
                <div className="w-[85px] h-[85px] md:w-[115px] md:h-[115px] rounded-full bg-gray-100 mb-4" />
                <div className="w-24 h-4 bg-gray-100 rounded mb-2" />
                <div className="w-16 h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : totalCards === 0 ? (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-[#7A8A82]/50 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#17231D]">No Volunteers Found</h3>
            <p className="text-sm text-[#4F5E57] mt-1">
              There are currently no active public volunteers.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className={`grid gap-4 sm:gap-6 md:gap-8 w-full ${getGridConfig(totalCards)}`}>
              {visibleVolunteers.map((vol, index) => (
                <RevealCard key={vol.id} index={index}>
                  <VolunteerProfileCard volunteer={vol} />
                </RevealCard>
              ))}
            </div>

            {showViewMore && (
              <div className="mt-12 md:mt-16 text-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-[#006633] text-[#006633] font-semibold hover:bg-[#006633] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {isExpanded ? "View Less" : "View More Volunteers"}
                </button>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
