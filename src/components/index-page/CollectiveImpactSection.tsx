"use client";

import React from "react";
import {
  Trees,
  GraduationCap,
  Footprints,
  Stethoscope,
  ShieldAlert,
  HeartHandshake,
  Droplet,
  Ambulance,
} from "lucide-react";

interface ImpactMetricItem {
  id: string;
  numberText: string;
  label: string;
  Icon: React.ElementType;
}

const COLLECTIVE_METRICS: ImpactMetricItem[] = [
  {
    id: "cim-1",
    numberText: "1,000+",
    label: "Saplings Planted",
    Icon: Trees,
  },
  {
    id: "cim-2",
    numberText: "500+",
    label: "Students Supported Through Educational Initiatives",
    Icon: GraduationCap,
  },
  {
    id: "cim-3",
    numberText: "500+",
    label: "Climate Action Participants",
    Icon: Footprints,
  },
  {
    id: "cim-4",
    numberText: "400+",
    label: "Health Camp Beneficiaries",
    Icon: Stethoscope,
  },
  {
    id: "cim-5",
    numberText: "300+",
    label: "Students Reached Through Cyber Awareness",
    Icon: ShieldAlert,
  },
  {
    id: "cim-6",
    numberText: "200+",
    label: "Mental-health Participants",
    Icon: HeartHandshake,
  },
  {
    id: "cim-7",
    numberText: "100+",
    label: "Blood Units Collected",
    Icon: Droplet,
  },
  {
    id: "cim-8",
    numberText: "50+",
    label: "Emergency Cases Supported",
    Icon: Ambulance,
  },
];

export function CollectiveImpactSection() {
  return (
    <section
      id="collective-impact"
      className="py-16 sm:py-20 md:py-24 bg-[#FCFCF8] border-t border-gray-200/80 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3C9D23]/15 border border-[#3C9D23]/30 text-[#3C9D23] text-xs font-heading font-bold tracking-wider uppercase mb-4">
            OUR COLLECTIVE IMPACT
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#172B6B] leading-tight mb-4">
            Impact Created Together
          </h2>

          <p className="text-base sm:text-lg text-gray-700 font-normal">
            Every programme combines grassroots passion with structured follow-through,
            creating enduring outcomes across communities in Odisha.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIVE_METRICS.map((item) => {
            const { id, numberText, label, Icon } = item;
            return (
              <div
                key={id}
                className="group rounded-2xl bg-[#EAF3FF] border border-[#172B6B]/10 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 motion-reduce:transform-none"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3C9D23] text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform motion-reduce:transform-none">
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-[#172B6B] tracking-tight mb-2">
                    {numberText}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium leading-snug">
                    {label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
