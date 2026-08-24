import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, User } from 'lucide-react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';
import { getActiveGoverningBodyMembers } from '@/features/governing-body/repository';
import { systemSettingsRepository } from '@/features/system_settings/repository';

export const metadata: Metadata = {
  title: 'About Us — UDBHAV Foundation',
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

  return (
    <div className="bg-pure-white w-full overflow-hidden">
      {/* 1. ABOUT HERO */}
      <section
        aria-labelledby="about-hero-heading"
        className="border-soft-border/40 relative w-full overflow-hidden border-b py-12 sm:py-16 md:py-20"
        style={{
          background: 'linear-gradient(135deg, #171f69 0%, #202a7a 50%, #123f72 100%)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-white/[0.08] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-impact-green/[0.12] pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full blur-3xl"
        />

        <Container className="relative z-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            {/* Subtle Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
              <ol className="text-pure-white/80 inline-flex items-center gap-1.5 text-xs font-medium sm:text-sm">
                <li>
                  <Link
                    href="/"
                    className="hover:text-pure-white underline-offset-4 transition-colors hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-pure-white/50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li className="font-semibold text-[#86EFAC]" aria-current="page">
                  About Us
                </li>
              </ol>
            </nav>

            <span className="eyebrow-label mb-3 block font-heading text-xs font-bold uppercase tracking-widest text-[#86EFAC] sm:mb-4 sm:text-sm">
              ABOUT UDBHAV FOUNDATION
            </span>

            <h1
              id="about-hero-heading"
              className="text-pure-white mb-4 font-heading text-3xl font-bold leading-tight tracking-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-[54px]"
            >
              Growing Together for an Inclusive Future
            </h1>

            <p className="text-pure-white/90 mx-auto max-w-3xl text-base leading-relaxed sm:text-lg md:text-xl">
              A community-rooted foundation working through education, inclusion, environmental responsibility, mental well-being and collective action.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. WHO ARE WE? */}
      <section className="via-pure-white to-warm-white relative border-b border-gray-100 bg-gradient-to-b from-[#FDFCF8] py-16 sm:py-20 md:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <RevealCard as="div" index={0} className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
                <Image
                  src={whoWeAreImg}
                  alt={whoWeAreAlt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </RevealCard>

            <RevealCard as="div" index={1} className="order-1 lg:order-2 space-y-6">
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
      <section className="bg-pure-white py-16 sm:py-20 md:py-24 border-b border-gray-100">
        <Container>
          <div className="mb-12 md:mb-16">
            <span className="text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm text-center">
              WHAT WE DO?
            </span>
            <h2 className="text-udbhav-blue-deep font-heading text-3xl font-bold tracking-tight sm:text-4xl text-center">
              Turning Ideas Into Meaningful Action
            </h2>
          </div>

          <div className="mb-12 md:mb-16 relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-md hidden md:block">
            <Image
              src={whatWeDoImg}
              alt={whatWeDoAlt}
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

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
              <RevealCard as="div" index={idx} key={area.title}>
                <div className="border-soft-border/50 hover:border-impact-green/40 bg-pure-white group h-full rounded-xl border p-6 sm:p-8 transition-all hover:shadow-sm">
                  <div className="bg-impact-green mb-5 h-1 w-12 rounded-full transition-all group-hover:w-16"></div>
                  <h3 className="text-udbhav-blue-deep mb-3 font-heading text-lg font-bold">
                    {area.title}
                  </h3>
                  <p className="text-text-primary text-sm leading-relaxed sm:text-base">
                    {area.description}
                  </p>
                </div>
              </RevealCard>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. WHEN DID WE START? */}
      <section className="bg-udbhav-blue-deep/5 py-16 sm:py-20 md:py-24 border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <RevealCard as="div" index={0} className="space-y-6">
              <div>
                <span className="text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
                  WHEN DID WE START?
                </span>
                <h2 className="text-udbhav-blue-deep font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  Our Journey Began in 2020
                </h2>
              </div>

              <div className="mt-8 mb-6">
                <div className="bg-udbhav-blue-deep text-pure-white inline-flex flex-col items-start rounded-xl px-8 py-6 shadow-md">
                  <span className="font-heading text-5xl font-black md:text-6xl tracking-tight">2020</span>
                  <span className="text-impact-green mt-1 text-sm font-bold uppercase tracking-widest">Established</span>
                </div>
              </div>

              <div className="text-text-primary text-base leading-relaxed sm:text-lg">
                <p>
                  UDBHAV Foundation began with a simple but profound belief: meaningful change begins by nurturing minds, empowering through education and protecting the environment we all share.
                </p>
              </div>
            </RevealCard>

            <RevealCard as="div" index={1}>
              <div className="relative aspect-square w-full max-w-[500px] mx-auto overflow-hidden rounded-full shadow-lg ring-4 ring-white">
                <Image
                  src={whenWeStartedImg}
                  alt={whenWeStartedAlt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </RevealCard>
          </div>
        </Container>
      </section>

      {/* 5. WHY OUR WORK MATTERS? */}
      <section className="bg-pure-white py-16 sm:py-20 md:py-24 border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16 items-center">
            <RevealCard as="div" index={0} className="lg:col-span-7">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
                <Image
                  src={whyWorkMattersImg}
                  alt={whyWorkMattersAlt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </RevealCard>

            <RevealCard as="div" index={1} className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
                  WHY OUR WORK MATTERS?
                </span>
                <h2 className="text-udbhav-blue-deep font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  Because Real Change Begins With People
                </h2>
              </div>

              <div className="text-text-primary space-y-4 text-base leading-relaxed sm:text-lg">
                <p>
                  UDBHAV's work matters because education, mental well-being, sustainability and inclusion cannot be treated as separate goals. They are interconnected.
                </p>
                <p>
                  When people have knowledge, opportunity, dignity and a healthy environment, communities become more aware, resilient and responsible.
                </p>
              </div>

              <div className="mt-8 border-l-4 border-impact-green pl-6 py-2">
                <p className="text-udbhav-blue-deep text-lg font-bold sm:text-xl">
                  "We are not just working for change — we are building a movement of purpose, compassion and action."
                </p>
              </div>
            </RevealCard>
          </div>
        </Container>
      </section>

      {/* 6. FOUNDER MESSAGE */}
      <section className="bg-gray-50 py-16 sm:py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            <span className="text-impact-green mb-2 block text-center font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              FROM OUR FOUNDER
            </span>
            <h2 className="text-udbhav-blue-deep mb-10 text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              A Vision That Continues to Grow
            </h2>

            <RevealCard as="div" index={0} className="bg-pure-white overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="bg-udbhav-blue-deep/10 relative min-h-[350px] md:col-span-2">
                  {founderImage ? (
                    <Image
                      src={founderImage}
                      alt="Jaysuraj Pattanayak, Founder of Udbhav Foundation"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <User className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 md:col-span-3 md:p-10 lg:p-12">
                  <h3 className="text-udbhav-blue-deep font-heading text-2xl font-bold">
                    Jaysuraj Pattanayak
                  </h3>
                  <p className="text-impact-green mt-1 text-sm font-bold uppercase tracking-wider">
                    Founder, Udbhav Foundation
                  </p>

                  <div className="mt-8">
                    <p className="text-text-primary text-lg font-medium leading-relaxed md:text-xl italic">
                      "Real change begins when we nurture minds, empower through education, and protect the environment we all share."
                    </p>
                  </div>
                </div>
              </div>
            </RevealCard>
          </div>
        </Container>
      </section>

      {/* 10. CALL TO ACTION */}
      <section className="bg-pure-white py-16 sm:py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-udbhav-blue-deep font-heading text-3xl font-bold sm:text-4xl">
              Be Part of the Change
            </h2>
            <p className="text-text-primary mx-auto mt-6 text-base leading-relaxed sm:text-lg">
              Whether through volunteering, learning, supporting an initiative or simply taking action in your community, every meaningful contribution can become part of a larger movement.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/volunteers"
                className="bg-impact-green hover:bg-env-green inline-flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors sm:w-auto"
              >
                Join as a Volunteer
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/donate"
                className="text-udbhav-blue-deep hover:bg-udbhav-blue-deep hover:text-pure-white inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-udbhav-blue-deep px-8 py-3.5 text-sm font-semibold transition-colors sm:w-auto"
              >
                Support Our Mission
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}