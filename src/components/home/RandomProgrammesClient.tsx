'use client';

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { RevealCard } from "@/components/shared/RevealCard";
import { getProgramTheme, ProgramTheme } from "@/lib/utils/program-theme";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RandomProgrammesClient({ allPrograms }: { allPrograms: any[] }) {
  const [displayPrograms, setDisplayPrograms] = useState<any[]>([]);
  const [themes, setThemes] = useState<ProgramTheme[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (allPrograms && allPrograms.length > 0) {
      // Shuffle the programs
      const shuffled = [...allPrograms].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      
      setDisplayPrograms(selected);

      // Determine deterministic themes, with collision avoidance for adjacent cards
      const calculatedThemes: ProgramTheme[] = [];
      for (let i = 0; i < selected.length; i++) {
        let collisionOffset = 0;
        let theme = getProgramTheme(selected[i].id, collisionOffset);
        
        // Prevent adjacent identical themes
        if (i > 0 && theme.name === calculatedThemes[i - 1].name) {
          collisionOffset = 1;
          theme = getProgramTheme(selected[i].id, collisionOffset);
        }
        
        calculatedThemes.push(theme);
      }
      setThemes(calculatedThemes);
    }
  }, [allPrograms]);

  // Show a blank/skeleton structure before mount to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]">
        {/* We can just render empty cards or let it be blank because it mounts instantly on client */}
      </div>
    );
  }

  if (displayPrograms.length === 0) {
    return (
      <RevealCard as="div" index={1} className="bg-pure-white rounded-2xl border border-soft-border p-8 text-center shadow-sm">
        <p className="text-text-secondary text-base">
          No programmes available at the moment.
        </p>
      </RevealCard>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {displayPrograms.map((prog, idx) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const meta = (prog.metadata || {}) as any;
          const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.udbhavfoundation.in';
          const coverImageUrl = prog.cover_image?.r2_object_key 
            ? `${r2Url}/${prog.cover_image.r2_object_key}`
            : (meta.coverImageUrl as string) || '/hero/hero-01.png';
          
          const category = (meta.category as string) || prog.program_type || 'Community Support';
          
          const theme = themes[idx] || getProgramTheme(prog.id);

          return (
            <RevealCard 
              as="div" 
              index={idx + 1} 
              key={prog.id} 
              className={`flex flex-col h-full bg-pure-white rounded-2xl overflow-hidden border border-soft-border/50 shadow-sm transition-all duration-300 ${theme.cardHighlight} hover:shadow-md`}
            >
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
                  <span className={`inline-block px-2.5 py-1 text-[11px] sm:text-xs font-bold tracking-wide rounded-md uppercase ${theme.badgeBg} ${theme.badgeText}`}>
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
                    className={`inline-flex items-center text-xs sm:text-sm font-bold transition-colors group ${theme.accentText} ${theme.hoverAccent}`}
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
      
      {/* Mobile View All Button */}
      <div className="mt-8 text-center md:hidden">
        <Link href="/programmes" className="inline-flex items-center justify-center gap-2 text-sm font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link">
          <span>VIEW ALL PROGRAMMES</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </>
  );
}
