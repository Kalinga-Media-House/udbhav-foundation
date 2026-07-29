'use client';

import { Quote } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';

const FOUNDER_IMAGE_PATH = '/images/team/jaysuraj-pattanayak.jpg';

export function FoundersMessageSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      aria-labelledby="founder-message-heading"
      className="via-pure-white to-warm-white border-soft-border/40 relative w-full overflow-hidden border-b bg-gradient-to-b from-[#FDFCF8] py-8 sm:py-10 md:py-12 lg:py-14"
    >
      <Container className="relative z-10">
        {/* Compact Premium Light-Blue Theme Card */}
        <div
          className="group/main duration-350 relative overflow-hidden rounded-2xl p-4 transition-all ease-out hover:-translate-y-1 sm:rounded-3xl sm:p-6 md:p-7 lg:px-10 lg:py-8"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.85), transparent 35%), linear-gradient(135deg, #F4F9FF 0%, #E5F1FF 48%, #D6E8FF 100%)`,
            border: '1px solid rgba(45, 85, 165, 0.20)',
            boxShadow: '0 16px 40px rgba(28, 67, 140, 0.15)',
          }}
        >
          {/* 
            Compact Layout:
            Desktop (>=1024px):
              Two columns: Left Profile Card (~28%), Right Message Content (~72%)
            Mobile/Tablet (<1024px):
              Compact stack: Profile Card -> Message -> Quote
          */}
          <div className="relative z-10 flex flex-col items-center gap-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 xl:gap-9">
            {/* MOBILE ONLY HEADER (< 1024px) */}
            <div className="mb-1 block w-full text-center sm:text-left lg:hidden">
              <RevealCard as="div" index={0}>
                <span
                  className="eyebrow-label mb-1 block font-heading text-[11.5px] font-bold uppercase tracking-wider sm:text-xs"
                  style={{ color: '#238B45' }}
                >
                  A MESSAGE FROM OUR FOUNDER
                </span>
                <h2
                  id="founder-message-heading"
                  className="font-heading text-2xl font-bold leading-[1.12] tracking-tight sm:text-3xl"
                  style={{ color: '#172B6A' }}
                >
                  Building a Movement of Purpose
                </h2>
              </RevealCard>
            </div>

            {/* LEFT COLUMN: Compact Founder Profile Card (~28% column width) */}
            <div className="flex w-full flex-col items-center lg:col-span-4 lg:items-start xl:col-span-3">
              <RevealCard
                as="div"
                index={1}
                className="flex w-full flex-col items-center lg:items-start"
              >
                {/* Soft White/Light-Blue Glass Profile Card */}
                <div
                  className="group relative flex w-full max-w-[340px] flex-col items-center rounded-xl p-4 text-center transition-all duration-300 ease-out hover:-translate-y-0.5 sm:rounded-2xl sm:p-5 lg:max-w-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.58)',
                    border: '1px solid rgba(44, 82, 155, 0.20)',
                    boxShadow: '0 8px 24px rgba(28, 65, 130, 0.10)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Compact Profile Image */}
                  <div
                    className="relative z-10 mb-3 h-28 w-28 shrink-0 overflow-hidden rounded-2xl shadow-sm sm:mb-3.5 sm:h-36 sm:w-36 lg:h-40 lg:w-40"
                    style={{
                      background: 'linear-gradient(145deg, #DCEAFF 0%, #C4DAFA 100%)',
                      border: '1px solid rgba(43, 78, 150, 0.18)',
                    }}
                  >
                    {!imageError ? (
                      <Image
                        src={FOUNDER_IMAGE_PATH}
                        alt="Jaysuraj Pattanayak, Founder of Udbhav Foundation"
                        fill
                        sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 160px"
                        className="select-none object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      /* Graceful compact fallback avatar */
                      <div
                        role="img"
                        aria-label="Jaysuraj Pattanayak, Founder of Udbhav Foundation"
                        className="flex h-full w-full select-none flex-col items-center justify-center p-3 text-center"
                      >
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-full font-heading text-xl font-bold shadow-sm"
                          style={{
                            background: 'rgba(255, 255, 255, 0.75)',
                            border: '1px solid rgba(43, 78, 150, 0.25)',
                            color: '#172B6A',
                          }}
                        >
                          JP
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Founder Name & Designation */}
                  <div className="relative z-10 w-full">
                    <h3
                      className="font-heading text-lg font-bold leading-snug tracking-tight sm:text-xl lg:text-[22px]"
                      style={{ color: '#172B6A' }}
                    >
                      Jaysuraj Pattanayak
                    </h3>
                    <p
                      className="mt-0.5 text-xs font-medium leading-snug sm:text-sm"
                      style={{ color: '#2F9638' }}
                    >
                      Founder, UDBHAV Foundation
                    </p>
                  </div>
                </div>
              </RevealCard>
            </div>

            {/* RIGHT COLUMN: Desktop Heading + Message Paragraphs + Quote Card (~72% width) */}
            <div className="flex w-full flex-col justify-center lg:col-span-8 xl:col-span-9">
              {/* DESKTOP ONLY HEADER */}
              <div className="mb-3.5 hidden lg:block xl:mb-4">
                <RevealCard as="div" index={0}>
                  <span
                    className="eyebrow-label mb-1.5 block font-heading text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#238B45' }}
                  >
                    A MESSAGE FROM OUR FOUNDER
                  </span>
                  <h2
                    className="font-heading text-3xl font-bold leading-[1.12] tracking-tight lg:text-[38px] xl:text-[42px]"
                    style={{ color: '#172B6A' }}
                  >
                    Building a Movement of Purpose
                  </h2>
                </RevealCard>
              </div>

              {/* Compact Founder Message Paragraphs */}
              <RevealCard
                as="div"
                index={2}
                className="space-y-2.5 text-left text-sm leading-[1.6] sm:space-y-3 sm:text-[15px] lg:text-[16.5px]"
                style={{ color: '#263B5E' }}
              >
                <p>
                  “I started Udbhav Foundation because of a very simple belief. I believe that{' '}
                  <strong className="font-semibold" style={{ color: '#172B6A' }}>
                    real change happens
                  </strong>{' '}
                  when we take care of our young ones, give them the tools to learn, and protect the
                  world we all share.
                </p>

                <p>
                  Along the way, we realized that{' '}
                  <strong className="font-semibold" style={{ color: '#172B6A' }}>
                    healthy minds, good education, and a safe environment
                  </strong>{' '}
                  are all deeply connected. They are the{' '}
                  <strong className="font-semibold" style={{ color: '#2F9638' }}>
                    building blocks of a happy community
                  </strong>
                  . Every project we take on is just our way of helping families become stronger,
                  kinder, and more responsible together.
                </p>

                <p>
                  We are doing much more than just charity work. We are building a{' '}
                  <strong className="font-semibold" style={{ color: '#172B6A' }}>
                    family of people who care about each other
                  </strong>
                  .”
                </p>
              </RevealCard>

              {/* Compact Highlighted Quote Card */}
              <RevealCard as="div" index={3} className="mt-4 sm:mt-5">
                <div
                  className="relative overflow-hidden rounded-xl px-4 py-3 sm:px-5 sm:py-3.5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.55)',
                    borderTop: '1px solid rgba(41, 77, 150, 0.20)',
                    borderRight: '1px solid rgba(41, 77, 150, 0.20)',
                    borderBottom: '1px solid rgba(41, 77, 150, 0.20)',
                    borderLeft: '4px solid #63D98B',
                    boxShadow: '0 5px 16px rgba(29, 64, 128, 0.07)',
                  }}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5">
                    <Quote
                      aria-hidden="true"
                      className="sm:w-5.5 sm:h-5.5 h-5 w-5 shrink-0 opacity-90"
                      style={{ color: '#2F9638' }}
                    />
                    <p
                      className="font-heading text-[15px] font-semibold leading-snug sm:text-base lg:text-[17px]"
                      style={{ color: '#172B6A' }}
                    >
                      “This is more than just a mission. It is our responsibility to each other.”
                    </p>
                  </div>
                </div>
              </RevealCard>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FoundersMessageSection;
