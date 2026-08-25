import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { RevealCard } from "@/components/shared/RevealCard";
import { listPrograms } from "@/features/programs/actions";
import { RandomProgrammesClient } from "./RandomProgrammesClient";

export async function ProgrammesSection() {
  // Fetch up to 20 programs to give us a good pool for random selection
  const result = await listPrograms({ page: 1, limit: 20 }, { visibility: 'public', status: 'active' });
  const programs = result.success && result.data ? result.data.data : [];

  return (
    <section className="relative w-full overflow-hidden bg-warm-white py-12 md:py-16 lg:py-20 border-b border-soft-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <RevealCard as="div" index={0} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <span className="inline-block text-xs sm:text-sm font-heading font-bold text-impact-green tracking-wider uppercase mb-2">
              OUR PROGRAMMES
            </span>
            <h2 className="font-heading text-[26px] md:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight leading-tight mb-2">
              Making an Impact Through Action
            </h2>
            <div className="h-1 w-14 rounded-full bg-impact-green mb-3" aria-hidden="true" />
            <p className="text-sm md:text-base text-text-secondary leading-[1.6] max-w-2xl">
              Explore the programmes creating meaningful change across communities.
            </p>
          </div>
          
          {programs.length > 0 && (
            <div className="hidden md:block shrink-0">
              <Link href="/programmes" className="inline-flex items-center gap-2 text-sm sm:text-base font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link">
                <span>VIEW ALL PROGRAMMES</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
              </Link>
            </div>
          )}
        </RevealCard>

        {/* Content (Randomized on Client) */}
        <RandomProgrammesClient allPrograms={programs} />

      </div>
    </section>
  );
}
