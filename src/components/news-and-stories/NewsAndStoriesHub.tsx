'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, Clock, MapPin, Play, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

import { Container } from '@/components/shared/Container';
import { ArticleWithMedia } from '@/features/news/repository';
import { UpcomingEventItem, PodcastEpisodeItem } from '@/types/news';

type TabType = 'All' | 'News & Stories' | 'Upcoming Events' | 'Past Events' | 'Podcast';
type SortType = 'newest' | 'oldest';

interface NewsAndStoriesHubProps {
  articles: ArticleWithMedia[];
  events: UpcomingEventItem[];
  podcasts: PodcastEpisodeItem[];
}

export function NewsAndStoriesHub({ articles, events, podcasts }: NewsAndStoriesHubProps) {
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
  const filteredArticles = useMemo(() => {
    let result = articles.filter((a) => {
      const query = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(query) ||
        (a.summary && a.summary.toLowerCase().includes(query)) ||
        (a.category && a.category.toLowerCase().includes(query))
      );
    });

    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
    } else {
      result.sort((a, b) => new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime());
    }
    return result;
  }, [articles, searchQuery, sortOrder]);

  const featuredArticle = filteredArticles.find(a => a.is_featured) || filteredArticles[0];
  const regularArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  const filteredUpcomingEvents = useMemo(() => {
    return events.filter((e) => {
      const query = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    }).filter(e => e.registrationStatus !== 'Completed' && e.registrationStatus !== 'Cancelled');
  }, [events, searchQuery]);

  const filteredPastEvents = useMemo(() => {
    return events.filter((e) => {
      const query = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }).filter(e => e.registrationStatus === 'Completed' || e.registrationStatus === 'Cancelled');
  }, [events, searchQuery]);

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
            <span className="eyebrow-label text-[#439B25] font-heading font-bold text-xs uppercase tracking-widest bg-[#EEF8E9] px-3 py-1 rounded-full border border-[#439B25]/25 inline-block mb-4">
              NEWS & STORIES
            </span>
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
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              {(['All', 'News & Stories', 'Upcoming Events', 'Past Events', 'Podcast'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 ${
                    activeTab === tab
                      ? 'bg-[#439B25] text-white shadow-sm'
                      : 'bg-warm-white text-text-secondary hover:bg-gray-100 hover:text-udbhav-blue-deep border border-gray-200/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search stories, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full sm:w-[280px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#439B25] focus:border-[#439B25] sm:text-sm"
                />
              </div>

              {showStories && (
                <div className="relative shrink-0">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortType)}
                    className="block w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#439B25] focus:border-[#439B25] appearance-none cursor-pointer"
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
            <div className="group rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-gray-100">
                  <Image
                    src={featuredArticle.cover_image?.cdn_url || '/placeholder-image.jpg'}
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 sm:p-10 flex flex-col justify-center">
                  <span className="text-[#439B25] text-xs font-bold uppercase tracking-wider mb-3">FEATURED STORY</span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-udbhav-blue-deep mb-4 group-hover:text-[#439B25] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-3">
                    {featuredArticle.summary}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">{formatDate(featuredArticle.published_at || featuredArticle.created_at)}</span>
                    <Link href={`/news-and-stories/${featuredArticle.slug}`} className="inline-flex items-center gap-1.5 text-[#439B25] font-semibold text-sm hover:text-[#317a19] transition-colors group/link">
                      Read Story <ArrowRight className="h-4 w-4 transform transition-transform group-hover/link:translate-x-1" />
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
            {regularArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article) => (
                  <Link key={article.id} href={`/news-and-stories/${article.slug}`} className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={article.cover_image?.cdn_url || '/placeholder-image.jpg'}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#439B25] bg-[#EEF8E9] px-2 py-1 rounded">
                          {article.category || 'Update'}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {formatDate(article.published_at || article.created_at)}
                        </span>
                      </div>
                      <h4 className="text-lg font-heading font-bold text-udbhav-blue-deep mb-2 line-clamp-2 group-hover:text-[#439B25] transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                        {article.summary}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#439B25] group-hover:text-[#317a19] transition-colors mt-auto">
                        Read More <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500">No stories found matching your criteria.</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcomingEvents.map((event) => (
                  <div key={event.id} className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute right-2 top-2 z-10 flex min-w-[44px] flex-col items-center justify-center rounded-lg border border-white/50 bg-white/95 px-1.5 py-1 shadow-sm backdrop-blur-md">
                        <span className="font-heading text-base font-bold leading-none text-[#12245F]">
                          {event.dayMonthBadge.day}
                        </span>
                        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-[#439B25]">
                          {event.dayMonthBadge.month}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-base font-heading font-bold text-udbhav-blue-deep mb-2 line-clamp-2">
                        {event.title}
                      </h4>
                      <p className="text-gray-600 text-xs line-clamp-2 mb-4">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 mt-auto mb-4 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{event.startTime} {event.endTime && `– ${event.endTime}`}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                        <Link href="/volunteers" className="flex-1 rounded-lg border border-gray-200 py-1.5 text-center text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                          Details
                        </Link>
                        {event.registrationStatus === 'Registration Open' && (
                          <Link href={event.registrationUrl || '/volunteers'} className="flex-1 rounded-lg bg-[#439B25] py-1.5 text-center text-xs font-semibold text-white hover:bg-[#317a19] transition-colors">
                            Register
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500">No upcoming events at the moment. Please check back soon.</p>
              </div>
            )}
          </Container>
        )}

        {/* PAST EVENTS */}
        {showPastEvents && activeTab === 'Past Events' && (
          <Container>
            <h3 className="text-2xl font-heading font-bold text-udbhav-blue-deep mb-6">Past Events</h3>
            {filteredPastEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPastEvents.map((event) => (
                  <div key={event.id} className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                    <div className="relative h-40 w-full overflow-hidden bg-gray-100 grayscale-[0.3]">
                      <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-base font-heading font-bold text-gray-700 mb-2 line-clamp-2">
                        {event.title}
                      </h4>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.eventDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500">No past events found.</p>
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
                      <p className="text-white/50 text-sm">No podcast episodes found.</p>
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
