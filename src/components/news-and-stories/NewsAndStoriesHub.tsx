'use client';
/* eslint-disable */

import { format } from 'date-fns';
import { motion, Variants } from 'framer-motion';
import { Search, ChevronDown, Clock, MapPin, Play, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';

import { Container } from '@/components/shared/Container';
import { ArticleWithMedia } from '@/features/news/repository';
import { getEventLifecycle } from '@/features/news/utils';
import { PodcastEpisodeItem } from '@/types/news';

type TabType = 'All' | 'News & Stories' | 'Upcoming Events' | 'Past Events';
type SortType = 'newest' | 'oldest';

interface NewsAndStoriesHubProps {
  articles: ArticleWithMedia[];
  podcasts: PodcastEpisodeItem[];
}

const CARD_PALETTE = [
  'bg-[#EAF6E4]', // Soft green
  'bg-[#E0F5EE]', // Light mint
  'bg-[#E6F0FA]', // Pale blue
  'bg-[#F0E6FA]', // Soft lavender
  'bg-[#FDF5E6]', // Warm cream
  'bg-[#FCEAE2]', // Light peach
  'bg-[#FFFBE6]', // Very light yellow
  'bg-[#E6F7FF]'  // Soft sky blue
];

const getCardColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_PALETTE[Math.abs(hash) % CARD_PALETTE.length];
};

