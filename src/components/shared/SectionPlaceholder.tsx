import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Container } from "@/components/shared/Container";

export interface SectionPlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionPlaceholder({
  eyebrow,
  title,
  description,
}: SectionPlaceholderProps) {
  return (
    <main className="flex-1 py-16 sm:py-24 lg:py-32 flex items-center justify-center">
      <Container>
        <div className="interactive-card max-w-2xl mx-auto text-center card-surface p-8 sm:p-12 rounded-2xl bg-pure-white border border-soft-border shadow-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-soft-green border border-soft-border text-udbhav-blue font-heading text-xs font-bold tracking-wider uppercase">
            <Clock className="h-3.5 w-3.5 text-fresh-green shrink-0" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {description}
          </p>

          <div className="pt-3 border-t border-soft-border/60">
            <p className="text-sm font-medium text-text-secondary mb-6">
              Our official digital platform is being thoughtfully developed. This section will be published soon.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-udbhav-blue text-pure-white text-sm font-semibold hover:bg-udbhav-blue-deep transition-colors shadow-xs"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Return to UDBHAV Foundation Home</span>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default SectionPlaceholder;
