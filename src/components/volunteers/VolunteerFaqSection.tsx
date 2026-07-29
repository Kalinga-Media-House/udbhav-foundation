"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const VOLUNTEER_FAQS = [
  {
    question: "Who can become an UDBHAV volunteer?",
    answer:
      "Students, educators, professionals, retired individuals, community members, and anyone committed to responsible social action may apply.",
  },
  {
    question: "Do I need previous volunteering experience?",
    answer:
      "No. Previous experience is helpful but not required. Willingness to learn, collaborate, and contribute responsibly is more important.",
  },
  {
    question: "Is volunteering paid?",
    answer:
      "Volunteer roles are generally unpaid and focused on community service, learning, participation, and social impact. Any role-specific support will be communicated separately.",
  },
  {
    question: "Can I volunteer only during events?",
    answer:
      "Yes. You may choose regular, flexible, online, weekend, or event-based volunteering according to your availability.",
  },
  {
    question: "Will I receive a volunteer certificate?",
    answer:
      "Certificates or letters of appreciation may be issued based on participation, contribution, attendance, and the applicable programme guidelines.",
  },
  {
    question: "Can I volunteer remotely?",
    answer:
      "Some opportunities in research, technology, design, communication, content, and digital outreach may be available remotely.",
  },
  {
    question: "How will I know if my application is accepted?",
    answer:
      "The UDBHAV volunteer coordination team will review your application and contact you through the email address or mobile number provided.",
  },
];

export function VolunteerFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      aria-labelledby="volunteer-faq-heading"
      className="relative w-full py-12 sm:py-16 md:py-20 bg-pure-white"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span
              className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2"
              style={{ color: "#439B25" }}
            >
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2
              id="volunteer-faq-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3"
              style={{ color: "#12245F" }}
            >
              Got Questions? We’re Here to Help
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "#5E6B63" }}
            >
              Everything you need to know about volunteering with UDBHAV
              Foundation.
            </p>
          </RevealCard>
        </div>

        {/* Accessible Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {VOLUNTEER_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const headingId = `faq-heading-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <RevealCard key={faq.question} as="div" index={index}>
                <div
                  className={`rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? "bg-[#FDFCF8] border-[#439B25]/40 shadow-sm"
                      : "bg-pure-white border-soft-border/80 hover:border-[#12245F]/30"
                  }`}
                >
                  <h3>
                    <button
                      id={headingId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between text-left p-4 sm:p-5.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#202B78] cursor-pointer"
                    >
                      <span
                        className="font-heading text-sm sm:text-base font-bold pr-4 leading-snug"
                        style={{ color: "#12245F" }}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? "bg-[#EEF8E9] text-[#439B25] rotate-180" : "bg-[#FDFCF8] text-[#12245F]"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2]" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    hidden={!isOpen}
                    className="overflow-hidden transition-all duration-300 ease-out"
                  >
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5.5 sm:pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-[#5E6B63] border-t border-soft-border/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </div>
              </RevealCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default VolunteerFaqSection;
