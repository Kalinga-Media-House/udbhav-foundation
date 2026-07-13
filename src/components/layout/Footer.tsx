import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Heart, Users } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { BrandLogo } from "@/components/shared/BrandLogo";
import {
  FOOTER_QUICK_LINKS,
  FOOTER_EXPLORE_LINKS,
  FOOTER_LEGAL_LINKS,
} from "@/data/navigation";

function Facebook({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Instagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Youtube({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3v6Z" />
    </svg>
  );
}

const siteSettings = {
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
};

const socialLinks = [
  {
    name: "Facebook",
    url: siteSettings.facebookUrl,
    icon: Facebook,
    ariaLabel: "Follow UDBHAV Foundation on Facebook",
  },
  {
    name: "Instagram",
    url: siteSettings.instagramUrl,
    icon: Instagram,
    ariaLabel: "Follow UDBHAV Foundation on Instagram",
  },
  {
    name: "YouTube",
    url: siteSettings.youtubeUrl,
    icon: Youtube,
    ariaLabel: "Subscribe to UDBHAV Foundation on YouTube",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="bg-udbhav-blue-deep text-pure-white border-t border-udbhav-blue/40"
    >
      <Container className="pt-12 sm:pt-16 pb-10">
        {/* Main Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-pure-white/15">
          {/* A. Organization Identity & Description (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-block p-2.5 rounded-xl bg-pure-white/95 shadow-md">
              <BrandLogo variant="dual" />
            </div>

            <p className="font-heading text-lg sm:text-xl font-bold text-soft-green tracking-tight">
              Growing Together for an Inclusive Future
            </p>

            <p className="text-sm text-pure-white/80 leading-relaxed max-w-sm">
              A community-rooted nonprofit advancing education, environmental
              responsibility, mental well-being, inclusion and collective action.
            </p>

            {/* Social Media Channels — Follow Our Journey */}
            <div className="pt-1 space-y-2.5 text-center sm:text-left">
              <h2 className="font-heading text-xs sm:text-sm font-bold tracking-wider uppercase text-fresh-green">
                FOLLOW OUR JOURNEY
              </h2>

              <div
                role="group"
                aria-label="Official UDBHAV Foundation social media channels"
                className="flex items-center justify-center sm:justify-start gap-3.5"
              >
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  const isAvailable = Boolean(
                    item.url && item.url.trim() !== ""
                  );

                  if (isAvailable) {
                    return (
                      <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.ariaLabel}
                        title={item.ariaLabel}
                        className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-pure-white/10 border border-pure-white/25 text-pure-white hover:border-impact-green hover:bg-pure-white/15 hover:-translate-y-[3px] hover:shadow-[0_0_12px_rgba(67,155,37,0.45)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-fresh-green focus-visible:outline-offset-2 shrink-0"
                      >
                        <Icon
                          className="w-4.5 h-4.5 text-pure-white group-hover:text-fresh-green group-hover:scale-110 transition-all duration-300"
                          aria-hidden="true"
                        />
                      </a>
                    );
                  }

                  return (
                    <button
                      key={item.name}
                      type="button"
                      disabled
                      aria-disabled="true"
                      aria-label={`${item.ariaLabel} (Coming Soon)`}
                      title={`${item.ariaLabel} (Coming Soon)`}
                      className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-pure-white/10 border border-pure-white/25 text-pure-white/60 cursor-not-allowed transition-all duration-300 focus-visible:outline-2 focus-visible:outline-fresh-green focus-visible:outline-offset-2 shrink-0"
                    >
                      <Icon
                        className="w-4.5 h-4.5 text-pure-white/60"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* E. Community Action Callout Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <Link
                href="/volunteers"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pure-white/10 hover:bg-pure-white/20 border border-pure-white/25 text-pure-white text-xs sm:text-sm font-medium transition-colors"
              >
                <Users className="h-4 w-4 shrink-0 text-fresh-green" aria-hidden="true" />
                <span>Join as a Volunteer</span>
              </Link>

              <Link
                href="/donate"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-impact-green hover:bg-env-green text-pure-white text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
              >
                <Heart className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />
                <span>Support Our Mission</span>
              </Link>
            </div>
          </div>

          {/* B. Quick Links (2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-heading text-sm font-bold tracking-wider uppercase text-fresh-green">
              Quick Links
            </h2>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-pure-white/80 hover:text-soft-green transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* C. Explore (2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-heading text-sm font-bold tracking-wider uppercase text-fresh-green">
              Explore
            </h2>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_EXPLORE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-pure-white/80 hover:text-soft-green transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* D. Official Contact Information (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-heading text-sm font-bold tracking-wider uppercase text-fresh-green">
              Official Contact
            </h2>

            <ul className="space-y-3.5 text-sm text-pure-white/85">
              <li>
                <a
                  href="tel:+916370508606"
                  className="flex items-start gap-3 hover:text-soft-green transition-colors"
                >
                  <Phone
                    className="h-4 w-4 shrink-0 mt-0.5 text-fresh-green"
                    aria-hidden="true"
                  />
                  <span>+91 63705 08606</span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:admin@udbhavfoundation.in"
                  className="flex items-start gap-3 hover:text-soft-green transition-colors"
                >
                  <Mail
                    className="h-4 w-4 shrink-0 mt-0.5 text-fresh-green"
                    aria-hidden="true"
                  />
                  <span>admin@udbhavfoundation.in</span>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin
                  className="h-4 w-4 shrink-0 mt-0.5 text-fresh-green"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">
                  Plot No. 1519, Bharat Petroleum, 4269/4967, Besides/Above Bandhan
                  Bank, Soubhagya Nagar, Baramunda, Bhubaneswar, Odisha – 751003
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* F. Footer Legal Bar */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 items-center gap-3.5 md:gap-4 text-xs text-pure-white/70">
          <p className="text-center md:text-left">
            &copy; {currentYear} UDBHAV Foundation. All rights reserved.
          </p>

          <p className="text-center text-pure-white/75">
            Powered by{" "}
            <a
              href="https://www.kalingamediahouse.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kalinga Media House (opens in a new tab)"
              className="text-fresh-green hover:text-soft-green underline underline-offset-4 decoration-fresh-green/40 hover:decoration-soft-green transition-all focus-visible:outline-2 focus-visible:outline-fresh-green focus-visible:outline-offset-2 rounded-xs"
            >
              Kalinga Media House
            </a>
          </p>

          <ul className="flex items-center justify-center md:justify-end gap-6">
            {FOOTER_LEGAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-pure-white transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
