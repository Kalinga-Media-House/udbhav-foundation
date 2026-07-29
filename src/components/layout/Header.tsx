"use client";

import { Phone, Mail, Heart, LogIn } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavLinks } from "@/components/layout/NavLinks";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Container } from "@/components/shared/Container";

export function Header() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [upperHeight, setUpperHeight] = useState(48); // default fallback height
  const upperSectionRef = useRef<HTMLDivElement>(null);

  // Scroll state refs
  const isHeaderHiddenRef = useRef(false);
  const lastStableScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<"down" | "up" | null>(null);
  const accumulatedDistanceRef = useRef(0);

  useEffect(() => {
    isHeaderHiddenRef.current = isHeaderHidden;
  }, [isHeaderHidden]);

  // Measure upper section height for precise transform
  useEffect(() => {
    const measureHeight = () => {
      if (upperSectionRef.current) {
        setUpperHeight(upperSectionRef.current.offsetHeight);
      }
    };
    
    measureHeight();
    // Slight delay to ensure fonts/layout complete
    const timeout = setTimeout(measureHeight, 200);
    window.addEventListener("resize", measureHeight, { passive: true });
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", measureHeight);
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const TOP_SAFE_ZONE = 80;
    const HIDE_DISTANCE = 45;
    const SHOW_DISTANCE = 35;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;

      // Always reset if on desktop
      if (window.innerWidth >= 768) {
        if (isHeaderHiddenRef.current) {
          setIsHeaderHidden(false);
        }
        lastStableScrollYRef.current = currentScrollY;
        scrollDirectionRef.current = null;
        accumulatedDistanceRef.current = 0;
        return;
      }

      // Top of page rule
      if (currentScrollY <= TOP_SAFE_ZONE) {
        if (isHeaderHiddenRef.current) {
          setIsHeaderHidden(false);
        }
        lastStableScrollYRef.current = currentScrollY;
        scrollDirectionRef.current = null;
        accumulatedDistanceRef.current = 0;
        return;
      }

      const delta = currentScrollY - lastStableScrollYRef.current;
      
      // Ignore identical scroll positions
      if (delta === 0) return;

      const currentDirection = delta > 0 ? "down" : "up";

      if (currentDirection !== scrollDirectionRef.current) {
        // Changed direction, reset accumulation baseline
        scrollDirectionRef.current = currentDirection;
        accumulatedDistanceRef.current = 0;
        lastStableScrollYRef.current = currentScrollY;
        return;
      }

      // Accumulate distance in the same direction
      accumulatedDistanceRef.current = Math.abs(currentScrollY - lastStableScrollYRef.current);

      if (scrollDirectionRef.current === "down" && !isHeaderHiddenRef.current) {
        if (accumulatedDistanceRef.current > HIDE_DISTANCE) {
          setIsHeaderHidden(true);
          accumulatedDistanceRef.current = 0;
          lastStableScrollYRef.current = currentScrollY;
        }
      } else if (scrollDirectionRef.current === "up" && isHeaderHiddenRef.current) {
        if (accumulatedDistanceRef.current > SHOW_DISTANCE) {
          setIsHeaderHidden(false);
          accumulatedDistanceRef.current = 0;
          lastStableScrollYRef.current = currentScrollY;
        }
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initialize stable position
    lastStableScrollYRef.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full pointer-events-none">
      {/* 
        Inner wrapper that moves the entire header visual content.
        Using pointer-events-auto to restore interaction inside the wrapper.
      */}
      <div
        className="w-full flex flex-col pointer-events-auto will-change-transform shadow-sm"
        style={{
          transform: isHeaderHidden ? `translate3d(0, -${upperHeight}px, 0)` : "translate3d(0, 0, 0)",
          transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Top Slim Information Bar */}
        <div
          ref={upperSectionRef}
          className="hidden md:block w-full origin-top md:!opacity-100 md:!pointer-events-auto"
          style={{
            opacity: isHeaderHidden ? 0 : 1,
            transition: "opacity 280ms ease",
            pointerEvents: isHeaderHidden ? "none" : "auto",
          }}
        >
          <div className="relative z-40 bg-gradient-to-r from-udbhav-blue-deep via-udbhav-blue-deep to-[#004D7A] text-pure-white border-b border-udbhav-blue/40 shadow-2xs">
            <Container className="flex items-center justify-between gap-1.5 max-[359px]:gap-1 sm:gap-4 py-1.5 min-h-[48px] sm:min-h-[36px] w-full !px-3 max-[359px]:!px-2 sm:!px-6 md:!px-8 lg:!px-12">
              {/* Left Column: Tagline */}
              <div className="w-[38%] min-w-0 sm:w-auto text-left font-semibold sm:font-medium tracking-wide text-[9.5px] max-[359px]:text-[8px] sm:text-sm leading-[1.2] sm:leading-normal text-pure-white">
                <span className="block sm:inline">Growing Together for an </span>
                <span className="block sm:inline">Inclusive Future</span>
              </div>

              {/* Right Column: Contact info */}
              <div className="w-[62%] min-w-0 sm:w-auto flex flex-col items-end justify-center gap-[3px] max-[359px]:gap-0.5 sm:flex-row sm:items-center sm:gap-4 md:gap-6 shrink-0 font-semibold sm:font-medium text-[8.5px] max-[359px]:text-[7.5px] sm:text-sm leading-[1.15] sm:leading-normal">
                <a
                  href="tel:+916370508606"
                  aria-label="Call UDBHAV Foundation at +91 63705 08606"
                  className="inline-flex items-center gap-1 sm:gap-1.5 text-pure-white/95 hover:text-soft-green transition-colors whitespace-nowrap"
                >
                  <Phone className="w-[11px] h-[11px] max-[359px]:w-[10px] max-[359px]:h-[10px] sm:w-3.5 sm:h-3.5 shrink-0 text-fresh-green" aria-hidden="true" />
                  <span>+91 63705 08606</span>
                </a>
                <a
                  href="mailto:admin@udbhavfoundation.in"
                  aria-label="Email UDBHAV Foundation at admin@udbhavfoundation.in"
                  className="inline-flex items-center gap-1 sm:gap-1.5 text-pure-white/95 hover:text-soft-green transition-colors whitespace-nowrap"
                >
                  <Mail className="w-[11px] h-[11px] max-[359px]:w-[10px] max-[359px]:h-[10px] sm:w-3.5 sm:h-3.5 shrink-0 text-fresh-green" aria-hidden="true" />
                  <span>admin@udbhavfoundation.in</span>
                </a>
              </div>
            </Container>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="relative z-50 bg-warm-white/95 backdrop-blur-xs border-b border-soft-border">
          <Container className="flex items-center justify-between py-2.5 sm:py-3 lg:py-3 gap-4">
            {/* Dual-Brand Logo Area inside accessible homepage link */}
            <Link
              href="/"
              aria-label="UDBHAV Foundation home"
              className="inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-udbhav-blue transition-opacity hover:opacity-95 shrink-0"
            >
              <BrandLogo priority />
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center"
            >
              <NavLinks />
            </nav>

            {/* Desktop Action Buttons (Login & Donate) */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-soft-border bg-pure-white text-udbhav-blue text-sm font-medium hover:bg-soft-green/40 focus-visible:outline-2 focus-visible:outline-udbhav-blue transition-colors"
              >
                <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Login</span>
              </Link>

              <Link
                href="/donate"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-impact-green text-pure-white text-sm font-semibold hover:bg-env-green focus-visible:outline-2 focus-visible:outline-udbhav-blue transition-colors shadow-2xs"
              >
                <Heart className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />
                <span>Donate</span>
              </Link>
            </div>

            {/* Mobile Menu Trigger Area */}
            <MobileMenu />
          </Container>
        </div>
      </div>
    </header>
  );
}

export default Header;
