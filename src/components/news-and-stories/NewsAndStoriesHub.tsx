'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, Clock, MapPin, Play, ArrowRight } from 'lucide-react';
import { getEventLifecycle } from '@/features/news/utils';
import { format } from 'date-fns';

import { Container } from '@/components/shared/Container';
import { ArticleWithMedia } from '@/features/news/repository';
import { PodcastEpisodeItem } from '@/types/news';

type TabType = 'All' | 'News & Stories' | 'Upcoming Events' | 'Past Events' | 'Podcast';
type SortType = 'newest' | 'oldest';

interface NewsAndStoriesHubProps {
  articles: ArticleWithMedia[];
  podcasts: PodcastEpisodeItem[];
}

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

  // Derived state for filtering
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
  const showPodcast = activeTab === 'All' || activeTab === 'Podcast';

  return (
    <div className="bg-[#FFFFFF] w-full pb-24">
      {/* 1. PAGE HEADER */}
      <section className="bg-[#FFFFFF] pt-16 pb-8">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#20256F] tracking-tight mb-4">
              Stories, Updates & Events
            </h1>
            <p className="text-[#667085] text-base sm:text-lg leading-relaxed max-w-2xl">
              Stay connected with UDBHAV Foundation through community initiatives, upcoming events, stories and updates.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. NAVIGATION & CONTROLS */}
      <section className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-gray-200 py-4 mb-10">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Tabs (Editorial Style) */}
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-none pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              {(['All', 'News & Stories', 'Upcoming Events', 'Past Events', 'Podcast'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap pb-1 text-sm font-semibold transition-all shrink-0 border-b-2 ${
                    activeTab === tab
                      ? 'text-[#4FAF32] border-[#4FAF32]'
                      : 'text-[#667085] border-transparent hover:text-[#20256F]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search stories, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full sm:w-[280px] pl-9 pr-3 py-2 border-b border-gray-200 text-sm bg-transparent placeholder-gray-400 focus:outline-none focus:border-[#4FAF32] transition-colors"
                />
              </div>

              {showStories && (
                <div className="relative shrink-0">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortType)}
                    className="block w-full pl-3 pr-8 py-2 text-sm border-b border-gray-200 bg-transparent text-[#182033] focus:outline-none focus:border-[#4FAF32] appearance-none cursor-pointer transition-colors"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <div className="space-y-20">
        
        {/* 3. UPCOMING EVENTS (HIGHEST PRIORITY) */}
        {showUpcomingEvents && (
          <Container>
            <div className="mb-8 border-b border-gray-200 pb-4">
              <span className="text-[#4FAF32] text-xs font-bold uppercase tracking-widest block mb-2">WHAT'S COMING UP</span>
              <h3 className="text-3xl font-heading font-bold text-[#20256F]">Upcoming Events</h3>
              <p className="text-[#667085] mt-2">Join us in the next chapter of community action.</p>
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="flex flex-col">
                {upcomingEvents.map((event) => {
                  const evtDate = new Date(event.event_date || event.published_at || event.created_at);
                  const day = evtDate.getDate().toString().padStart(2, '0');
                  const month = evtDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  
                  return (
                  <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 py-8 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto">
                      <div className="flex flex-col items-center justify-center min-w-[60px] shrink-0 text-center">
                        <span className="font-heading text-4xl font-bold leading-none text-[#20256F]">
                          {day}
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest text-[#4FAF32] mt-1">
                          {month}
                        </span>
                      </div>
                      <div className="relative w-full sm:w-[220px] h-[135px] shrink-0 rounded-[8px] overflow-hidden bg-gray-100">
                        <Image
                          src={event.cover_image?.cdn_url || '/placeholder-image.jpg'}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 220px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0 mt-4 sm:mt-0">
                      <span className="text-[#4FAF32] text-xs font-bold uppercase tracking-wider mb-2">
                        EVENT
                      </span>
                      <h4 className="text-2xl font-heading font-bold text-[#182033] mb-2 hover:text-[#4FAF32] transition-colors">
                        <Link href={`/news-and-stories/${event.slug}`}>
                          {event.title}
                        </Link>
                      </h4>
                      <p className="text-[#667085] text-sm mb-4 line-clamp-2">
                        {event.summary}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-[#667085]">
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#20256F]" />{event.event_location || 'TBA'}</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-[#20256F]" />
                          {event.event_start_time ? new Date(`1970-01-01T${event.event_start_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                          {event.event_end_time && ` – ${new Date(`1970-01-01T${event.event_end_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6 sm:mt-0 shrink-0 w-full sm:w-auto self-start sm:self-center">
                      <Link href={`/news-and-stories/${event.slug}`} className="text-sm font-semibold text-[#182033] hover:text-[#4FAF32] transition-colors">
                        Details &rarr;
                      </Link>
                      {event.registration_url && (
                        <Link href={event.registration_url} className="text-sm font-semibold text-[#4FAF32] hover:text-[#317a19] transition-colors" target="_blank">
                          Register &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8">
                <p className="text-[#667085] text-base">No upcoming events at the moment.</p>
                <p className="text-[#667085] text-sm mt-1">Check back soon for our next community initiative.</p>
              </div>
            )}
          </Container>
        )}

        {/* 4. LATEST NEWS & STORIES */}
        {showStories && (
          <Container>
            <div className="mb-8 border-b border-gray-200 pb-4">
              <h3 className="text-3xl font-heading font-bold text-[#20256F]">Latest News & Stories</h3>
            </div>
            
            {filteredNewsAndStories.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {filteredNewsAndStories.map((article) => (
                  <div key={article.id} className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                    <div className="relative w-full sm:w-[250px] h-[160px] shrink-0 bg-gray-100 rounded-[8px] overflow-hidden">
                      <Image
                        src={article.cover_image?.cdn_url || '/placeholder-image.jpg'}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 250px"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="mb-2">
                        {article.is_featured ? (
                          <span className="text-xs font-bold uppercase tracking-wider text-[#20256F] bg-[#F7F9F5] px-2 py-1 rounded">
                            FEATURED
                          </span>
                        ) : (
                          <span className="text-[#4FAF32] text-xs font-bold uppercase tracking-wider">
                            {article.category || 'Update'}
                          </span>
                        )}
                      </div>
                      <h4 className={`font-heading font-bold text-[#182033] mb-2 line-clamp-2 hover:text-[#4FAF32] transition-colors ${article.is_featured ? 'text-xl' : 'text-lg'}`}>
                        <Link href={`/news-and-stories/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h4>
                      <p className="text-[#667085] text-sm line-clamp-2 mb-4">
                        {article.summary}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-sm">
                        <span className="text-[#667085]">{formatDate(article.published_at || article.created_at)}</span>
                        <Link href={`/news-and-stories/${article.slug}`} className="font-semibold text-[#182033] hover:text-[#4FAF32] transition-colors">
                          Read Story &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8">
                <p className="text-[#667085] text-base">No stories found.</p>
                <p className="text-[#667085] text-sm mt-1">Try changing your search or filter.</p>
              </div>
            )}
          </Container>
        )}

        {/* 5. PAST EVENTS */}
        {showPastEvents && (
          <Container>
            <div className="mb-8 border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-heading font-bold text-[#20256F]">Past Events</h3>
            </div>
            
            {pastEvents.length > 0 ? (
              <div className="flex flex-col">
                {pastEvents.map((event) => {
                  const evtDate = new Date(event.event_date || event.published_at || event.created_at);
                  const formattedDate = evtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
                  
                  return (
                  <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-6 border-b border-gray-100 last:border-0 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="w-full sm:w-32 shrink-0">
                      <span className="text-sm font-bold text-[#667085]">{formattedDate}</span>
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="text-lg font-heading font-bold text-[#182033] mb-1 truncate">
                        <Link href={`/news-and-stories/${event.slug}`} className="hover:text-[#4FAF32] transition-colors">
                          {event.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-[#667085] line-clamp-1">{event.summary}</p>
                    </div>

                    <div className="mt-2 sm:mt-0 shrink-0">
                      <Link href={`/news-and-stories/${event.slug}`} className="text-sm font-semibold text-[#182033] hover:text-[#4FAF32] transition-colors">
                        View Details &rarr;
                      </Link>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8">
                <p className="text-[#667085] text-base">No past events found.</p>
              </div>
            )}
          </Container>
        )}

        {/* 6. UDBHAV PODCAST */}
        {showPodcast && (
          <Container>
            <div className="bg-[#F7F9F5] rounded-[8px] p-8 lg:p-12 mb-10">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="lg:w-1/3">
                  <span className="text-[#4FAF32] text-xs font-bold uppercase tracking-widest block mb-2">UDBHAV PODCAST</span>
                  <h3 className="text-3xl font-heading font-bold text-[#20256F] mb-4">
                    Listen to conversations, ideas and stories from the UDBHAV community.
                  </h3>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="inline-flex items-center text-[#182033] font-semibold hover:text-[#4FAF32] transition-colors">
                    Official Channel &rarr;
                  </a>
                </div>
                
                <div className="lg:w-2/3 w-full">
                  {filteredPodcasts.length > 0 ? (
                    <div className="flex flex-col border-t border-gray-200">
                      {filteredPodcasts.slice(0, activeTab === 'Podcast' ? 10 : 3).map((ep) => (
                        <div key={ep.id} className="group flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-200 transition-colors">
                          <div className="flex flex-col flex-1 justify-center">
                            <span className="text-[#667085] text-xs font-bold uppercase mb-2">EPISODE {ep.episodeNumber} • {ep.releaseDate}</span>
                            <h4 className="text-xl font-heading font-bold text-[#182033] line-clamp-2 mb-2 group-hover:text-[#4FAF32] transition-colors">
                              <Link href={`/news-and-stories/podcast/${ep.slug}`}>
                                {ep.title}
                              </Link>
                            </h4>
                            <p className="text-[#667085] text-sm line-clamp-2 mb-4">{ep.description}</p>
                            <Link href={`/news-and-stories/podcast/${ep.slug}`} className="inline-flex items-center text-[#182033] font-semibold text-sm hover:text-[#4FAF32] transition-colors">
                              Listen <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                          </div>
                          <div className="relative w-full sm:w-[200px] h-[120px] shrink-0 rounded-[8px] overflow-hidden bg-gray-100 self-start">
                            <Image src={ep.thumbnailUrl} alt={ep.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="h-10 w-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                                <Play className="h-4 w-4 text-[#20256F] fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8">
                      <p className="text-[#667085] text-base">No podcast episodes available yet.</p>
                      <Link href="https://youtube.com" className="text-sm font-semibold text-[#182033] mt-2 block hover:text-[#4FAF32]">Official Channel &rarr;</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        )}

      </div>
    </div>
  );
}
