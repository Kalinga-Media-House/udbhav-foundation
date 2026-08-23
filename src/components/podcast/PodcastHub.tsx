'use client';

import { format } from 'date-fns';
import { motion, Variants } from 'framer-motion';
import { Search, ChevronDown, Play, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';

import { Container } from '@/components/shared/Container';

interface PodcastWithMedia {
  id: string;
  title: string;
  slug: string;
  episode_number: string | null;
  description: string | null;
  excerpt: string | null;
  release_date: string | null;
  youtube_url: string | null;
  audio_url: string | null;
  duration: string | null;
  thumbnail: {
    id: string;
    cdn_url: string | null;
    alt_text: string | null;
  } | null;
}

interface PodcastHubProps {
  initialPodcasts: PodcastWithMedia[];
  youtubeUrl?: string | null;
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export function PodcastHub({ initialPodcasts, youtubeUrl }: PodcastHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredPodcasts = useMemo(() => {
    return initialPodcasts
      .filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.episode_number && p.episode_number.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const timeA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const timeB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [initialPodcasts, searchQuery, sortOrder]);

  const featuredPodcast = filteredPodcasts.length > 0 ? filteredPodcasts[0] : null;
  const otherPodcasts = filteredPodcasts.length > 1 ? filteredPodcasts.slice(1) : [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const getWatchUrl = (p: PodcastWithMedia) => {
    return `/podcast/${p.slug}`;
  };

  return (
    <div className="bg-[#F8FAF7] w-full pb-24 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#20256F] pt-20 pb-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-1/4 w-96 h-96 bg-[#4FAF32] rounded-full mix-blend-screen filter blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              x: [0, -50, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#181C5A] rounded-full mix-blend-screen filter blur-[100px]"
          />
          {/* Audio Wave Pattern (subtle) */}
          <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-10 opacity-30">
             {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', '80%', '40%', '100%', '20%'] }}
                  transition={{ 
                    duration: 1.5 + (i % 5) * 0.2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    repeatType: "mirror",
                    delay: i * 0.05
                  }}
                  className="w-1 md:w-2 bg-white/20 rounded-t-full mx-0.5"
                  style={{ height: '20%' }}
                />
             ))}
          </div>
        </div>

        <Container className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-[#4FAF32] text-sm font-bold uppercase tracking-widest block mb-4">UDBHAV PODCAST</span>
            <p className="text-xl md:text-2xl text-white font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              Listen to conversations, experiences and inspiring stories from the UDBHAV community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {featuredPodcast && (
                <button 
                  onClick={() => {
                    document.getElementById('latest-episode')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#20256F] hover:bg-[#F8FAF7] hover:scale-105 rounded-full text-base font-semibold transition-all shadow-lg"
                >
                  Latest Episode
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
              
              {youtubeUrl && (
                <a 
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-red-600 text-white hover:bg-red-700 hover:scale-105 rounded-full text-base font-semibold transition-all shadow-lg"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Visit Our YouTube Channel
                </a>
              )}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 2. LATEST EPISODE */}
      {featuredPodcast && (
        <section id="latest-episode" className="relative -mt-12 z-20 pb-16">
          <Container>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-12"
            >
              {/* Thumbnail */}
              <div className="w-full md:w-1/2 lg:w-3/5 shrink-0 relative aspect-video bg-[#181C5A] rounded-2xl overflow-hidden group border border-gray-100">
                {featuredPodcast.thumbnail?.cdn_url ? (
                  <Image
                    src={featuredPodcast.thumbnail.cdn_url}
                    alt={featuredPodcast.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#181C5A]">
                    <Play className="h-16 w-16 text-white opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                
                {/* Play Button Overlay */}
                <Link href={getWatchUrl(featuredPodcast)} className="absolute inset-0 flex items-center justify-center group/play">
                  <div className="w-20 h-20 bg-[#4FAF32] rounded-full flex items-center justify-center shadow-lg shadow-[#4FAF32]/30 transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                     <Play className="h-8 w-8 text-white fill-current ml-2" />
                  </div>
                </Link>
                
                {/* Duration Badge */}
                {featuredPodcast.duration && (
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-white text-xs font-semibold">
                    <Clock className="h-3 w-3" />
                    {featuredPodcast.duration}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white bg-[#4FAF32] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    LATEST EPISODE
                  </span>
                  {featuredPodcast.episode_number && (
                    <span className="text-[#667085] text-xs font-semibold tracking-wider border border-gray-200 px-3 py-1 rounded-full">
                      EP {featuredPodcast.episode_number}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl lg:text-4xl font-heading font-bold text-[#182033] mb-4 hover:text-[#4FAF32] transition-colors">
                  <Link href={getWatchUrl(featuredPodcast)}>{featuredPodcast.title}</Link>
                </h2>
                <div className="text-[#667085] text-sm font-medium mb-5">
                  {formatDate(featuredPodcast.release_date)}
                </div>
                <p className="text-gray-600 text-base mb-8 line-clamp-3 leading-relaxed">
                  {featuredPodcast.description || featuredPodcast.excerpt}
                </p>
                
                <div className="mt-auto">
                  <Link 
                    href={getWatchUrl(featuredPodcast)}
                    className="group/listen inline-flex items-center justify-center px-8 py-3.5 bg-[#20256F] hover:bg-[#181C5A] text-white rounded-full text-sm font-bold transition-all shadow-md"
                  >
                    Watch Episode
                    <Play className="h-4 w-4 ml-2 fill-current transform group-hover/listen:scale-110 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* 3. CONTROLS (SEARCH & SORT) */}
      <section className="py-8 border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-2xl font-heading font-bold text-[#20256F] mr-auto">All Episodes</h3>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Search */}
              <div className="relative group flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#4FAF32] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search podcasts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full sm:w-[320px] pl-11 pr-4 py-2.5 rounded-full border border-gray-200 text-sm bg-[#F8FAF7] placeholder-gray-400 focus:outline-none focus:border-[#4FAF32] focus:ring-2 focus:ring-[#EAF6E4] shadow-inner transition-all duration-300"
                />
              </div>

              {/* Sort */}
              <div className="relative shrink-0 group">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="block w-full pl-5 pr-12 py-2.5 text-sm font-medium border border-gray-200 rounded-full bg-white text-[#182033] focus:outline-none focus:border-[#4FAF32] focus:ring-2 focus:ring-[#EAF6E4] shadow-sm appearance-none cursor-pointer transition-all duration-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400 group-focus-within:text-[#4FAF32] transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. ALL PODCASTS GRID */}
      <section className="pt-12">
        <Container>
          {otherPodcasts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {otherPodcasts.map((podcast) => (
                <motion.div 
                  key={podcast.id} 
                  variants={fadeUpVariant}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-[#181C5A] overflow-hidden">
                    {podcast.thumbnail?.cdn_url ? (
                      <Image
                        src={podcast.thumbnail.cdn_url}
                        alt={podcast.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#181C5A]">
                        <Play className="h-10 w-10 text-white opacity-20" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Floating Play Button */}
                    <Link href={getWatchUrl(podcast)} className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#4FAF32] rounded-full flex items-center justify-center shadow-lg transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                        <Play className="h-6 w-6 text-white fill-current ml-1.5" />
                      </div>
                    </Link>
                    
                    {/* Duration Badge */}
                    {podcast.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1.5 text-white text-[10px] font-bold tracking-wider">
                        <Clock className="h-3 w-3" />
                        {podcast.duration}
                      </div>
                    )}
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {podcast.episode_number && (
                        <span className="text-[#20256F] bg-[#EEF2FF] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                          EP {podcast.episode_number}
                        </span>
                      )}
                      <span className="text-[#667085] text-xs font-semibold">
                        {formatDate(podcast.release_date)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-heading font-bold text-[#182033] mb-3 group-hover:text-[#4FAF32] transition-colors line-clamp-2">
                      <Link href={getWatchUrl(podcast)} className="before:absolute before:inset-0">
                        {podcast.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                      {podcast.description || podcast.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center text-[#20256F] font-bold text-sm group-hover:text-[#4FAF32] transition-colors relative">
                      Watch Episode
                      <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center max-w-lg mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="h-8 w-8 text-gray-300 ml-1" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-[#20256F] mb-3">
                No podcast episodes yet.
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">
                New conversations and inspiring stories from the UDBHAV community are coming soon. Stay tuned!
              </p>
            </motion.div>
          )}
        </Container>
      </section>
    </div>
  );
}
