"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, LogIn } from "lucide-react";
import { MAIN_NAV_ITEMS } from "@/data/navigation";

export function MobileMenu() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const pathname = usePathname();
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Check reduced motion preference safely
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    queueMicrotask(() => {
      setReducedMotion(mediaQuery.matches);
    });
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const closeMenu = useCallback(() => {
    if (!mounted || isClosing) return;
    setIsClosing(true);
    setIsOpen(false);

    const duration = reducedMotion ? 0 : 220;
    setTimeout(() => {
      setMounted(false);
      setIsClosing(false);
      toggleBtnRef.current?.focus();
    }, duration);
  }, [mounted, isClosing, reducedMotion]);

  const openMenu = () => {
    if (mounted) return;
    setMounted(true);
    setIsClosing(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    });
  };

  // Close menu on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mounted && !isClosing) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mounted, isClosing, closeMenu]);

  // Close menu on desktop/tablet resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mounted) {
        setMounted(false);
        setIsOpen(false);
        setIsClosing(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  // Prevent background body scrolling while menu drawer is open
  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  // Helper for computing stagger styles on drawer items
  const getItemStyle = (index: number): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      transitionDelay: isOpen ? `${index * 25}ms` : "0ms",
      transitionDuration: "260ms",
      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    };
  };

  const getItemTransformClass = () => {
    if (reducedMotion) return "";
    return isOpen
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-1.5";
  };

  // Drawer container style
  const getDrawerStyle = (): React.CSSProperties => {
    if (reducedMotion) {
      return {
        opacity: isOpen ? 1 : 0,
      };
    }
    return {
      transitionDuration: isOpen ? "320ms" : "220ms",
      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      opacity: isOpen ? 1 : 0,
      transform: isOpen
        ? "translate3d(0, 0, 0) scale(1)"
        : isClosing
        ? "translate3d(14px, 0, 0) scale(0.99)"
        : "translate3d(20px, 0, 0) scale(0.985)",
    };
  };

  return (
    <div className="lg:hidden">
      {/* Accessible Menu Toggle Button inside normal website Header */}
      <button
        ref={toggleBtnRef}
        type="button"
        aria-expanded={mounted}
        aria-controls="mobile-navigation-panel"
        aria-label={mounted ? "Close navigation menu" : "Open navigation menu"}
        onClick={mounted ? closeMenu : openMenu}
        className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-text-primary hover:text-udbhav-blue hover:bg-soft-green/50 focus-visible:outline-2 focus-visible:outline-udbhav-blue transition-colors"
      >
        <Menu className="h-6 w-6 shrink-0" aria-hidden="true" />
      </button>

      {/* Single Floating Compact Mobile Drawer & Single Backdrop */}
      {mounted && (
        <>
          {/* Single Backdrop overlay covering underlying Header & Page */}
          <div
            aria-hidden="true"
            onClick={closeMenu}
            style={{
              transitionDuration: isOpen ? "320ms" : "220ms",
              opacity: isOpen ? 1 : 0,
            }}
            className="fixed inset-0 z-[90] bg-[rgba(10,20,18,0.45)] backdrop-blur-[2px] transition-opacity"
          />

          {/* Single Compact Floating Navigation Drawer (z-[100] above backdrop) */}
          <nav
            id="mobile-navigation-panel"
            aria-label="Mobile navigation"
            style={getDrawerStyle()}
            className="fixed top-3 right-3 max-[330px]:right-4 z-[100] w-[min(84vw,310px)] max-[330px]:w-[calc(100vw-32px)] h-auto max-h-[calc(100dvh-24px)] overflow-y-auto rounded-2xl bg-warm-white border border-soft-border shadow-2xl transition-all origin-top-right pt-[48px]"
          >
            {/* Absolute Upper-Right Close Button */}
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="absolute top-2.5 right-2.5 inline-flex items-center justify-center min-h-[40px] min-w-[40px] p-2 rounded-lg text-text-primary hover:text-udbhav-blue hover:bg-soft-green/50 focus-visible:outline-2 focus-visible:outline-udbhav-blue transition-colors shrink-0 z-10"
            >
              <X className="h-5 w-5 shrink-0" aria-hidden="true" />
            </button>

            <div className="flex flex-col">
              {/* Compact Navigation Links */}
              <ul className="space-y-1 px-3.5 pb-2">
                {MAIN_NAV_ITEMS.map((item, index) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <li
                      key={item.href}
                      style={getItemStyle(index)}
                      className={`transition-all ${getItemTransformClass()}`}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-center justify-between min-h-[42px] px-3.5 py-2 rounded-xl text-[16px] font-medium transition-colors ${
                          isActive
                            ? "bg-soft-green text-udbhav-blue font-semibold border border-soft-border"
                            : "text-text-primary hover:bg-soft-green/50 hover:text-udbhav-blue"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full bg-impact-green shrink-0"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Action Divider */}
              <div
                style={getItemStyle(MAIN_NAV_ITEMS.length)}
                className={`px-3.5 pt-1.5 pb-2.5 transition-all ${getItemTransformClass()}`}
              >
                <hr className="border-soft-border" />
              </div>

              {/* Action Buttons (Login & Donate) */}
              <div className="flex flex-col gap-2 px-3.5 pb-3">
                <div
                  style={getItemStyle(MAIN_NAV_ITEMS.length + 1)}
                  className={`transition-all ${getItemTransformClass()}`}
                >
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 min-h-[44px] w-full px-4 py-2 rounded-xl border border-soft-border bg-pure-white text-udbhav-blue text-[16px] font-medium hover:bg-soft-green/30 transition-colors shadow-2xs"
                  >
                    <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Login</span>
                  </Link>
                </div>

                <div
                  style={getItemStyle(MAIN_NAV_ITEMS.length + 2)}
                  className={`transition-all ${getItemTransformClass()}`}
                >
                  <Link
                    href="/donate"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 min-h-[44px] w-full px-4 py-2 rounded-xl bg-impact-green text-pure-white text-[16px] font-semibold hover:bg-env-green transition-colors shadow-sm"
                  >
                    <Heart
                      className="h-4 w-4 shrink-0 fill-current"
                      aria-hidden="true"
                    />
                    <span>Donate</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

export default MobileMenu;
