'use client';

import Image from 'next/image';
import React from 'react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';

export function AboutOverviewSection() {
  return (
    <section
      aria-labelledby="about-overview-heading"
      className="via-pure-white to-warm-white border-soft-border/40 relative w-full overflow-hidden border-b bg-gradient-to-b from-[#FDFCF8] py-12 sm:py-16 md:py-20"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: About UDBHAV Narrative */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-7">
            <RevealCard as="div" index={0}>
              <span className="eyebrow-label text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
                WHO WE ARE
              </span>
              <h2
                id="about-overview-heading"
                className="text-udbhav-blue-deep font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
              >
                About UDBHAV
              </h2>
            </RevealCard>

            <RevealCard
              as="div"
              index={1}
              className="text-text-primary space-y-4 text-base leading-relaxed sm:text-lg"
            >
              <p>
                We started Udbhav Foundation in 2020 because we care deeply about our community. Our
                goal is simple. We want to create a world where everyone belongs, people look out
                for one another, and everyone has the chance to thrive. We focus on education,
                protecting our environment, and celebrating our shared culture.
              </p>
              <p>
                Over the years, our small family has grown into a wonderful community of around 300
                active members. We are students, professionals, and everyday people from all walks
                of life, brought together by a shared desire to make a difference.
              </p>
              <p>
                From our homes in Bhubaneswar and Khordha, we work hand in hand with neighborhoods
                across both cities and villages. Whether we are running awareness campaigns or
                organizing support programs, our heart is always in building stronger, more
                connected communities.
              </p>
            </RevealCard>
          </div>

          {/* Right Column: Founder Message Card */}
          <div className="mt-10 flex items-center lg:col-span-5 lg:mt-0">
            <RevealCard
              as="div"
              index={2}
              className="bg-pure-white border-soft-border/30 border-t-impact-green group relative flex flex-col rounded-[24px] border-t-[4px] p-6 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-8 lg:p-10"
            >
              <div className="mb-6 flex items-center gap-4 sm:gap-5">
                <div className="border-impact-green/20 relative h-16 w-16 shrink-0 overflow-hidden rounded-full border shadow-sm sm:h-20 sm:w-20">
                  <Image
                    src="/images/team/jaysuraj-pattanayak.jpg"
                    alt="Jaysuraj Pattanayak, Founder of UDBHAV Foundation"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 64px, 80px"
                  />
                </div>
                <div>
                  <h3 className="text-udbhav-blue-deep font-heading text-lg font-bold leading-tight sm:text-xl">
                    Jaysuraj Pattanayak
                  </h3>
                  <p className="text-impact-green mt-1 text-sm font-medium">
                    Founder, UDBHAV Foundation
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-udbhav-blue-deep text-base font-semibold leading-relaxed sm:text-lg">
                  &quot;Real change begins when ordinary people decide to care for one
                  another.&quot;
                </p>

                <p className="text-text-primary text-sm leading-relaxed sm:text-[15px]">
                  I started Udbhav Foundation with a very simple belief. When we take care of our
                  young ones, give them the tools to learn, and protect the world we all share, we
                  build stronger communities.
                </p>

                <p className="text-text-primary text-sm leading-relaxed sm:text-[15px]">
                  Every project we take on is our way of helping families become stronger, kinder,
                  and more responsible together. We are building a family of people who care about
                  each other.
                </p>
              </div>
            </RevealCard>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutOverviewSection;
