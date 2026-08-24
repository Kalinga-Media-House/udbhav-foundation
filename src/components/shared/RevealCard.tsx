"use client";

import React, { useEffect, useRef, useState } from "react";

export interface RevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
  maxStagger?: number;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function RevealCard({
  index = 0,
  maxStagger = 360,
  children,
  className = "",
  as: Component = "div",
  direction = "up",
  ...props
}: RevealCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    if (reducedMotion) {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const staggerDelay = reducedMotion ? 0 : Math.min(index * 90, maxStagger);

  let transformClass = "translate-y-5 scale-[0.99]";
  if (direction === "left") transformClass = "-translate-x-10 scale-100";
  if (direction === "right") transformClass = "translate-x-10 scale-100";
  if (direction === "down") transformClass = "-translate-y-5 scale-[0.99]";
  if (direction === "none") transformClass = "scale-100";

  return (
    <Component
      ref={ref}
      style={{
        transitionDelay: isVisible ? `${staggerDelay}ms` : "0ms",
      }}
      className={`transition-all duration-[700ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
        reducedMotion || isVisible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : `opacity-0 ${transformClass}`
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default RevealCard;
