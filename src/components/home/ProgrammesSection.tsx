import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { RevealCard } from "@/components/shared/RevealCard";
import { listPrograms } from "@/features/programs/actions";

export async function ProgrammesSection() {
  const result = await listPrograms({ page: 1, limit: 3 }, { visibility: 'public', status: 'active' });
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

        {/* Content */}
        {programs.length === 0 ? (
          <RevealCard as="div" index={1} className="bg-pure-white rounded-2xl border border-soft-border p-8 text-center shadow-sm">
            <p className="text-text-secondary text-base">
              No programmes available at the moment.
            </p>
          </RevealCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {programs.map((prog, idx) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const meta = (prog.metadata || {}) as any;
              const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.udbhavfoundation.in';
              const coverImageUrl = prog.cover_image?.r2_object_key 
                ? `${r2Url}/${prog.cover_image.r2_object_key}`
                : (meta.coverImageUrl as string) || '/hero/hero-01.png';
              
              const category = (meta.category as string) || prog.program_type || 'Community Support';
              
              return (
                <RevealCard as="div" index={idx + 1} key={prog.id} className="flex flex-col h-full bg-pure-white rounded-2xl overflow-hidden border border-soft-border/50 shadow-sm hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-100 shrink-0">
                    <Image 
                      src={coverImageUrl}
                      alt={prog.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 md:p-6">
                    <div className="mb-3">
                      <span className="inline-block px-2.5 py-1 bg-env-green/10 text-env-green text-[11px] sm:text-xs font-bold tracking-wide rounded-md uppercase">
                        {category}
                      </span>
                    </div>
                    
                    <h3 className="font-heading text-lg md:text-xl font-bold text-udbhav-blue-deep mb-2 line-clamp-2 leading-tight">
                      {prog.title}
                    </h3>
                    
                    <p className="text-sm text-text-secondary line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {prog.short_description || meta.fullDescription || ''}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-soft-border/30">
                      <Link 
                        href={prog.slug ? `/programmes/${prog.slug}` : '/programmes'}
                        className="inline-flex items-center text-xs sm:text-sm font-bold text-udbhav-blue-deep hover:text-env-green transition-colors group"
                      >
                        VIEW MORE
                        <ArrowRight className="ml-1.5 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </RevealCard>
              );
            })}
          </div>
        )}

        {/* Mobile View All Button */}
        {programs.length > 0 && (
          <div className="mt-8 text-center md:hidden">
            <Link href="/programmes" className="inline-flex items-center justify-center gap-2 text-sm font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link">
              <span>VIEW ALL PROGRAMMES</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