// Fade up animation variant for scrolling
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// Stagger container
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function NewsAndStoriesHub({ articles, podcasts }: NewsAndStoriesHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortType>('newest');

  // Helper to safely format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // 1. Process all base articles through search query
  const baseSearchedArticles = useMemo(() => {
    return articles.filter((a) => {
      const query = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(query) ||
        (a.summary && a.summary.toLowerCase().includes(query)) ||
        (a.category && a.category.toLowerCase().includes(query)) ||
        (a.event_location && a.event_location.toLowerCase().includes(query))
      );
    }).sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
      }
      return new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime();
    });
  }, [articles, searchQuery, sortOrder]);

  // 2. Classify Events using Asia/Kolkata rules
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const eventsOnly = baseSearchedArticles.filter(a => a.category === 'Event');
    
    const upcoming: typeof eventsOnly = [];
    const past: typeof eventsOnly = [];

    eventsOnly.forEach(e => {
      const lifecycle = getEventLifecycle(e);
      if (lifecycle === 'UPCOMING') {
        upcoming.push(e);
      } else {
        past.push(e);
      }
    });

    // Sort Upcoming: Soonest first
    upcoming.sort((a, b) => {
      const dateA = a.event_date ? new Date(a.event_date).getTime() : new Date(a.published_at || a.created_at).getTime();
      const dateB = b.event_date ? new Date(b.event_date).getTime() : new Date(b.published_at || b.created_at).getTime();
      return dateA - dateB;
    });

    // Sort Past: Most recent first
    past.sort((a, b) => {
      const dateA = a.event_date ? new Date(a.event_date).getTime() : new Date(a.published_at || a.created_at).getTime();
      const dateB = b.event_date ? new Date(b.event_date).getTime() : new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [baseSearchedArticles]);

  // 3. Filter News/Stories explicitly (no events)
  const filteredNewsAndStories = useMemo(() => {
    return baseSearchedArticles.filter(a => a.category !== 'Event');
  }, [baseSearchedArticles]);

  // 4. Filter Podcasts
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter((p) => {
      const query = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.guest.fullName.toLowerCase().includes(query)
      );
    });
  }, [podcasts, searchQuery]);

  // Section visibility based on Tab
  const showStories = activeTab === 'All' || activeTab === 'News & Stories';
  const showUpcomingEvents = activeTab === 'All' || activeTab === 'Upcoming Events';
  const showPastEvents = activeTab === 'All' || activeTab === 'Past Events';

  // Category Color Map
  const getCategoryStyles = (category: string | undefined) => {
    switch (category?.toUpperCase()) {
      case 'NEWS': return 'text-[#20256F] border-[#20256F] bg-[#EEF2FF]';
      case 'STORY': return 'text-[#4FAF32] border-[#4FAF32] bg-[#EAF6E4]';
      case 'ANNOUNCEMENT': return 'text-[#E58000] border-[#E58000] bg-[#FFF6D8]';
      case 'PRESS RELEASE': return 'text-[#6B21A8] border-[#6B21A8] bg-[#F3E8FF]';
      default: return 'text-[#4FAF32] border-[#4FAF32] bg-[#EAF6E4]';
    }
  };

  const nearestEvent = upcomingEvents[0];

  return (
    <div className="bg-[#F8FAF7] w-full pb-24 overflow-hidden">
      
      {/* 1. HERO: NEAREST UPCOMING EVENT */}
      <section className="relative bg-[#F8FAF7] pt-8 lg:pt-12 pb-6">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-[#20256F] rounded-[24px] p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden shadow-sm"
          >
            {/* Subtle Gradient / Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            {nearestEvent ? (
              <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-10 relative z-10 w-full">
                
                {/* Calendar Date Badge */}
                <div 
                  className="flex flex-col shrink-0 rounded-[12px] overflow-hidden bg-white shadow-lg border border-white/20 w-[88px] sm:w-[100px]"
                  aria-label={`Event date: ${new Date(nearestEvent.event_date || nearestEvent.published_at || nearestEvent.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`}
                >
                  <div className="bg-[#4FAF32] text-white py-1.5 text-center">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                      {new Date(nearestEvent.event_date || nearestEvent.published_at || nearestEvent.created_at).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-2 sm:py-3 bg-white text-center">
                    <span className="font-heading text-4xl sm:text-5xl font-bold leading-none text-[#182033]">
                      {new Date(nearestEvent.event_date || nearestEvent.published_at || nearestEvent.created_at).getDate().toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#667085] mt-1">
                      {new Date(nearestEvent.event_date || nearestEvent.published_at || nearestEvent.created_at).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Divider on desktop */}
                <div className="hidden md:block w-px h-16 bg-white/20" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-[#4FAF32] text-[10px] font-bold uppercase tracking-widest mb-2 block">
                    NEXT UPCOMING EVENT
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2 line-clamp-1">
                    {nearestEvent.title}
                  </h2>
                  <p className="text-white/70 text-sm sm:text-base line-clamp-2 mb-3 max-w-2xl">
                    {nearestEvent.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/60 font-medium">
                    {nearestEvent.event_location && (
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#4FAF32]" />{nearestEvent.event_location}</span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#4FAF32]" />
                      {nearestEvent.event_start_time ? new Date(`1970-01-01T${nearestEvent.event_start_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                      {nearestEvent.event_end_time && ` – ${new Date(`1970-01-01T${nearestEvent.event_end_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex shrink-0 w-full md:w-auto mt-4 md:mt-0 justify-end md:justify-center">
                  <Link 
                    href={`/news-and-stories/${nearestEvent.slug}`} 
                    className="group/link flex-1 md:flex-none flex items-center justify-center px-8 py-3 bg-[#4FAF32] hover:bg-[#3E8B28] text-white rounded-full text-sm font-semibold transition-all shadow-sm shadow-[#4FAF32]/20 border border-transparent"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full relative z-10 gap-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">
                    No upcoming events
                  </h2>
                  <p className="text-white/70 text-sm">
                    Stay tuned for our next community initiative.
                  </p>
                </div>
                <div className="flex shrink-0 w-full md:w-auto mt-2 md:mt-0 justify-end md:justify-center">
                  <button 
                    onClick={() => {
                      setActiveTab('News & Stories');
                      document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group/link flex-1 md:flex-none flex items-center justify-center px-8 py-3 bg-[#4FAF32] hover:bg-[#3E8B28] text-white rounded-full text-sm font-semibold transition-all shadow-sm shadow-[#4FAF32]/20 border border-transparent"
                  >
                    Explore News 
                    <ArrowRight className="h-4 w-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* 2. PODCAST FEATURE */}
      <section className="relative bg-[#F8FAF7] pb-8 pt-2">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="bg-[#20256F] rounded-[24px] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm"
          >
            {/* Subtle waveform decorative blobs */}
            <div className="absolute inset-y-0 right-0 w-1/2 md:w-1/3 flex items-center justify-end pr-8 opacity-10 pointer-events-none overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['30%', '80%', '40%', '90%', '30%'] }}
                  transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
                  className="w-3 bg-[#4FAF32] rounded-full mx-1.5"
                />
              ))}
            </div>
            
            {filteredPodcasts.length > 0 ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full relative z-10">
                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                  {/* Thumbnail Image */}
                  <div className="relative w-full md:w-48 h-32 md:h-28 bg-[#181C5A] rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-inner">
                    {filteredPodcasts[0].thumbnailUrl || (filteredPodcasts[0] as any).thumbnail?.cdn_url ? (
                      <Image
                        src={filteredPodcasts[0].thumbnailUrl || (filteredPodcasts[0] as any).thumbnail?.cdn_url}
                        alt={filteredPodcasts[0].title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#181C5A]">
                        <Play className="h-8 w-8 text-[#4FAF32] opacity-50" />
                      </div>
                    )}
                  </div>
                  
                  <div className="md:hidden flex flex-col justify-center">
                    <span className="text-[#4FAF32] text-[10px] font-bold uppercase tracking-widest block mb-1">UDBHAV PODCAST</span>
                    <h3 className="text-white font-heading font-bold text-lg line-clamp-1">Conversations & Ideas</h3>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col md:border-l md:border-white/10 md:pl-6 justify-center">
                  <span className="hidden md:block text-[#4FAF32] text-[10px] font-bold uppercase tracking-widest mb-1.5">UDBHAV PODCAST</span>
                  <div className="flex items-center gap-2 mb-1.5">
                    {filteredPodcasts[0].episodeNumber && (
                      <span className="text-white/80 text-xs font-semibold tracking-wider bg-white/10 px-2 py-0.5 rounded-sm">
                        EPISODE {filteredPodcasts[0].episodeNumber}
                      </span>
                    )}
                    <span className="text-white/60 text-xs font-semibold">{formatDate(filteredPodcasts[0].releaseDate)}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white line-clamp-1 mb-1 group-hover:text-[#4FAF32] transition-colors">
                    {filteredPodcasts[0].title}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-1">{filteredPodcasts[0].description || filteredPodcasts[0].excerpt}</p>
                </div>
                
                <div className="shrink-0 w-full md:w-auto flex justify-end">
                  <Link 
                    href="/podcast"
                    className="group/listen flex items-center justify-center px-6 py-2.5 bg-[#4FAF32] hover:bg-[#3E8B28] text-white rounded-full text-sm font-semibold transition-all w-full md:w-auto shadow-sm shadow-[#4FAF32]/20"
                  >
                    Watch
                    <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover/listen:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full relative z-10 gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#4FAF32]/20 rounded-full flex items-center justify-center shrink-0">
                    <Play className="h-5 w-5 text-[#4FAF32] fill-current ml-1" />
                  </div>
                  <div>
                    <span className="text-[#4FAF32] text-[10px] font-bold uppercase tracking-widest block mb-1">UDBHAV PODCAST</span>
                    <h3 className="text-white font-heading font-bold text-lg md:text-xl max-w-lg">Conversations, ideas and stories from the UDBHAV community.</h3>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto flex justify-end">
                  <Link 
                    href="/podcast" 
                    className="group/listen flex items-center justify-center px-6 py-2.5 bg-[#4FAF32] hover:bg-[#3E8B28] text-white rounded-full text-sm font-semibold transition-all w-full md:w-auto shadow-sm shadow-[#4FAF32]/20"
                  >
                    Watch
                    <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover/listen:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* 3. NAVIGATION & CONTROLS */}
      <section className="sticky top-0 z-40 bg-[#F8FAF7]/90 backdrop-blur-xl border-b border-gray-200 py-4 mb-12 shadow-sm transition-all duration-300">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Category Tabs (Interactive) */}
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 lg:mx-0 lg:px-0" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              {(['All', 'News & Stories', 'Upcoming Events', 'Past Events'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative whitespace-nowrap pb-2 text-sm font-semibold transition-colors shrink-0"
                >
                  <span className={activeTab === tab ? 'text-[#4FAF32]' : 'text-[#667085] hover:text-[#20256F]'}>
                    {tab}
                  </span>
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4FAF32] rounded-t-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <div className="relative flex-1 sm:flex-none group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#4FAF32] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search stories, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full sm:w-[280px] pl-9 pr-3 py-2 rounded-full border border-gray-200 text-sm bg-white placeholder-gray-400 focus:outline-none focus:border-[#4FAF32] focus:ring-2 focus:ring-[#EAF6E4] shadow-sm transition-all duration-300"
                />
              </div>

              {showStories && (
                <div className="relative shrink-0 group">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortType)}
                    className="block w-full pl-4 pr-10 py-2 text-sm border border-gray-200 rounded-full bg-white text-[#182033] focus:outline-none focus:border-[#4FAF32] focus:ring-2 focus:ring-[#EAF6E4] shadow-sm appearance-none cursor-pointer transition-all duration-300"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400 group-focus-within:text-[#4FAF32] transition-colors" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <div className="space-y-24">
        
        {/* 3. UPCOMING EVENTS (HIGHEST PRIORITY) */}
        {showUpcomingEvents && upcomingEvents.length > 1 && (
          <Container>
            <motion.div 
              id="upcoming-events"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="mb-8 flex items-center gap-4"
            >
              <div>
                <span className="text-[#4FAF32] text-xs font-bold uppercase tracking-widest block mb-2">MORE UPCOMING</span>
                <h3 className="text-3xl sm:text-4xl font-heading font-bold text-[#20256F]">Other Events</h3>
              </div>
              <div className="hidden sm:block flex-1 h-[1px] bg-gradient-to-r from-gray-200 to-transparent ml-4 mt-8" />
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {upcomingEvents.slice(1).map((event, _index) => {
                const evtDate = new Date(event.event_date || event.published_at || event.created_at);
                const day = evtDate.getDate().toString().padStart(2, '0');
                const month = evtDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                
                return (
                <motion.div 
                  key={event.id}
                  variants={fadeUpVariant}
                  className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 p-6 sm:p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Hover Accent Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#4FAF32] transition-colors duration-300" />
                  {/* Subtle BG shift on hover */}
                  <div className="absolute inset-0 bg-[#EAF6E4] opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none" />

                  <div className="relative flex items-center gap-6 sm:gap-8 w-full md:w-auto z-10">
                    {/* Animated Calendar Block */}
                    <div 
                      className="flex flex-col shrink-0 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 w-[72px] sm:w-[88px] group-hover:shadow-md transition-shadow duration-300"
                      aria-label={`Event date: ${evtDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`}
                    >
                      <div className="bg-[#20256F] text-white py-1.5 text-center transition-colors duration-300 group-hover:bg-[#4FAF32]">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                          {month}
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2 bg-white text-center">
                        <span className="font-heading text-3xl sm:text-4xl font-bold leading-none text-[#182033] transform group-hover:scale-105 transition-transform duration-300">
                          {day}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#667085] mt-0.5">
                          {evtDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Event Image */}
                    <div className="relative w-full md:w-[240px] h-[140px] shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100/50">
                      <Image
                        src={event.cover_image?.cdn_url || '/placeholder-image.jpg'}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 240px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#20256F] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="flex flex-col flex-1 min-w-0 mt-4 md:mt-0 z-10">
                    <h4 className="text-2xl font-heading font-bold text-[#182033] mb-3 group-hover:text-[#4FAF32] transition-colors duration-300 transform group-hover:translate-x-1">
                      <Link href={`/news-and-stories/${event.slug}`} className="before:absolute before:inset-0">
                        {event.title}
                      </Link>
                    </h4>
                    <p className="text-[#667085] text-sm mb-5 line-clamp-2 pr-4">
                      {event.summary}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-[#667085] font-medium">
                      <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#4FAF32]" />{event.event_location || 'TBA'}</span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#4FAF32]" />
                        {event.event_start_time ? new Date(`1970-01-01T${event.event_start_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                        {event.event_end_time && ` – ${new Date(`1970-01-01T${event.event_end_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                    </div>
                  </div>

                  {/* Event Actions */}
                  <div className="flex items-center gap-4 mt-6 md:mt-0 shrink-0 w-full md:w-auto self-start md:self-center z-20">
                    {event.registration_url && (
                      <Link 
                        href={event.registration_url} 
                        className="group/btn flex items-center px-5 py-2.5 bg-[#4FAF32] hover:bg-[#3E8B28] text-white rounded-full text-sm font-semibold transition-all shadow-sm shadow-[#4FAF32]/20" 
                        target="_blank"
                      >
                        Register 
                        <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    )}
                    <Link 
                      href={`/news-and-stories/${event.slug}`} 
                      className="group/link flex items-center px-5 py-2.5 bg-[#F8FAF7] hover:bg-white border border-gray-200 text-[#182033] rounded-full text-sm font-semibold transition-all hover:border-[#4FAF32]"
                    >
                      Details
                      <ArrowRight className="h-4 w-4 ml-1.5 text-gray-400 group-hover/link:text-[#4FAF32] transform group-hover/link:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          </Container>
        )}

        {/* SECTION DIVIDER */}
        {showUpcomingEvents && showStories && upcomingEvents.length > 1 && (
          <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-center py-4">
            <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-r from-transparent via-[#4FAF32]/30 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#4FAF32]/40 mx-4" />
            <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-r from-[#4FAF32]/30 via-[#4FAF32]/30 to-transparent" />
          </div>
        )}

        {/* 4. LATEST NEWS & STORIES */}
        {showStories && (
          <Container>
            <motion.div 
              id="news-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="mb-8 flex items-center gap-4"
            >
              <h3 className="text-3xl font-heading font-bold text-[#20256F]">Latest News & Stories</h3>
              <div className="hidden sm:block flex-1 h-[1px] bg-gradient-to-r from-gray-200 to-transparent ml-4" />
            </motion.div>
            
            {filteredNewsAndStories.length > 0 ? (
              <motion.div 
                className="flex flex-col gap-8 md:gap-10 max-w-[1100px] mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {filteredNewsAndStories.map((article) => {
                  const cardBg = getCardColor(article.id);
                  return (
                  <motion.div 
                    key={article.id} 
                    variants={fadeUpVariant}
                    className={`group relative flex flex-col sm:flex-row gap-6 md:gap-8 p-6 md:p-8 rounded-[24px] ${cardBg} transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-md border border-black/5`}
                  >
                    <div className="relative w-full sm:w-[280px] md:w-[320px] lg:w-[380px] h-[200px] sm:h-auto sm:min-h-[220px] shrink-0 bg-white rounded-[16px] overflow-hidden shadow-sm border border-black/5">
                      <Image
                        src={article.cover_image?.cdn_url || '/placeholder-image.jpg'}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 320px, 380px"
                        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-col flex-1 py-1">
                      <div className="mb-4 flex items-center flex-wrap gap-2">
                        {article.is_featured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#20256F] px-2.5 py-1 rounded-md shadow-sm">
                            FEATURED
                          </span>
                        )}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-sm ${getCategoryStyles(article.category)}`}>
                          {article.category || 'Update'}
                        </span>
                      </div>
                      <h4 className={`font-heading font-bold text-[#182033] mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-[#4FAF32] ${article.is_featured ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'}`}>
                        <Link href={`/news-and-stories/${article.slug}`} className="before:absolute before:inset-0">
                          {article.title}
                        </Link>
                      </h4>
                      <p className="text-[#182033]/70 text-sm md:text-base line-clamp-3 mb-6 lg:pr-8">
                        {article.summary}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-sm">
                        <span className="text-[#182033]/60 font-semibold tracking-wide text-xs md:text-sm uppercase">{formatDate(article.published_at || article.created_at)}</span>
                        <div className="group/link inline-flex items-center font-bold text-[#182033] transition-colors relative z-10">
                          Read Story 
                          <ArrowRight className="h-4 w-4 ml-1.5 text-[#4FAF32] transform motion-safe:group-hover/link:translate-x-1 motion-safe:group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )})}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <p className="text-[#20256F] font-heading font-bold text-lg mb-1">No stories found.</p>
                <p className="text-[#667085] text-sm">Try changing your search or filter.</p>
              </motion.div>
            )}
          </Container>
        )}

        {/* 5. PAST EVENTS */}
        {showPastEvents && (
          <Container>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="mb-8 flex items-center gap-4"
            >
              <h3 className="text-2xl font-heading font-bold text-[#667085]">Past Events Archive</h3>
              <div className="flex-1 h-[1px] bg-gray-200 ml-4" />
            </motion.div>
            
            {pastEvents.length > 0 ? (
              <motion.div 
                className="flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {pastEvents.map((event) => {
                  const evtDate = new Date(event.event_date || event.published_at || event.created_at);
                  const formattedDate = evtDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
                  
                  return (
                  <motion.div 
                    key={event.id} 
                    variants={fadeUpVariant}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 sm:p-6 border-b border-gray-100 last:border-0 hover:bg-[#F8FAF7] transition-colors"
                  >
                    <div className="w-full sm:w-36 shrink-0 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#4FAF32] transition-colors" />
                      <span className="text-sm font-bold text-[#667085] group-hover:text-[#20256F] transition-colors">{formattedDate}</span>
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="text-lg font-heading font-bold text-[#182033] mb-1 truncate group-hover:text-[#4FAF32] transition-colors">
                        <Link href={`/news-and-stories/${event.slug}`} className="before:absolute before:inset-0">
                          {event.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-[#667085] line-clamp-1">{event.summary}</p>
                    </div>

                    <div className="mt-2 sm:mt-0 shrink-0 opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center text-sm font-semibold text-[#4FAF32]">
                      View Recap <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <p className="text-[#667085] text-base">No past events found.</p>
              </motion.div>
            )}
          </Container>
        )}

      </div>
    </div>
  );
}
