"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const FOUNDER_IMAGE_PATH = "/images/team/jaysuraj-pattanayak.jpg";

export function FounderSpotlightSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      aria-labelledby="founder-spotlight-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-warm-white via-[#FDFCF8] to-pure-white py-10 sm:py-14 md:py-16 border-b border-soft-border/40"
    >
      <Container className="relative z-10">
        {/* Compact Premium Light-Blue Theme Card */}
        <div
          className="group/main relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-350 ease-out hover:-translate-y-1 p-5 sm:p-7 md:p-8 lg:py-9 lg:px-11"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.85), transparent 35%), linear-gradient(135deg, #F4F9FF 0%, #E5F1FF 48%, #D6E8FF 100%)`,
            border: "1px solid rgba(45, 85, 165, 0.20)",
            boxShadow: "0 16px 40px rgba(28, 67, 140, 0.15)",
          }}
        >
          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center lg:items-start">
            {/* LEFT COLUMN: Compact Founder Profile (~28% column width) */}
            <div className="w-full lg:col-span-4 xl:col-span-3 flex flex-col items-center lg:items-start">
              <RevealCard
                as="div"
                index={0}
                className="w-full flex flex-col items-center lg:items-start"
              >
                {/* Soft White/Light-Blue Glass Profile Card */}
                <div
                  className="group relative w-full max-w-[320px] lg:max-w-none rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-0.5"
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
                      Visionary Founder / Founder, UDBHAV Foundation
                    </p>
                  </div>
                </div>
              </RevealCard>
            </div>

            {/* RIGHT COLUMN: Heading + Spotlight Narrative + Quote (~72% width) */}
            <div className="w-full lg:col-span-8 xl:col-span-9 flex flex-col justify-center">
              <RevealCard as="div" index={1}>
                <span
                  className="eyebrow-label font-heading text-xs font-bold tracking-wider uppercase block mb-1.5"
                  style={{ color: "#238B45" }}
                >
                  FOUNDER SPOTLIGHT
                </span>
                <h2
                  id="founder-spotlight-heading"
                  className="font-heading text-2xl sm:text-3xl lg:text-[38px] font-bold tracking-tight leading-[1.12] mb-4"
                  style={{ color: "#172B6A" }}
                >
                  Building a Movement of Purpose
                </h2>
              </RevealCard>

              <RevealCard
                as="div"
                index={2}
                className="space-y-3 text-sm sm:text-[15.5px] lg:text-[16.5px] leading-[1.65]"
                style={{ color: "#263B5E" }}
              >
                <p>
                  Driven by the belief that meaningful change begins with
                  compassion, education, environmental responsibility, and
                  collective action, Jaysuraj Pattanayak founded UDBHAV
                  Foundation to bring people together around a shared purpose.
                </p>
                <p>
                  His vision continues to guide UDBHAV’s journey toward building
                  aware, empowered, inclusive, and resilient communities.
                </p>
              </RevealCard>

              {/* Compact Translucent Light-Blue Quote Card */}
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
                      className="w-5 h-5 shrink-0 opacity-90"
                      style={{ color: "#2F9638" }}
                    />
                    <p
                      className="font-heading text-[15px] sm:text-base lg:text-[17px] font-semibold leading-snug"
                      style={{ color: "#172B6A" }}
                    >
                      “Leadership is not only about guiding people—it is about
                      creating opportunities for people to lead change
                      together.”
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

export default FounderSpotlightSection;
