import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, User } from 'lucide-react';
import { ScrollTimelineProgress } from '@/components/shared/ScrollTimelineProgress';

import { Container } from '@/components/shared/Container';
import { METADATA } from '@/constants/metadata';
import { RevealCard } from '@/components/shared/RevealCard';
import { getActiveGoverningBodyMembers } from '@/features/governing-body/repository';
import { systemSettingsRepository } from '@/features/system_settings/repository';
import { AboutHeroButtons, HeroParallax } from '@/components/about/AboutHeroButtons';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'A community-rooted foundation working through education, inclusion, environmental responsibility, mental well-being and collective action.',
};

export default async function AboutPage() {
  const members = await getActiveGoverningBodyMembers();
  const founder = members.find((m) => m.full_name.toLowerCase().includes('jaysuraj'));
  const founderImage = founder?.photo_url || null;

  const publicSettings = await systemSettingsRepository.getPublicSettings();

  function getSettingUrl(value: any, fallback: string) {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.url) return value.url;
    return fallback;
  }

  function getSettingAlt(value: any, fallback: string) {
    if (value && typeof value === 'object' && value.altText) return value.altText;
    return fallback;
  }

  const whoWeAreImg = getSettingUrl(publicSettings.about_who_we_are_image, '/hero/hero-02.png');
  const whoWeAreAlt = getSettingAlt(publicSettings.about_who_we_are_image, 'Community members interacting with volunteers');
  const whatWeDoImg = getSettingUrl(publicSettings.about_what_we_do_image, '/hero/hero-05.png');
  const whatWeDoAlt = getSettingAlt(publicSettings.about_what_we_do_image, 'UDBHAV Foundation focus area action');
  const whenWeStartedImg = getSettingUrl(publicSettings.about_when_we_started_image, '/hero/hero-08.png');
  const whenWeStartedAlt = getSettingAlt(publicSettings.about_when_we_started_image, 'UDBHAV early foundation community activity');
  const whyWorkMattersImg = getSettingUrl(publicSettings.about_why_work_matters_image, '/hero/hero-07.png');

  let aboutHeroBgImage = getSettingUrl(publicSettings.about_hero_background_image, '');
  if (aboutHeroBgImage.startsWith('"') && aboutHeroBgImage.endsWith('"')) {
    aboutHeroBgImage = aboutHeroBgImage.substring(1, aboutHeroBgImage.length - 1);
  }
  const whyWorkMattersAlt = getSettingAlt(publicSettings.about_why_work_matters_image, 'Volunteer and community connection');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: METADATA.BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About Us',
        item: `${METADATA.BASE_URL}/about`,
      },
    ],
  };

  return (
    <div className="bg-pure-white w-full overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. ABOUT HERO */}
      <HeroParallax
        className="py-16 sm:py-24 md:py-32 bg-[#171f69]"
        bgImage={aboutHeroBgImage || undefined}
      >
        <Container className="relative z-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">

            <RevealCard as="div" index={0}>
              <h1 id="about-hero-heading" className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Discover UDBHAV Foundation
              </h1>
            </RevealCard>

            <RevealCard as="div" index={1}>
              <p className="mt-6 text-lg text-white/80 sm:text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
                Explore our story, work, journey and purpose.
              </p>
            </RevealCard>

            <AboutHeroButtons />
          </div>
        </Container>
      </HeroParallax>

      {/* 2. WHO ARE WE? */}
      <section id="who-we-are" className="via-pure-white to-warm-white relative overflow-hidden bg-gradient-to-b from-[#FDFCF8] pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        {/* Subtle background decoration */}
        <div className="bg-impact-green/5 pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full blur-[80px]" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <RevealCard as="div" index={0} direction="left" className="order-2 lg:order-1">
              <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl">
                <Image
                  src={whoWeAreImg}
                  alt={whoWeAreAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </RevealCard>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <RevealCard as="span" index={0} className="text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
                  WHO ARE WE?
                </RevealCard>
                <RevealCard as="h2" index={1} className="text-udbhav-blue-deep font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  A Foundation Built on Purpose, Compassion and Action
                </RevealCard>
              </div>

              <div className="text-text-primary space-y-4 text-base leading-relaxed sm:text-lg">
                <RevealCard as="p" index={2}>
                  Udbhav Foundation was born from the belief that real change begins when we nurture minds, empower through education, and protect the environment we all share.
                </RevealCard>
                <RevealCard as="p" index={3}>
                  We see mental well-being, knowledge, and sustainability as interconnected pillars of a thriving society. By focusing on inclusivity, compassion, and collective action, we aim to bridge gaps and create lasting impact at the grassroots level.
                </RevealCard>
              </div>

              <RevealCard as="div" index={4} className="bg-udbhav-blue-deep/5 border-l-impact-green mt-8 border-l-4 p-6 rounded-r-xl transition-transform duration-500 hover:scale-[1.01]">
                <p className="text-udbhav-blue-deep text-lg font-semibold italic md:text-xl">
                  "Building communities that are aware, resilient and responsible."
                </p>
              </RevealCard>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. WHAT WE DO? */}
      <section id="what-we-do" className="bg-gradient-to-br from-[#18256F] to-[#243B82] pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-28 md:pb-32 relative overflow-hidden">
        {/* Subtle glow decoration */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3157A5]/30 rounded-full blur-[120px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="mb-16 md:mb-24 max-w-2xl mx-auto text-center">
            <RevealCard as="span" index={0} className="text-emerald-400 mb-3 block font-heading text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
              WHAT WE DO?
            </RevealCard>
            <RevealCard as="h2" index={1} className="text-white font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Turning Ideas Into Meaningful Action
            </RevealCard>
          </div>

          <RevealCard as="div" index={2} direction="up" className="mb-16 md:mb-24 relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-xl hidden md:block group motion-safe:animate-[whatWeDoImageScale_1s_ease-out_forwards]">
            <Image
              src={whatWeDoImg}
              alt={whatWeDoAlt}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="100vw"
            />
          </RevealCard>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {[
              {
                title: 'Education & Learning',
                description: 'Supporting learning, knowledge and opportunities that help individuals and communities grow.',
                progress: 88,
                hoverBg: 'group-hover:bg-emerald-600/90',
                hoverBorder: 'group-hover:border-emerald-400/50',
                hoverGlow: 'hover:shadow-[0_0_25px_rgba(52,211,153,0.3)]',
                progressBar: 'bg-emerald-400',
                progressTrack: 'bg-emerald-400/20',
              },
              {
                title: 'Mental Well-being',
                description: 'Recognising mental well-being as an essential part of a healthy and thriving society.',
                progress: 78,
                hoverBg: 'group-hover:bg-cyan-600/90',
                hoverBorder: 'group-hover:border-cyan-400/50',
                hoverGlow: 'hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]',
                progressBar: 'bg-cyan-400',
                progressTrack: 'bg-cyan-400/20',
              },
              {
                title: 'Environmental Responsibility',
                description: 'Encouraging people and communities to protect the environment and act sustainably.',
                progress: 92,
                hoverBg: 'group-hover:bg-amber-600/90',
                hoverBorder: 'group-hover:border-amber-400/50',
                hoverGlow: 'hover:shadow-[0_0_25px_rgba(251,191,36,0.3)]',
                progressBar: 'bg-amber-400',
                progressTrack: 'bg-amber-400/20',
              },
              {
                title: 'Inclusion & Empowerment',
                description: 'Promoting inclusivity, dignity, participation and equal opportunity.',
                progress: 84,
                hoverBg: 'group-hover:bg-violet-600/90',
                hoverBorder: 'group-hover:border-violet-400/50',
                hoverGlow: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]',
                progressBar: 'bg-violet-400',
                progressTrack: 'bg-violet-400/20',
              },
              {
                title: 'Community Action',
                description: 'Bringing people together around meaningful initiatives and collective action.',
                progress: 75,
                hoverBg: 'group-hover:bg-pink-600/90',
                hoverBorder: 'group-hover:border-pink-400/50',
                hoverGlow: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.3)]',
                progressBar: 'bg-pink-400',
                progressTrack: 'bg-pink-400/20',
              },
              {
                title: 'Youth & Social Development',
                description: 'Creating opportunities for young people to participate, learn, contribute and create positive change.',
                progress: 86,
                hoverBg: 'group-hover:bg-orange-600/90',
                hoverBorder: 'group-hover:border-orange-400/50',
                hoverGlow: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.3)]',
                progressBar: 'bg-orange-400',
                progressTrack: 'bg-orange-400/20',
              },
            ].map((area, idx) => (
              <RevealCard as="div" index={idx + 3} key={area.title}>
                <div className={`group relative flex flex-col justify-between h-[135px] sm:h-[150px] lg:h-[165px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 lg:p-6 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.015] ${area.hoverBg} ${area.hoverBorder} ${area.hoverGlow}`}>

                  <div>
                    <h3 className="text-white mb-1.5 font-heading text-base sm:text-lg lg:text-xl font-bold tracking-tight">
                      {area.title}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-2 transition-colors duration-700 group-hover:text-white/90">
                      {area.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-1.5">
                    <div className={`h-1.5 w-full rounded-full overflow-hidden transition-colors duration-700 ${area.progressTrack} group-hover:bg-black/20`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${area.progressBar} group-hover:!w-full group-hover:bg-white`}
                        style={{ width: `${area.progress}%` }}
                      />
                    </div>
                  </div>

                </div>
              </RevealCard>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. WHEN DID WE START? */}
      <section id="when-did-we-start" className="bg-pure-white pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
        {/* Soft curvy background decoration */}
        <div className="bg-udbhav-blue-deep/5 pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full blur-[100px]" />

        <Container className="relative z-10">
          <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
            <RevealCard as="span" index={0} direction="up" className="text-impact-green mb-3 block font-heading text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
              WHEN DID WE START?
            </RevealCard>
            <RevealCard as="h2" index={1} direction="up" className="text-udbhav-blue-deep font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Our Journey Began in 2020
            </RevealCard>
          </div>

          <div className="mx-auto max-w-4xl relative flex flex-col md:block">
            {/* Timeline vertical line */}
            <ScrollTimelineProgress className="left-[32px] md:left-1/2 top-0 bottom-[-100px] md:-translate-x-1/2" />

            {/* Timeline Milestone 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between w-full mb-12 md:mb-16 z-10 pl-[64px] md:pl-0">
              {/* Timeline node */}
              <div data-timeline-node="inactive" className="absolute left-[32px] md:left-1/2 w-4 h-4 bg-white border-2 border-white rounded-full transform -translate-x-1/2 shadow-[0_0_12px_rgba(52,211,153,0.4)] transition-all duration-500 z-20 data-[timeline-node=active]:border-impact-green data-[timeline-node=active]:shadow-[0_0_20px_rgba(52,211,153,0.9)] data-[timeline-node=active]:scale-125" />

              <div className="w-full md:w-5/12 md:pr-16 text-left md:text-right mb-6 md:mb-0">
                <RevealCard as="div" index={2} direction="left">
                  <div className="bg-gradient-to-br from-[#18256F] to-[#243B82] text-pure-white inline-flex flex-col items-start md:items-end rounded-2xl px-8 py-6 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(24,37,111,0.3)] group">
                    <span className="font-heading text-5xl font-black md:text-6xl tracking-tight transition-colors duration-500 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">2020</span>
                    <span className="text-emerald-400 mt-2 text-sm font-bold uppercase tracking-widest">Established</span>
                  </div>
                </RevealCard>
              </div>

              <div className="w-full md:w-5/12 md:pl-16 text-left hidden md:block" />
            </div>

            {/* Timeline Milestone 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between w-full mb-16 md:mb-24 z-10 pl-[64px] md:pl-0">
              {/* Timeline node */}
              <div data-timeline-node="inactive" className="absolute left-[32px] md:left-1/2 w-4 h-4 bg-white border-2 border-white rounded-full transform -translate-x-1/2 shadow-[0_0_12px_rgba(52,211,153,0.4)] transition-all duration-500 z-20 data-[timeline-node=active]:border-cyan-400 data-[timeline-node=active]:shadow-[0_0_20px_rgba(34,211,238,0.9)] data-[timeline-node=active]:scale-125" />

              <div className="w-full md:w-5/12 md:pr-16 mb-6 md:mb-0 hidden md:block" />

              <div className="w-full md:w-5/12 md:pl-16 text-left">
                <RevealCard as="div" index={3} direction="right">
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-impact-green transition-all duration-500 group-hover:w-1.5" />
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 block">The Beginning</span>
                    <p className="text-text-primary text-base leading-relaxed sm:text-lg">
                      UDBHAV Foundation began with a simple but profound belief: meaningful change begins by nurturing minds, empowering through education and protecting the environment we all share.
                    </p>
                  </div>
                </RevealCard>
              </div>
            </div>

            {/* Timeline Milestone 3 */}
            <div className="relative z-10 pt-8 md:pt-12 pl-[48px] pr-4 md:px-0">
              {/* Timeline node */}
              <div data-timeline-node="inactive" className="absolute left-[32px] md:left-1/2 top-0 w-4 h-4 bg-white border-2 border-white rounded-full transform -translate-x-1/2 shadow-[0_0_12px_rgba(52,211,153,0.4)] transition-all duration-500 z-20 data-[timeline-node=active]:border-impact-green data-[timeline-node=active]:shadow-[0_0_20px_rgba(52,211,153,0.9)] data-[timeline-node=active]:scale-125" />

              <RevealCard as="div" index={4} direction="up" className="w-full">
                <div className="relative aspect-[21/9] w-full mx-auto overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 group">
                  <Image
                    src={whenWeStartedImg}
                    alt={whenWeStartedAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 80vw"
                  />
                </div>
              </RevealCard>
            </div>

          </div>
        </Container>
      </section>

      {/* 5. WHY OUR WORK MATTERS? */}
      <section id="why-our-work-matters" className="bg-pure-white pt-12 md:pt-16 pb-20 sm:pb-28 md:pb-32 relative overflow-hidden">
        {/* Abstract shape */}
        <div className="bg-impact-green/5 pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 -translate-x-1/2 rounded-full blur-[100px]" />

        <Container className="relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

            {/* LEFT SIDE */}
            <div className="lg:w-5/12 space-y-12 lg:sticky lg:top-32">
              <div>
                <RevealCard as="span" index={0} direction="up" className="text-impact-green mb-3 block font-heading text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
                  WHY OUR WORK MATTERS?
                </RevealCard>
                <RevealCard as="h2" index={1} direction="up" className="text-udbhav-blue-deep font-heading text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
                  Because Real Change Begins With People
                </RevealCard>
              </div>

              <RevealCard as="div" index={2} direction="up" className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-impact-green transition-all duration-700 h-0 group-[.opacity-100]:h-full" />
                <p className="text-udbhav-blue-deep text-xl font-medium sm:text-2xl leading-relaxed italic pl-8 py-2">
                  "We are not just working for change — we are building a movement of purpose, compassion and action."
                </p>
              </RevealCard>
            </div>

            {/* RIGHT SIDE */}
            <div className="lg:w-7/12 relative">
              {/* Dotted connecting line */}
              <ScrollTimelineProgress
                className="left-[24px] md:left-[32px] top-0 bottom-0"
                lineClassName="bg-gradient-to-b from-cyan-400 to-impact-green shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                nodeClassName="bg-impact-green shadow-[0_0_15px_3px_rgba(52,211,153,0.8)]"
              />

              <div className="space-y-12 md:space-y-16 relative z-10 pl-[56px] md:pl-[72px]">

                {/* Node 1 */}
                <div className="relative">
                  <div data-timeline-node="inactive" className="absolute -left-[32px] md:-left-[40px] top-8 w-4 h-4 bg-white border-2 border-white rounded-full transform -translate-x-1/2 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-500 z-20 data-[timeline-node=active]:border-cyan-400 data-[timeline-node=active]:shadow-[0_0_20px_rgba(34,211,238,0.9)] data-[timeline-node=active]:scale-125" />
                  <RevealCard as="div" index={3} direction="right">
                    <div className="bg-pure-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <h3 className="text-udbhav-blue-deep mb-3 font-heading text-xl font-bold">Interconnected Goals</h3>
                      <p className="text-text-primary/80 text-base leading-relaxed sm:text-lg">
                        UDBHAV's work matters because education, mental well-being, sustainability and inclusion cannot be treated as separate goals. They are interconnected.
                      </p>
                    </div>
                  </RevealCard>
                </div>

                {/* Node 2 */}
                <div className="relative">
                  <div data-timeline-node="inactive" className="absolute -left-[32px] md:-left-[40px] top-8 w-4 h-4 bg-white border-2 border-white rounded-full transform -translate-x-1/2 shadow-[0_0_12px_rgba(52,211,153,0.4)] transition-all duration-500 z-20 data-[timeline-node=active]:border-emerald-400 data-[timeline-node=active]:shadow-[0_0_20px_rgba(52,211,153,0.9)] data-[timeline-node=active]:scale-125" />
                  <RevealCard as="div" index={4} direction="right">
                    <div className="bg-pure-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)] relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <h3 className="text-udbhav-blue-deep mb-3 font-heading text-xl font-bold">Resilient Communities</h3>
                      <p className="text-text-primary/80 text-base leading-relaxed sm:text-lg">
                        When people have knowledge, opportunity, dignity and a healthy environment, communities become more aware, resilient and responsible.
                      </p>
                    </div>
                  </RevealCard>
                </div>

                {/* Node 3 (Image) */}
                <div className="relative mt-8 md:mt-12">
                  <div data-timeline-node="inactive" className="absolute -left-[32px] md:-left-[40px] top-1/2 w-5 h-5 bg-white border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(52,211,153,0.4)] transition-all duration-500 z-20 data-[timeline-node=active]:border-impact-green data-[timeline-node=active]:shadow-[0_0_20px_rgba(52,211,153,0.9)] data-[timeline-node=active]:scale-125" />
                  <RevealCard as="div" index={5} direction="up">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 group hover:shadow-[0_0_25px_rgba(52,211,153,0.3)] transition-all duration-500">
                      <Image
                        src={whyWorkMattersImg}
                        alt={whyWorkMattersAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </RevealCard>
                </div>

              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 6. VISION & MISSION */}
      <section className="bg-pure-white py-20 sm:py-28 md:py-32 relative border-b border-gray-100 overflow-hidden">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <RevealCard as="div" index={0} direction="left" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-udbhav-blue-deep to-udbhav-blue-deep/90 p-10 sm:p-12 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-impact-green/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="bg-impact-green/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-impact-green/30">
                  <div className="w-8 h-1 bg-impact-green rounded-full" />
                </div>
                <h3 className="text-pure-white mb-6 font-heading text-3xl font-bold tracking-tight">
                  OUR VISION
                </h3>
                <p className="text-pure-white/90 text-lg sm:text-xl leading-relaxed font-light">
                  We see mental well-being, knowledge, and sustainability as interconnected pillars of a thriving society. Building communities that are aware, resilient and responsible.
                </p>
              </div>
            </RevealCard>

            <RevealCard as="div" index={1} direction="right" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-impact-green to-[#3b7d19] p-10 sm:p-12 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/30">
                  <div className="w-8 h-1 bg-white rounded-full" />
                </div>
                <h3 className="text-pure-white mb-6 font-heading text-3xl font-bold tracking-tight">
                  OUR MISSION
                </h3>
                <p className="text-pure-white/90 text-lg sm:text-xl leading-relaxed font-light">
                  By focusing on inclusivity, compassion, and collective action, we aim to bridge gaps and create lasting impact at the grassroots level.
                </p>
              </div>
            </RevealCard>
          </div>
        </Container>
      </section>

      {/* 7. FOUNDER MESSAGE */}
      <section className="bg-gray-50/50 py-20 sm:py-28 md:py-32 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-r from-impact-green/5 to-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="mx-auto max-w-5xl">
            <RevealCard as="h2" index={0} className="text-udbhav-blue-deep mb-16 md:mb-24 text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              A Vision That Continues to Grow
            </RevealCard>

            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12 lg:gap-16">

              {/* MOBILE HEADER (Visible only on mobile, above image) */}
              <div className="w-full md:hidden text-center mb-2">
                <RevealCard as="span" index={1} className="text-impact-green font-heading text-xs font-bold uppercase tracking-[0.2em]">
                  FROM OUR FOUNDER
                </RevealCard>
              </div>

              {/* LEFT — FOUNDER IMAGE */}
              <div className="w-full md:w-[45%] lg:w-[42%] relative flex-shrink-0">
                <div className="relative w-full h-[280px] sm:h-[320px] md:h-full md:min-h-[450px] lg:min-h-[500px] group">
                  <RevealCard as="div" index={2} direction="up" className="absolute inset-0 w-full h-full">
                    {/* Glow behind image */}
                    <div className="absolute inset-0 bg-impact-green/20 rounded-[2rem] blur-2xl transform transition-all duration-700 opacity-60 md:group-hover:scale-105" />

                    {/* Image Container */}
                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-lg border border-white/50 bg-[#F4F1EA] z-10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:-translate-y-2 md:group-hover:shadow-2xl">
                      {founderImage ? (
                        <Image
                          src={founderImage}
                          alt="Jaysuraj Pattanayak, Founder of Udbhav Foundation"
                          fill
                          className="object-cover object-[center_15%] md:object-[center_20%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <User className="h-24 w-24 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </RevealCard>
                </div>
              </div>

              {/* RIGHT — FOUNDER INFORMATION */}
              <div className="w-full md:w-[55%] lg:w-[58%] flex flex-col justify-center py-2 md:py-8 text-center md:text-left">
                {/* DESKTOP HEADER */}
                <div className="hidden md:block mb-4">
                  <RevealCard as="span" index={3} direction="up" className="text-impact-green font-heading text-xs font-bold uppercase tracking-[0.2em]">
                    FROM OUR FOUNDER
                  </RevealCard>
                </div>

                <div className="mb-2">
                  <RevealCard as="h3" index={4} direction="up" className="text-udbhav-blue-deep font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                    Jaysuraj Pattanayak
                  </RevealCard>
                </div>

                <div className="mb-10 md:mb-12">
                  <RevealCard as="p" index={5} direction="up" className="text-impact-green text-sm sm:text-base font-bold uppercase tracking-widest">
                    Founder, Udbhav Foundation
                  </RevealCard>
                </div>

                <RevealCard as="div" index={6} direction="up" className="relative inline-block text-left md:pl-8 mx-auto md:mx-0 max-w-lg md:max-w-none">
                  {/* Decorative connector line (Desktop only) */}
                  <div className="hidden md:block absolute left-0 top-1 bottom-1 w-[3px] bg-gradient-to-b from-impact-green to-cyan-400 rounded-full opacity-80" />
                  {/* Glowing point (Desktop only) */}
                  <div className="hidden md:block absolute left-[-2.5px] top-1 w-2 h-2 bg-white border border-impact-green rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                  {/* Decorative connector line (Mobile) - Centered short line above quote */}
                  <div className="md:hidden w-12 h-1 bg-gradient-to-r from-impact-green to-cyan-400 rounded-full opacity-80 mx-auto mb-6" />

                  <p className="text-udbhav-blue-deep/80 text-xl sm:text-2xl font-light leading-relaxed italic font-serif">
                    <span className="text-3xl text-impact-green/40 mr-1 font-serif leading-none">"</span>
                    Real change begins when we nurture minds, empower through education, and protect the environment we all share.
                    <span className="text-3xl text-impact-green/40 ml-1 font-serif leading-none">"</span>
                  </p>
                </RevealCard>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="bg-pure-white py-20 sm:py-28 md:py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <RevealCard as="div" index={0} direction="up">
              <h2 className="text-udbhav-blue-deep font-heading text-3xl font-bold sm:text-4xl md:text-5xl tracking-tight">
                Be Part of the Change
              </h2>
            </RevealCard>
            <RevealCard as="div" index={1} direction="up">
              <p className="text-text-primary/80 mx-auto mt-6 text-base leading-relaxed sm:text-lg md:text-xl">
                Whether through volunteering, learning, supporting an initiative or simply taking action in your community, every meaningful contribution can become part of a larger movement.
              </p>
            </RevealCard>
            <RevealCard as="div" index={2} direction="up" className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/volunteers"
                className="bg-impact-green hover:bg-env-green group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm md:text-base font-semibold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg sm:w-auto"
              >
                Join as a Volunteer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/donate"
                className="text-udbhav-blue-deep hover:bg-udbhav-blue-deep hover:text-pure-white inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-udbhav-blue-deep px-8 py-4 text-sm md:text-base font-semibold transition-all hover:-translate-y-1 hover:shadow-md sm:w-auto"
              >
                Support Our Mission
              </Link>
            </RevealCard>
          </div>
        </Container>
      </section>
    </div>
  );
}