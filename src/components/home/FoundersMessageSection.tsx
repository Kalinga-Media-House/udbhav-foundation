"use client";

import { Quote } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const FOUNDER_IMAGE_PATH = "/images/team/jaysuraj-pattanayak.jpg";

export function FoundersMessageSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      aria-labelledby="founder-message-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FDFCF8] via-pure-white to-warm-white py-8 sm:py-10 md:py-12 lg:py-14 border-b border-soft-border/40"
    >
      <Container className="relative z-10">
        {/* Compact Premium Light-Blue Theme Card */}
        <div
          className="group/main relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-350 ease-out hover:-translate-y-1 p-4 sm:p-6 md:p-7 lg:py-8 lg:px-10"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.85), transparent 35%), linear-gradient(135deg, #F4F9FF 0%, #E5F1FF 48%, #D6E8FF 100%)`,
            border: "1px solid rgba(45, 85, 165, 0.20)",
            boxShadow: "0 16px 40px rgba(28, 67, 140, 0.15)",
          }}
        >
          {/* 
            Compact Layout:
            Desktop (>=1024px):
              Two columns: Left Profile Card (~28%), Right Message Content (~72%)
            Mobile/Tablet (<1024px):
              Compact stack: Profile Card -> Message -> Quote
          */}
          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-9 items-center lg:items-start">
            {/* MOBILE ONLY HEADER (< 1024px) */}
            <div className="block lg:hidden w-full text-center sm:text-left mb-1">
              <RevealCard as="div" index={0}>
                <span
                  className="eyebrow-label font-heading text-[11.5px] sm:text-xs font-bold tracking-wider uppercase block mb-1"
                  style={{ color: "#238B45" }}
                >
                  A MESSAGE FROM OUR FOUNDER
                </span>
                <h2
                  id="founder-message-heading"
                  className="font-heading text-2xl sm:text-3xl font-bold tracking-tight leading-[1.12]"
                  style={{ color: "#172B6A" }}
                >
                  Building a Movement of Purpose
                </h2>
              </RevealCard>
            </div>

            {/* LEFT COLUMN: Compact Founder Profile Card (~28% column width) */}
            <div className="w-full lg:col-span-4 xl:col-span-3 flex flex-col items-center lg:items-start">
              <RevealCard
                as="div"
                index={1}
                className="w-full flex flex-col items-center lg:items-start"
              >
                {/* Soft White/Light-Blue Glass Profile Card */}
                <div
                  className="group relative w-full max-w-[340px] lg:max-w-none rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255, 255, 255, 0.58)",
                    border: "1px solid rgba(44, 82, 155, 0.20)",
                    boxShadow: "0 8px 24px rgba(28, 65, 130, 0.10)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Compact Profile Image */}
                  <div
                    className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-2xl overflow-hidden shrink-0 mb-3 sm:mb-3.5 shadow-sm"
                    style={{
                      background:
                        "linear-gradient(145deg, #DCEAFF 0%, #C4DAFA 100%)",
                      border: "1px solid rgba(43, 78, 150, 0.18)",
                    }}
                  >
                    {!imageError ? (
                      <Image
                        src={FOUNDER_IMAGE_PATH}
                        alt="Jaysuraj Pattanayak, Founder of Udbhav Foundation"
                        fill
                        sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 160px"
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] select-none"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      /* Graceful compact fallback avatar */
                      <div
                        role="img"
                        aria-label="Jaysuraj Pattanayak, Founder of Udbhav Foundation"
                        className="w-full h-full flex flex-col items-center justify-center p-3 text-center select-none"
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-xl shadow-sm"
                          style={{
                            background: "rgba(255, 255, 255, 0.75)",
                            border: "1px solid rgba(43, 78, 150, 0.25)",
                            color: "#172B6A",
                          }}
                        >
                          JP
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Founder Name & Designation */}
                  <div className="relative z-10 w-full">
                    <h3
                      className="font-heading text-lg sm:text-xl lg:text-[22px] font-bold tracking-tight leading-snug"
                      style={{ color: "#172B6A" }}
                    >
                      Jaysuraj Pattanayak
                    </h3>
                    <p
                      className="text-xs sm:text-sm font-medium mt-0.5 leading-snug"
                      style={{ color: "#2F9638" }}
                    >
                      Founder, UDBHAV Foundation
                    </p>
                  </div>
                </div>
              </RevealCard>
            </div>

            {/* RIGHT COLUMN: Desktop Heading + Message Paragraphs + Quote Card (~72% width) */}
            <div className="w-full lg:col-span-8 xl:col-span-9 flex flex-col justify-center">
              {/* DESKTOP ONLY HEADER */}
              <div className="hidden lg:block mb-3.5 xl:mb-4">
                <RevealCard as="div" index={0}>
                  <span
                    className="eyebrow-label font-heading text-xs font-bold tracking-wider uppercase block mb-1.5"
                    style={{ color: "#238B45" }}
                  >
                    A MESSAGE FROM OUR FOUNDER
                  </span>
                  <h2
                    className="font-heading text-3xl lg:text-[38px] xl:text-[42px] font-bold tracking-tight leading-[1.12]"
                    style={{ color: "#172B6A" }}
                  >
                    Building a Movement of Purpose
                  </h2>
                </RevealCard>
              </div>

              {/* Compact Founder Message Paragraphs */}
              <RevealCard
                as="div"
                index={2}
                className="space-y-2.5 sm:space-y-3 text-sm sm:text-[15px] lg:text-[16.5px] leading-[1.6] text-left"
                style={{ color: "#263B5E" }}
              >
                <p>
                  “UDBHAV Foundation was born from a simple yet profound
                  belief—that{" "}
                  <strong
                    className="font-semibold"
                    style={{ color: "#172B6A" }}
                  >
                    real change begins
                  </strong>{" "}
                  when we nurture minds, empower through education, and protect
                  the environment we all share.
                </p>

                <p>
                  Our journey is driven by the understanding that{" "}
                  <strong
                    className="font-semibold"
                    style={{ color: "#172B6A" }}
                  >
                    mental well-being, knowledge, and sustainability
                  </strong>{" "}
                  are not separate goals, but{" "}
                  <strong
                    className="font-semibold"
                    style={{ color: "#2F9638" }}
                  >
                    interconnected pillars of a thriving society
                  </strong>
                  . Every initiative we undertake is a step toward building
                  communities that are aware, resilient, and responsible.
                </p>

                <p>
                  We are not just working for change—we are building a{" "}
                  <strong
                    className="font-semibold"
                    style={{ color: "#172B6A" }}
                  >
                    movement of purpose, compassion, and action
                  </strong>
                  .”
                </p>
              </RevealCard>

              {/* Compact Highlighted Quote Card */}
              <RevealCard as="div" index={3} className="mt-4 sm:mt-5">
                <div
                  className="relative overflow-hidden rounded-xl py-3 px-4 sm:py-3.5 sm:px-5"
                  style={{
                    background: "rgba(255, 255, 255, 0.55)",
                    borderTop: "1px solid rgba(41, 77, 150, 0.20)",
                    borderRight: "1px solid rgba(41, 77, 150, 0.20)",
                    borderBottom: "1px solid rgba(41, 77, 150, 0.20)",
                    borderLeft: "4px solid #63D98B",
                    boxShadow: "0 5px 16px rgba(29, 64, 128, 0.07)",
                  }}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5">
                    <Quote
                      aria-hidden="true"
                      className="w-5 h-5 sm:w-5.5 sm:h-5.5 shrink-0 opacity-90"
                      style={{ color: "#2F9638" }}
                    />
                    <p
                      className="font-heading text-[15px] sm:text-base lg:text-[17px] font-semibold leading-snug"
                      style={{ color: "#172B6A" }}
                    >
                      “This is not just our mission—it is our responsibility.”
                    </p>
                  </div>
                </div>
              </RevealCard>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FoundersMessageSection;
