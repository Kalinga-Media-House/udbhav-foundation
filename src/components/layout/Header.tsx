'use client';

import { Phone, Mail, Heart, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

import { MobileMenu } from '@/components/layout/MobileMenu';
import { NavLinks } from '@/components/layout/NavLinks';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Container } from '@/components/shared/Container';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/auth-provider';

export function Header() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [upperHeight, setUpperHeight] = useState(48); // default fallback height
  const upperSectionRef = useRef<HTMLDivElement>(null);

  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const getDashboardHref = () => {
    const role = user?.app_metadata?.role || user?.user_metadata?.role;
    if (role === 'volunteer') return '/volunteers/dashboard';
    return '/admin/dashboard';
  };

  // Scroll state refs
  const isHeaderHiddenRef = useRef(false);
  const lastStableScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<'down' | 'up' | null>(null);
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
    window.addEventListener('resize', measureHeight, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', measureHeight);
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

      const currentDirection = delta > 0 ? 'down' : 'up';

      if (currentDirection !== scrollDirectionRef.current) {
        // Changed direction, reset accumulation baseline
        scrollDirectionRef.current = currentDirection;
        accumulatedDistanceRef.current = 0;
        lastStableScrollYRef.current = currentScrollY;
        return;
      }

      // Accumulate distance in the same direction
      accumulatedDistanceRef.current = Math.abs(currentScrollY - lastStableScrollYRef.current);

      if (scrollDirectionRef.current === 'down' && !isHeaderHiddenRef.current) {
        if (accumulatedDistanceRef.current > HIDE_DISTANCE) {
          setIsHeaderHidden(true);
          accumulatedDistanceRef.current = 0;
          lastStableScrollYRef.current = currentScrollY;
        }
      } else if (scrollDirectionRef.current === 'up' && isHeaderHiddenRef.current) {
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <header className="pointer-events-none sticky top-0 z-50 w-full">
      {/* 
        Inner wrapper that moves the entire header visual content.
        Using pointer-events-auto to restore interaction inside the wrapper.
      */}
      <div
        className="pointer-events-auto flex w-full flex-col shadow-sm will-change-transform"
        style={{
          transform: isHeaderHidden
            ? `translate3d(0, -${upperHeight}px, 0)`
            : 'translate3d(0, 0, 0)',
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Top Slim Information Bar */}
        <div
          ref={upperSectionRef}
          className="hidden w-full origin-top md:!pointer-events-auto md:block md:!opacity-100"
          style={{
            opacity: isHeaderHidden ? 0 : 1,
            transition: 'opacity 280ms ease',
            pointerEvents: isHeaderHidden ? 'none' : 'auto',
          }}
        >
          <div className="from-udbhav-blue-deep via-udbhav-blue-deep text-pure-white border-udbhav-blue/40 shadow-2xs relative z-40 border-b bg-gradient-to-r to-[#004D7A]">
            <Container className="flex min-h-[48px] w-full items-center justify-between gap-1.5 !px-3 py-1.5 max-[359px]:gap-1 max-[359px]:!px-2 sm:min-h-[36px] sm:gap-4 sm:!px-6 md:!px-8 lg:!px-12">
              {/* Left Column: Tagline */}
              <div className="text-pure-white w-[38%] min-w-0 text-left text-[9.5px] font-semibold leading-[1.2] tracking-wide max-[359px]:text-[8px] sm:w-auto sm:text-sm sm:font-medium sm:leading-normal">
                <span className="block sm:inline">Growing Together for an </span>
                <span className="block sm:inline">Inclusive Future</span>
              </div>

              {/* Right Column: Contact info */}
              <div className="flex w-[62%] min-w-0 shrink-0 flex-col items-end justify-center gap-[3px] text-[8.5px] font-semibold leading-[1.15] max-[359px]:gap-0.5 max-[359px]:text-[7.5px] sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:text-sm sm:font-medium sm:leading-normal md:gap-6">
                <a
                  href="tel:+916370508606"
                  aria-label="Call UDBHAV Foundation at +91 63705 08606"
                  className="text-pure-white/95 hover:text-soft-green inline-flex items-center gap-1 whitespace-nowrap transition-colors sm:gap-1.5"
                >
                  <Phone
                    className="text-fresh-green h-[11px] w-[11px] shrink-0 max-[359px]:h-[10px] max-[359px]:w-[10px] sm:h-3.5 sm:w-3.5"
                    aria-hidden="true"
                  />
                  <span>+91 63705 08606</span>
                </a>
                <a
                  href="mailto:admin@udbhavfoundation.in"
                  aria-label="Email UDBHAV Foundation at admin@udbhavfoundation.in"
                  className="text-pure-white/95 hover:text-soft-green inline-flex items-center gap-1 whitespace-nowrap transition-colors sm:gap-1.5"
                >
                  <Mail
                    className="text-fresh-green h-[11px] w-[11px] shrink-0 max-[359px]:h-[10px] max-[359px]:w-[10px] sm:h-3.5 sm:w-3.5"
                    aria-hidden="true"
                  />
                  <span>admin@udbhavfoundation.in</span>
                </a>
              </div>
            </Container>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="bg-warm-white/95 backdrop-blur-xs border-soft-border relative z-50 border-b">
          <Container className="flex items-center justify-between gap-4 py-2.5 sm:py-3 lg:py-3">
            {/* Dual-Brand Logo Area inside accessible homepage link */}
            <Link
              href="/"
              aria-label="UDBHAV Foundation home"
              className="focus-visible:outline-udbhav-blue inline-flex shrink-0 items-center rounded-lg transition-opacity hover:opacity-95 focus-visible:outline-2"
            >
              <BrandLogo priority />
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="Primary navigation" className="hidden items-center lg:flex">
              <NavLinks />
            </nav>

            {/* Desktop Action Buttons (Login & Donate) */}
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              {!isLoading &&
                (user ? (
                  <>
                    <Link
                      href={getDashboardHref()}
                      className="border-soft-border bg-pure-white text-udbhav-blue hover:bg-soft-green/40 focus-visible:outline-udbhav-blue inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2"
                    >
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-500"
                    >
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="border-soft-border bg-pure-white text-udbhav-blue hover:bg-soft-green/40 focus-visible:outline-udbhav-blue inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2"
                    >
                      <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Login</span>
                    </Link>

                    <Link
                      href="/donate"
                      className="bg-impact-green text-pure-white hover:bg-env-green focus-visible:outline-udbhav-blue shadow-2xs inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2"
                    >
                      <Heart className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />
                      <span>Donate</span>
                    </Link>
                  </>
                ))}
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
