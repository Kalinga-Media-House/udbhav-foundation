'use client';

import React from 'react';

interface ImpactMetricItem {
  id: string;
  numberText: string;
  label: string;
  Icon: React.ElementType;
}

const COLLECTIVE_METRICS: Omit<ImpactMetricItem, 'Icon'>[] = [
  {
    id: 'cim-1',
    numberText: '1000+',
    label: 'Saplings Planted',
  },
  {
    id: 'cim-2',
    numberText: '500+',
    label: 'Students Supported',
  },
  {
    id: 'cim-3',
    numberText: '500+',
    label: 'Climate Action Participants',
  },
  {
    id: 'cim-4',
    numberText: '400+',
    label: 'Health Camps Beneficiaries',
  },
  {
    id: 'cim-5',
    numberText: '300+',
    label: 'Cyber Awareness Students',
  },
  {
    id: 'cim-6',
    numberText: '200+',
    label: 'Mental-health Participants',
  },
  {
    id: 'cim-7',
    numberText: '100+',
    label: 'Blood Units Collected',
  },
  {
    id: 'cim-8',
    numberText: '50+',
    label: 'Emergency Cases Supported',
  },
];

export function CollectiveImpactSection() {
  return (
    <section
      id="collective-impact"
      className="scroll-mt-20 border-t border-gray-200/80 bg-[#FCFCF8] py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3C9D23]/30 bg-[#3C9D23]/15 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-[#3C9D23]">
            OUR COLLECTIVE IMPACT
          </div>

          <h2 className="mb-4 font-heading text-3xl font-bold leading-tight text-[#172B6B] sm:text-4xl">
            Impact Created Together
          </h2>

          <p className="text-base font-normal text-gray-700 sm:text-lg">
            Every programme combines grassroots passion with structured follow-through, creating
            enduring outcomes across communities in Odisha.
          </p>
        </div>

        {/* 4-col Desktop / 3-col Tablet / 2-col Mobile */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {COLLECTIVE_METRICS.map((item) => {
            const { id, numberText, label } = item;
            return (
              <div
                key={id}
                className="flex transform flex-col justify-center rounded-[16px] border border-gray-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] motion-reduce:transform-none sm:rounded-[18px] sm:p-6"
              >
                <div className="mb-1.5 font-heading text-2xl font-bold tracking-tight text-[#172B6B] sm:text-3xl">
                  {numberText}
                </div>
                <p className="text-xs font-medium leading-relaxed text-gray-500 sm:text-sm">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
