'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, Clock, MapPin, Play, Calendar, ArrowRight } from 'lucide-react';
import { getEventLifecycle } from '@/features/news/utils';
import { format } from 'date-fns';

import { Container } from '@/components/shared/Container';
import { ArticleWithMedia } from '@/features/news/repository';
import { UpcomingEventItem, PodcastEpisodeItem } from '@/types/news';

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

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [baseSearchedArticles]);

  // 3. Filter News/Stories explicitly (no events)
  const filteredNewsAndStories = useMemo(() => {
    return baseSearchedArticles.filter(a => a.category !== 'Event');
  }, [baseSearchedArticles]);

  // 4. Determine featured article (can be news or event)
  const featuredArticle = useMemo(() => {
    if (activeTab === 'Podcast') return undefined; // No featured article on podcast tab
    let pool = baseSearchedArticles;
    if (activeTab === 'News & Stories') pool = filteredNewsAndStories;
    if (activeTab === 'Upcoming Events') pool = upcomingEvents;
    if (activeTab === 'Past Events') pool = pastEvents;
    
    return pool.find(a => a.is_featured) || pool[0];
  }, [baseSearchedArticles, filteredNewsAndStories, upcomingEvents, pastEvents, activeTab]);

  const regularNewsAndStories = filteredNewsAndStories.filter(a => a.id !== featuredArticle?.id);
  const filteredUpcomingEvents = upcomingEvents.filter(a => a.id !== featuredArticle?.id);
  const filteredPastEvents = pastEvents.filter(a => a.id !== featuredArticle?.id);

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
    <div className="bg-pure-white w-full pb-20">
      {/* 1. PAGE HEADER */}
      <section className="bg-pure-white pt-16 pb-8 border-b border-soft-border/40">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-udbhav-blue-deep tracking-tight mb-4">
              Stories, Updates & Events
            </h1>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl">
              Stay connected with UDBHAV Foundation through our latest stories, community initiatives, events and updates.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. NAVIGATION & CONTROLS */}
      <section className="sticky top-0 z-40 bg-pure-white/95 backdrop-blur-md border-b border-soft-border/50 py-4 shadow-sm">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              {(['All', 'News & Stories', 'Upcoming Events', 'Past Events', 'Podcast'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 ${
                    activeTab === tab
                      ? 'bg-[#EEF8E9] text-[#439B25]'
                      : 'bg-transparent text-gray-500 hover:text-udbhav-blue-deep hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search stories, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full sm:w-[280px] pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#439B25] focus:border-[#439B25] transition-colors"
                />
              </div>

              {showStories && (
                <div className="relative shrink-0">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortType)}
                    className="block w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#439B25] focus:border-[#439B25] appearance-none cursor-pointer transition-colors"
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

      <div className="py-10 space-y-16">
        
        {/* 3. FEATURED STORY */}
        {showStories && featuredArticle && !searchQuery && activeTab === 'All' && (
          <Container>
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="flex flex-col lg:flex-row">
                <div className="relative w-full lg:w-[55%] h-64 sm:h-80 lg:h-auto overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={featuredArticle.cover_image?.cdn_url || '/placeholder-image.jpg'}
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-10 flex flex-col justify-center w-full lg:w-[45%]">
                  <span className="text-[#439B25] text-xs font-bold uppercase tracking-wider mb-3">
                    FEATURED {featuredArticle.category === 'Event' ? 'EVENT' : 'STORY'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-udbhav-blue-deep mb-4 hover:text-[#439B25] transition-colors">
                    <Link href={`/news-and-stories/${featuredArticle.slug}`}>
                      {featuredArticle.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-3">
                    {featuredArticle.summary}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">{formatDate(featuredArticle.published_at || featuredArticle.created_at)}</span>
                    <Link href={`/news-and-stories/${featuredArticle.slug}`} className="inline-flex items-center text-[#439B25] font-semibold text-sm hover:text-[#317a19] transition-colors">
                      Read Story <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        )}

        {/* 4. LATEST STORIES */}
        {showStories && (
          <Container>
            {activeTab !== 'News & Stories' && <h3 className="text-2xl font-heading font-bold text-udbhav-blue-deep mb-6">Latest Stories</h3>}
            {regularNewsAndStories.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {regularNewsAndStories.map((article) => (
                  <div key={article.id} className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="relative w-full sm:w-[240px] h-[160px] sm:h-auto shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={article.cover_image?.cdn_url || '/placeholder-image.jpg'}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 py-1">
                      <div className="mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#439B25]">
                          {article.category || 'Update'}
                        </span>
                      </div>
                      <h4 className="text-lg font-heading font-bold text-udbhav-blue-deep mb-2 line-clamp-2 hover:text-[#439B25] transition-colors">
                        <Link href={`/news-and-stories/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                        <Link href={`/news-and-stories/${article.slug}`} className="font-semibold text-[#439B25] hover:text-[#317a19] transition-colors">
                          Read Story <ArrowRight className="h-3.5 w-3.5 inline-block ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16">
                <p className="text-center text-gray-500 text-lg">No stories found.</p>
                <p className="text-center text-gray-400 mt-2">Try changing your search or filter.</p>
              </div>
            )}
          </Container>
        )}

        {/* 5. UPCOMING EVENTS */}
        {showUpcomingEvents && (
          <Container>
            <div className="flex items-end justify-between mb-6">
              <h3 className="text-2xl font-heading font-bold text-udbhav-blue-deep">Upcoming Events</h3>
            </div>
            
            {filteredUpcomingEvents.length > 0 ? (
              <div className="flex flex-col">
                {filteredUpcomingEvents.map((event) => {
                  const evtDate = new Date(event.event_date || event.published_at || event.created_at);
                  const day = evtDate.getDate().toString().padStart(2, '0');
                  const month = evtDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  
                  return (
                  <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-6 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                      <div className="flex flex-col items-center justify-center min-w-[50px] shrink-0">
                        <span className="font-heading text-2xl font-bold leading-none text-udbhav-blue-deep">
                          {day}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#439B25] mt-1">
                          {month}
                        </span>
                      </div>
                      <div className="relative w-24 h-16 sm:w-32 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={event.cover_image?.cdn_url || '/placeholder-image.jpg'}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 96px, 128px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="text-lg font-heading font-bold text-udbhav-blue-deep mb-1 truncate">
                        {event.title}
                      </h4>
                      <p className="text-gray-600 text-sm truncate mb-2">
                        {event.summary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.event_location || 'TBA'}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {event.event_start_time ? new Date(`1970-01-01T${event.event_start_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                          {event.event_end_time && ` – ${new Date(`1970-01-01T${event.event_end_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 sm:mt-0 shrink-0 w-full sm:w-auto">
                      <Link href={`/news-and-stories/${event.slug}`} className="text-sm font-semibold text-gray-600 hover:text-udbhav-blue-deep transition-colors">
                        Details &rarr;
                      </Link>
                      {event.registration_url && (
                        <Link href={event.registration_url} className="text-sm font-semibold text-[#439B25] hover:text-[#317a19] transition-colors ml-2" target="_blank">
                          Register
                        </Link>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-gray-500 text-lg">No upcoming events found.</p>
                <p className="text-gray-400 mt-2">Try changing your search or filter.</p>
              </div>
            )}
          </Container>
        )}

        {/* PAST EVENTS */}
        {showPastEvents && activeTab === 'Past Events' && (
          <Container>
            <h3 className="text-2xl font-heading font-bold text-udbhav-blue-deep mb-6">Past Events</h3>
            {filteredPastEvents.length > 0 ? (
              <div className="flex flex-col">
                {filteredPastEvents.map((event) => {
                  const evtDate = new Date(event.event_date || event.published_at || event.created_at);
                  const formattedDate = evtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                  return (
                  <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-4 border-b border-gray-100 last:border-0 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                      <div className="relative w-20 h-14 sm:w-28 sm:h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 grayscale-[0.3]">
                        <Image
                          src={event.cover_image?.cdn_url || '/placeholder-image.jpg'}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 80px, 112px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="text-base font-heading font-bold text-gray-700 mb-1 truncate">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formattedDate}</span>
                        {event.event_location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.event_location}</span>}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 shrink-0 w-full sm:w-auto">
                      <Link href={`/news-and-stories/${event.slug}`} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                        View Recap &rarr;
                      </Link>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-gray-500 text-lg">No past events found.</p>
                <p className="text-gray-400 mt-2">Try changing your search or filter.</p>
              </div>
            )}
          </Container>
        )}

        {/* 6. PODCAST SECTION */}
        {showPodcast && (
          <Container>
            <div className="bg-[#12245F] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#439B25]/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                <div className="lg:w-1/3">
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
                    UDBHAV Podcast
                  </h3>
                  <p className="text-white/80 text-sm mb-6">
                    Listen to conversations, ideas and stories from the UDBHAV community.
                  </p>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Official Channel <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                
                <div className="lg:w-2/3 w-full">
                  {filteredPodcasts.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {filteredPodcasts.slice(0, activeTab === 'Podcast' ? 10 : 3).map((ep) => (
                        <Link key={ep.id} href={`/news-and-stories/podcast/${ep.slug}`} className="group flex flex-col sm:flex-row bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl overflow-hidden transition-colors">
                          <div className="relative w-full sm:w-48 h-32 sm:h-auto shrink-0 bg-black/40">
                            <Image src={ep.thumbnailUrl} alt={ep.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-10 w-10 bg-[#439B25] rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                                <Play className="h-4 w-4 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col justify-center flex-1">
                            <span className="text-[#439B25] text-[10px] font-bold uppercase mb-1">{ep.episodeNumber} • {ep.releaseDate}</span>
                            <h4 className="text-white font-heading font-bold text-sm sm:text-base line-clamp-2 mb-1 group-hover:text-[#439B25] transition-colors">{ep.title}</h4>
                            <p className="text-white/60 text-xs line-clamp-1">Guest: {ep.guest.fullName} - {ep.guest.role}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/70 text-base">No podcast episodes found.</p>
                      <p className="text-white/50 text-sm mt-1">Try changing your search or filter.</p>
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
