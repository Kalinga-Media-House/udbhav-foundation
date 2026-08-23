import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Heart, User } from 'lucide-react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';
import { getActiveGoverningBodyMembers } from '@/features/governing-body/repository';

export const metadata: Metadata = {
  title: 'About Us — UDBHAV Foundation',
  description:
    'A community-driven foundation working to nurture minds, empower through education, protect the environment, promote inclusion, and build stronger communities.',
};

export default async function AboutPage() {
  const members = await getActiveGoverningBodyMembers();
  const founder = members.find((m) => m.full_name.toLowerCase().includes('jaysuraj'));
  const founderImage = founder?.photo_url || null;

  return (
    <div className="bg-pure-white w-full overflow-hidden">
      {/* 2. ABOUT PAGE HERO */}
      <section className="bg-udbhav-blue-deep relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-udbhav-blue-deep/90"></div>
        <Container className="relative z-10 text-center">
          <span className="text-impact-green mb-4 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
            ABOUT UDBHAV FOUNDATION
          </span>
          <h1 className="text-pure-white mx-auto max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Growing Together for an Inclusive Future
          </h1>
          <p className="text-pure-white/90 mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            A community-driven foundation working to nurture minds, empower through education, protect the environment, promote inclusion, and build stronger communities.
          </p>
        </Container>
      </section>

      {/* 3. WHO ARE WE? */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <RevealCard as="div" index={0} className="space-y-5">
              <span className="text-impact-green block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
                WHO ARE WE?
              </span>
              <h2 className="text-udbhav-blue-deep font-heading text-2xl font-bold sm:text-3xl md:text-4xl">
                Building Communities with Purpose
              </h2>
              <div className="text-text-primary space-y-4 text-base leading-relaxed sm:text-lg">
                <p>
                  UDBHAV Foundation was born from the belief that real change begins when we nurture minds, empower through education, protect the environment, strengthen mental well-being, promote inclusion, and encourage responsible and resilient communities.
                </p>
                <p>
                  We are a grassroots community of individuals dedicated to making a meaningful difference. Rather than focusing on isolated activities, we address the interconnected pillars of a thriving society to create lasting impact.
                </p>
              </div>
            </RevealCard>

            <RevealCard as="div" index={1} className="lg:pl-8">
              <div className="bg-udbhav-blue-deep/5 border-udbhav-blue-deep/10 rounded-2xl border p-8 md:p-10">
                <p className="text-udbhav-blue-deep text-xl font-medium leading-relaxed md:text-2xl">
                  "Real change begins when we nurture minds, empower through education, and protect the environment we all share."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="bg-impact-green h-1 w-12 rounded-full"></div>
                  <span className="text-udbhav-blue-deep/70 text-sm font-semibold uppercase tracking-wider">
                    Our Philosophy
                  </span>
                </div>
              </div>
            </RevealCard>
          </div>
        </Container>
      </section>

      {/* 4. WHAT DO WE DO? */}
      <section className="bg-gray-50 py-16 md:py-24">
        <Container>
          <div className="mb-12 text-center">
            <span className="text-impact-green mb-4 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              WHAT WE DO
            </span>
            <h2 className="text-udbhav-blue-deep font-heading text-2xl font-bold sm:text-3xl md:text-4xl">
              Turning Purpose into Action
            </h2>
            <p className="text-text-primary mx-auto mt-4 max-w-2xl text-base sm:text-lg">
              We focus on interconnected areas to drive holistic community development.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Education & Learning',
                description: 'Supporting access to education, mentoring, knowledge and opportunities for young people.',
              },
              {
                title: 'Mental Well-being',
                description: 'Promoting awareness, understanding and community conversations around mental well-being.',
              },
              {
                title: 'Environmental Responsibility',
                description: 'Encouraging environmental protection, sustainability and responsible action.',
              },
              {
                title: 'Inclusion & Equality',
                description: 'Creating platforms and initiatives that promote dignity, participation and equal opportunity.',
              },
              {
                title: 'Community Empowerment',
                description: 'Strengthening communities through collective action, awareness and grassroots participation.',
              },
              {
                title: 'Youth & Social Development',
                description: 'Creating opportunities for young people to learn, participate, contribute and lead positive change.',
              },
            ].map((area, idx) => (
              <RevealCard as="div" index={idx} key={area.title}>
                <div className="border-soft-border/50 hover:border-impact-green/50 bg-pure-white group h-full rounded-xl border p-6 transition-all hover:shadow-md">
                  <div className="bg-impact-green/20 mb-4 h-1.5 w-8 rounded-full transition-all group-hover:w-12"></div>
                  <h3 className="text-udbhav-blue-deep mb-3 font-heading text-lg font-bold">
                    {area.title}
                  </h3>
                  <p className="text-text-primary text-sm leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </RevealCard>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. OUR APPROACH */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mb-16 text-center">
            <span className="text-impact-green mb-4 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              OUR APPROACH
            </span>
            <h2 className="text-udbhav-blue-deep font-heading text-2xl font-bold sm:text-3xl md:text-4xl">
              From Awareness to Action
            </h2>
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Desktop connecting line */}
            <div className="bg-soft-border/50 absolute top-6 left-[10%] hidden h-[2px] w-[80%] lg:block"></div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: 'UNDERSTAND',
                  desc: 'Identifying grassroots needs and community challenges.',
                },
                {
                  step: 'EMPOWER',
                  desc: 'Equipping individuals with knowledge and resources.',
                },
                {
                  step: 'ACT',
                  desc: 'Taking collective, meaningful steps toward solutions.',
                },
                {
                  step: 'CREATE IMPACT',
                  desc: 'Building sustainable, long-term positive change.',
                },
              ].map((phase, idx) => (
                <RevealCard as="div" index={idx} key={phase.step} className="relative text-center">
                  <div className="bg-pure-white border-impact-green/30 text-udbhav-blue-deep relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 font-heading font-bold shadow-sm">
                    {idx + 1}
                  </div>
                  <h3 className="text-udbhav-blue-deep mt-6 mb-3 font-heading text-base font-bold tracking-wider">
                    {phase.step}
                  </h3>
                  <p className="text-text-primary text-sm leading-relaxed">
                    {phase.desc}
                  </p>
                </RevealCard>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. FOUNDER SECTION */}
      <section className="bg-udbhav-blue-deep/5 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            <span className="text-impact-green mb-4 block text-center font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              OUR FOUNDER
            </span>
            <h2 className="text-udbhav-blue-deep mb-12 text-center font-heading text-2xl font-bold sm:text-3xl md:text-4xl">
              A Vision Rooted in Purpose
            </h2>

            <RevealCard as="div" index={0} className="bg-pure-white overflow-hidden rounded-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="bg-udbhav-blue-deep/10 relative min-h-[300px] md:col-span-2">
                  {founderImage ? (
                    <Image
                      src={founderImage}
                      alt="Jaysuraj Pattanayak"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <User className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-8 md:col-span-3 md:p-10 lg:p-12">
                  <h3 className="text-udbhav-blue-deep font-heading text-xl font-bold sm:text-2xl">
                    Jaysuraj Pattanayak
                  </h3>
                  <p className="text-impact-green mt-2 text-sm font-semibold uppercase tracking-wider">
                    Founder, UDBHAV Foundation
                  </p>
                  
                  <div className="mt-8 space-y-6">
                    <p className="text-udbhav-blue-deep text-lg font-medium leading-relaxed md:text-xl">
                      "Real change begins when we nurture minds, empower through education, and protect the environment we all share."
                    </p>
                    <p className="text-text-primary text-base leading-relaxed">
                      Mental well-being, knowledge and sustainability are interconnected pillars of a thriving society. Our foundation is built on the belief that addressing these elements together creates resilient, responsible, and inclusive communities.
                    </p>
                  </div>
                </div>
              </div>
            </RevealCard>
          </div>
        </Container>
      </section>

      {/* 10. OPTIONAL FINAL CTA */}
      <section className="py-16 md:py-24">
        <Container className="text-center">
          <h2 className="text-udbhav-blue-deep mb-6 font-heading text-2xl font-bold sm:text-3xl">
            Be Part of the Change
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/volunteers"
              className="bg-impact-green hover:bg-env-green flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors sm:w-auto"
            >
              <Users className="h-4 w-4" />
              Join as a Volunteer
            </Link>
            <Link
              href="/donate"
              className="text-udbhav-blue-deep hover:bg-udbhav-blue-deep/5 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-200 px-8 py-3.5 text-sm font-semibold transition-colors sm:w-auto"
            >
              <Heart className="h-4 w-4" />
              Support Our Mission
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
