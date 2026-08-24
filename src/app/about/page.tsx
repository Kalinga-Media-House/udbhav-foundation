import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, User } from 'lucide-react';

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
        className="py-20 sm:py-28 md:py-36"
        style={{
          background: 'linear-gradient(135deg, #171f69 0%, #202a7a 50%, #123f72 100%)',
        }}
      >
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">

            <RevealCard as="div" index={0} className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86EFAC] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#86EFAC]"></span>
                </span>
                <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm">
                  ABOUT UDBHAV FOUNDATION
                </span>
              </div>
            </RevealCard>

            <RevealCard as="div" index={1}>
              <h1 id="about-hero-heading" className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Discover UDBHAV Foundation
              </h1>
            </RevealCard>

            <RevealCard as="div" index={2}>
              <p className="mt-6 text-lg text-white/80 sm:text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
                Explore our story, work, journey and purpose.
              </p>
            </RevealCard>

            <AboutHeroButtons />
          </div>
        </Container>
      </HeroParallax>

      {/* 2. WHO ARE WE? */}
      <section id="who-we-are" className="via-pure-white to-warm-white relative overflow-hidden bg-gradient-to-b from-[#FDFCF8] py-20 sm:py-24 md:py-32">
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

            <RevealCard as="div" index={1} direction="right" className="order-1 lg:order-2 space-y-8">
              <div>
                <span className="text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
                  WHO ARE WE?
                </span>
                <h2 className="text-udbhav-blue-deep font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  A Foundation Built on Purpose, Compassion and Action
                </h2>
              </div>

              <div className="text-text-primary space-y-4 text-base leading-relaxed sm:text-lg">
                <p>
                  Udbhav Foundation was born from the belief that real change begins when we nurture minds, empower through education, and protect the environment we all share.
                </p>
                <p>
                  We see mental well-being, knowledge, and sustainability as interconnected pillars of a thriving society. By focusing on inclusivity, compassion, and collective action, we aim to bridge gaps and create lasting impact at the grassroots level.
                </p>
              </div>

              <div className="bg-udbhav-blue-deep/5 border-l-impact-green mt-8 border-l-4 p-6 rounded-r-xl">
                <p className="text-udbhav-blue-deep text-lg font-semibold italic md:text-xl">
                  "Building communities that are aware, resilient and responsible."
                </p>
              </div>
            </RevealCard>
          </div>
        </Container>
      </section>

      {/* 3. WHAT WE DO? */}
      <section id="what-we-do" className="bg-gray-50/50 py-20 sm:py-28 md:py-32 relative border-b border-gray-100">
        <Container>
          <RevealCard as="div" index={0} className="mb-16 md:mb-24 max-w-2xl mx-auto text-center">
            <span className="text-impact-green mb-3 block font-heading text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
              WHAT WE DO?
            </span>
            <h2 className="text-udbhav-blue-deep font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Turning Ideas Into Meaningful Action
            </h2>
          </RevealCard>

          <RevealCard as="div" index={1} direction="none" className="mb-16 md:mb-24 relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-lg hidden md:block">
            <Image
              src={whatWeDoImg}
              alt={whatWeDoAlt}
              fill
              className="object-cover object-center transition-transform duration-1000 hover:scale-105"
              sizes="100vw"
            />
          </RevealCard>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Education & Learning',
                description: 'Supporting learning, knowledge and opportunities that help individuals and communities grow.',
              },
              {
                title: 'Mental Well-being',
                description: 'Recognising mental well-being as an essential part of a healthy and thriving society.',
              },
              {
                title: 'Environmental Responsibility',
                description: 'Encouraging people and communities to protect the environment and act sustainably.',
              },
              {
                title: 'Inclusion & Empowerment',
                description: 'Promoting inclusivity, dignity, participation and equal opportunity.',
              },
              {
                title: 'Community Action',
                description: 'Bringing people together around meaningful initiatives and collective action.',
              },
              {
                title: 'Youth & Social Development',
                description: 'Creating opportunities for young people to participate, learn, contribute and create positive change.',
              },
            ].map((area, idx) => (
              <RevealCard as="div" index={idx + 2} key={area.title}>
                <div className="group h-full bg-pure-white rounded-2xl border border-soft-border/50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-impact-green/30">
                  <div className="bg-impact-green/20 mb-6 h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-impact-green group-hover:scale-110">
                    <div className="bg-impact-green h-2 w-2 rounded-full transition-all duration-300 group-hover:bg-white"></div>
                  </div>
                  <h3 className="text-udbhav-blue-deep mb-3 font-heading text-xl font-bold">
                    {area.title}
                  </h3>
                  <p className="text-text-primary/80 text-sm leading-relaxed sm:text-base">
                    {area.description}
                  </p>
                </div>
              </RevealCard>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. WHEN DID WE START? */}
      <section id="when-did-we-start" className="bg-pure-white py-20 sm:py-28 md:py-32 relative border-b border-gray-100 overflow-hidden">
        {/* Soft curvy background decoration */}
        <div className="bg-udbhav-blue-deep/5 pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full blur-[100px]" />

        <Container className="relative z-10">
          <RevealCard as="div" index={0} className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
            <span className="text-impact-green mb-3 block font-heading text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
              WHEN DID WE START?
            </span>
            <h2 className="text-udbhav-blue-deep font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Our Journey Began in 2020
            </h2>
          </RevealCard>

          <div className="mx-auto max-w-4xl relative">
            {/* Timeline vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2 rounded-full hidden sm:block"></div>

            {/* Timeline Milestone 1 */}
            <RevealCard as="div" index={1} direction="none" className="relative flex flex-col md:flex-row items-center justify-between w-full mb-16">
              {/* Timeline dot */}
              <div className="absolute left-8 md:left-1/2 w-5 h-5 bg-impact-green border-4 border-white rounded-full transform -translate-x-1/2 shadow z-10 hidden sm:block"></div>

              <div className="w-full md:w-5/12 pl-16 sm:pl-20 md:pl-0 md:pr-16 text-left md:text-right mb-6 md:mb-0">
                <div className="bg-udbhav-blue-deep text-pure-white inline-flex flex-col items-start md:items-end rounded-2xl px-8 py-6 shadow-xl transform transition-transform hover:-translate-y-2">
                  <span className="font-heading text-5xl font-black md:text-6xl tracking-tight">2020</span>
                  <span className="text-impact-green mt-2 text-sm font-bold uppercase tracking-widest">Established</span>
                </div>
              </div>

              <div className="w-full md:w-5/12 pl-16 sm:pl-20 md:pl-16 text-left">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-text-primary text-base leading-relaxed sm:text-lg">
                    UDBHAV Foundation began with a simple but profound belief: meaningful change begins by nurturing minds, empowering through education and protecting the environment we all share.
                  </p>
                </div>
              </div>
            </RevealCard>

            <RevealCard as="div" index={2} direction="up" className="mt-12 md:mt-24">
              <div className="relative aspect-[21/9] w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 group">
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
        </Container>
      </section>

      {/* 5. WHY OUR WORK MATTERS? */}
      <section id="why-our-work-matters" className="bg-gray-50/50 py-20 sm:py-28 md:py-32 relative border-b border-gray-100 overflow-hidden">
        {/* Abstract shape */}
        <div className="bg-impact-green/5 pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 -translate-x-1/2 rounded-full blur-[100px]" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">

            <div className="space-y-12">
              <RevealCard as="div" index={0} direction="left">
                <span className="text-impact-green mb-3 block font-heading text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
                  WHY OUR WORK MATTERS?
                </span>
                <h2 className="text-udbhav-blue-deep font-heading text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
                  Because Real Change Begins With People
                </h2>
              </RevealCard>

              <RevealCard as="div" index={1} direction="left" className="border-l-4 border-impact-green pl-8 py-2">
                <p className="text-udbhav-blue-deep text-xl font-medium sm:text-2xl leading-relaxed italic">
                  "We are not just working for change — we are building a movement of purpose, compassion and action."
                </p>
              </RevealCard>
            </div>

            <div className="space-y-8">
              <RevealCard as="div" index={2} direction="up">
                <div className="bg-pure-white p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <h3 className="text-udbhav-blue-deep mb-3 font-heading text-xl font-bold">Interconnected Goals</h3>
                  <p className="text-text-primary/80 text-base leading-relaxed sm:text-lg">
                    UDBHAV's work matters because education, mental well-being, sustainability and inclusion cannot be treated as separate goals. They are interconnected.
                  </p>
                </div>
              </RevealCard>

              <RevealCard as="div" index={3} direction="up">
                <div className="bg-pure-white p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <h3 className="text-udbhav-blue-deep mb-3 font-heading text-xl font-bold">Resilient Communities</h3>
                  <p className="text-text-primary/80 text-base leading-relaxed sm:text-lg">
                    When people have knowledge, opportunity, dignity and a healthy environment, communities become more aware, resilient and responsible.
                  </p>
                </div>
              </RevealCard>

              <RevealCard as="div" index={4} direction="up" className="mt-8">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg group">
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
      <section className="bg-gray-50/50 py-20 sm:py-28 md:py-32">
        <Container>
          <div className="mx-auto max-w-4xl">
            <span className="text-impact-green mb-2 block text-center font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              FROM OUR FOUNDER
            </span>
            <h2 className="text-udbhav-blue-deep mb-10 text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              A Vision That Continues to Grow
            </h2>

            <RevealCard as="div" index={0} direction="up" className="bg-pure-white overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group">
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="bg-udbhav-blue-deep/5 relative min-h-[400px] md:col-span-2 overflow-hidden">
                  {founderImage ? (
                    <Image
                      src={founderImage}
                      alt="Jaysuraj Pattanayak, Founder of Udbhav Foundation"
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <User className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 md:col-span-3 md:p-12 lg:p-16">
                  <h3 className="text-udbhav-blue-deep font-heading text-2xl font-bold md:text-3xl">
                    Jaysuraj Pattanayak
                  </h3>
                  <p className="text-impact-green mt-2 text-sm font-bold uppercase tracking-widest">
                    Founder, Udbhav Foundation
                  </p>

                  <div className="mt-8 relative">
                    <div className="absolute -top-6 -left-4 text-6xl text-udbhav-blue-deep/5 font-serif">"</div>
                    <p className="text-text-primary text-lg font-medium leading-relaxed md:text-xl italic relative z-10">
                      Real change begins when we nurture minds, empower through education, and protect the environment we all share.
                    </p>
                  </div>
                </div>
              </div>
            </RevealCard>
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