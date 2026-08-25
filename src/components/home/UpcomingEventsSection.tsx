 import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { RevealCard } from "@/components/shared/RevealCard";
import { EventCard } from "@/components/events/EventCard";
import { listEvents } from "@/features/events/actions";

export async function UpcomingEventsSection() {
  const result = await listEvents({ page: 1, limit: 100 }, { visibility: 'public' });
  let validEvents: any[] = [];
  
  if (result.success && result.data) {
    const today = new Date().toISOString();
    validEvents = result.data.data
      .filter((ev) => !['Draft', 'Archived', 'Cancelled'].includes(ev.status))
      .filter((ev) => ev.start_time && ev.start_time >= today)
      .sort((a, b) => a.start_time!.localeCompare(b.start_time!))
      .slice(0, 3);
  }

  return (
    <section className="relative w-full overflow-hidden bg-warm-white py-10 md:py-16 border-b border-soft-border/40">
      <div className="pointer-events-none absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-impact-green/5 blur-3xl translate-x-1/3 -translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <RevealCard as="div" index={0} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <span className="inline-block text-xs sm:text-sm font-heading font-bold text-impact-green tracking-wider uppercase mb-2">
              UPCOMING EVENTS
            </span>
            <h2 className="font-heading text-[26px] md:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight leading-tight mb-2">
              Be Part of What&apos;s Coming Next
            </h2>
            <div className="h-1 w-14 rounded-full bg-impact-green mb-3" aria-hidden="true" />
            <p className="text-sm md:text-base text-text-secondary leading-[1.6] max-w-2xl">
              Discover upcoming programmes, community initiatives and opportunities to participate in meaningful action.
            </p>
          </div>
          
          <div className="hidden md:block shrink-0">
            <Link href="/events" className="inline-flex items-center gap-2 text-sm sm:text-base font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link">
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </RevealCard>

        {/* Content */}
        {validEvents.length === 0 ? (
          <RevealCard as="div" index={1} className="bg-pure-white rounded-2xl border border-soft-border p-8 text-center shadow-sm">
            <h3 className="text-xl text-gray-500 mb-2">No upcoming events at the moment.</h3>
            <p className="text-text-secondary text-base mb-6">
              Please check back later for future programmes and opportunities.
            </p>
            <Link href="/events" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-impact-green hover:bg-env-green text-pure-white font-heading font-semibold text-sm transition-all shadow-md">
              View Past Events
            </Link>
          </RevealCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {validEvents.map((evt, idx) => (
              <RevealCard as="div" index={idx + 1} key={evt.id}>
                <EventCard event={evt} />
              </RevealCard>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        {validEvents.length > 0 && (
          <div className="mt-5 md:mt-6 text-center md:hidden">
            <Link href="/events" className="inline-flex items-center justify-center gap-2 text-sm font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link">
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
