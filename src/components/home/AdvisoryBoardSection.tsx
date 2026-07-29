"use client";

import { User, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

import { RevealCard } from "@/components/shared/RevealCard";

export interface AdvisoryBoardMember {
  id: number;
  name: string;
  designation: string;
  image?: string;
}

export const ADVISORY_BOARD_MEMBERS: AdvisoryBoardMember[] = [
  {
    id: 1,
    name: "Mr. Prabhas Singh",
    designation: "Former MP, Bargarh",
  },
  {
    id: 2,
    name: "Mr. Dasarathi Satpathy",
    designation: "Former Secretary, Odisha Legislative Assembly",
  },
  {
    id: 3,
    name: "Ms. Subhra Subhadarshi",
    designation: "Head – Corporate Affairs, Sparc Pvt. Ltd.",
  },
  {
    id: 4,
    name: "Mr. Deepak Nath",
    designation: "Managing Director, Threatsys Technology Pvt. Ltd.",
  },
  {
    id: 5,
    name: "Mr. Sushant Mohanty",
    designation: "Managing Director, Shri Hari Enterprises",
  },
  {
    id: 6,
    name: "Ms. Jagruti Rath",
    designation: "Eminent Actress",
  },
  {
    id: 7,
    name: "Mr. Subhojit Panda",
    designation: "TV Anchor & Emcee",
  },
  {
    id: 8,
    name: "Mr. Amitesh Gugnani",
    designation:
      "Founder – Mango Hotel by Prangan; Co-founder – Rahat Hospital",
  },
  {
    id: 9,
    name: "Mr. Ratul Manek",
    designation: "Chief Financial Officer, Jyoti Construction",
  },
  {
    id: 10,
    name: "Ms. Chidatmika Khatua",
    designation:
      "Social Activist; Founder & CEO, Sushruta Hospital and Trauma Care; Managing Director, Odisha Cosmetic Surgery Clinic",
  },
  {
    id: 11,
    name: "Mr. Raju Das",
    designation: "Renowned Actor",
  },
  {
    id: 12,
    name: "Ms. Nandini Sahoo",
    designation: "Managing Director, IBL Beauty Academy",
  },
  {
    id: 13,
    name: "Mr. Subham Mohanty",
    designation: "Managing Director, Radha Govind Homes",
  },
  {
    id: 14,
    name: "Mr. Mihir Das",
    designation: "Managing Director, Suravi Milk",
  },
  {
    id: 15,
    name: "Mr. Arijit Pariksha",
    designation: "Founder – Utkal Pratidin; MD – Heronex Media Ltd.",
  },
  {
    id: 16,
    name: "Mr. Biswajeet Panigrahi",
    designation: "Director, Odisha IAS Academy",
  },
  {
    id: 17,
    name: "Mr. Kamala Kanta Rath",
    designation: "President, Para Sports Association, Odisha",
  },
];

export function AdvisoryBoardSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Detect reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    queueMicrotask(() => {
      setIsReducedMotion(mediaQuery.matches);
    });
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
      if (sectionRef.current) {
        const yOffset = -80; // Offset for fixed header
        const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: isReducedMotion ? "auto" : "smooth" });
      }
    } else {
      setIsExpanded(true);
    }
  };

  const displayedMembers = isExpanded
    ? ADVISORY_BOARD_MEMBERS
    : ADVISORY_BOARD_MEMBERS.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="advisory-board-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-warm-white via-pure-white to-soft-green/15 py-10 sm:py-14 md:py-20 border-t border-soft-border/40"
    >
      {/* Subtle Pale-Green Decorative Background Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-impact-green/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <RevealCard
          as="div"
          index={0}
          className="max-w-3xl mx-auto text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2
            id="advisory-board-heading"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-2.5 sm:mb-3"
          >
            ADVISORY BOARD
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto h-1 w-14 rounded-full bg-impact-green mb-3 sm:mb-3.5"
          />
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            “Guiding UDBHAV Foundation with experience, knowledge and shared
            purpose.”
          </p>
        </RevealCard>

        {/* Unified Member Grid */}
        <div
          id="advisory-board-list"
          className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-3.5"
        >
          {displayedMembers.map((member, idx) => {
            const isLastOddItem =
              idx === displayedMembers.length - 1 &&
              displayedMembers.length % 2 !== 0;

            return (
              <div
                key={`member-${member.id}`}
                className={
                  isLastOddItem
                    ? "md:col-span-2 md:flex md:justify-center"
                    : undefined
                }
              >
                <RevealCard
                  as="article"
                  index={idx + 1}
                  maxStagger={800}
                  className={`group relative flex items-center gap-3.5 w-full ${
                    isLastOddItem ? "md:w-[calc(50%-0.375rem)]" : ""
                  } min-h-[60px] py-3 px-4 rounded-xl bg-pure-white border border-impact-green/20 shadow-2xs hover:shadow-md hover:-translate-y-0.5 hover:border-impact-green/50 active:scale-[0.985] transition-all duration-300 ease-out`}
                >
                  {/* Circular Profile Image (~40px) */}
                  <div className="relative w-10 h-10 rounded-full border border-impact-green/40 bg-gradient-to-br from-soft-green via-warm-white to-soft-green/60 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden group-hover:border-impact-green/70 transition-colors">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={`Portrait of ${member.name}`}
                        fill
                        sizes="40px"
                        className="rounded-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`Profile placeholder for ${member.name}`}
                        className="w-full h-full flex items-center justify-center text-udbhav-blue-deep/70"
                      >
                        <User
                          className="w-5 h-5 stroke-[1.75]"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>

                  {/* Member Name and Designation */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-heading text-[14.5px] font-bold text-udbhav-blue-deep leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-[12.5px] text-text-secondary font-medium leading-snug mt-0.5 wrap-balance">
                      {member.designation}
                    </p>
                  </div>
                </RevealCard>
              </div>
            );
          })}
        </div>

        {/* Expand/Collapse Button */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
          <button
            onClick={handleToggle}
            aria-expanded={isExpanded}
            aria-controls="advisory-board-list"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-impact-green hover:bg-[#31851c] text-pure-white font-heading font-semibold text-sm transition-all shadow-md shadow-impact-green/20 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-impact-green focus:ring-offset-2"
          >
            <span>{isExpanded ? "Show Less" : "View All Advisory Members"}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdvisoryBoardSection;
