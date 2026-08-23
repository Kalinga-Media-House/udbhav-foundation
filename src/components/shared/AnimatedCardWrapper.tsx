"use client";
/* eslint-disable */

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export interface AnimatedCardWrapperProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  elementType?: React.ElementType;
  href?: string;
}

export function AnimatedCardWrapper({
  children,
  index = 0,
  className = "",
  elementType: Component = "div",
  href,
  ...props
}: AnimatedCardWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [pressState, setPressState] = useState<"idle" | "pressed" | "released">("idle");
  const cardRef = useRef<HTMLElement>(null);
  const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.10 } // 10% visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [reducedMotion]);

  const handlePointerDown = () => {
    if (reducedMotion) return;
    if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
    setPressState("pressed");
  };

  const handlePointerUp = () => {
    if (reducedMotion || pressState !== "pressed") return;
    setPressState("released");
    releaseTimeoutRef.current = setTimeout(() => {
      setPressState("idle");
    }, 300);
  };

  const handlePointerCancel = () => {
    if (reducedMotion) return;
    setPressState("idle");
  };

  const staggerDelay = Math.min(index * 100, 400); // Max stagger delay 400ms
  const isPressed = pressState === "pressed";
  const isReleased = pressState === "released";

  const Element = href ? Link : Component;
  const linkProps = href ? { href } : {};

  return (
    <div
      ref={cardRef as any}
      className="h-full"
      style={{
        opacity: isVisible || reducedMotion ? 1 : 0,
        transform: isVisible || reducedMotion ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
        transition: reducedMotion 
          ? "none" 
          : `opacity 750ms cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms, transform 750ms cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms`,
        willChange: isVisible ? "auto" : "transform, opacity",
      }}
    >
      <Element
        {...linkProps}
        {...props}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerCancel}
        onPointerCancel={handlePointerCancel}
        style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
        className={`group h-full ease-[cubic-bezier(0.22,1,0.36,1)] transition-all will-change-transform block ${
          isPressed
            ? "scale-[0.985] duration-150 shadow-sm"
            : isReleased
            ? "scale-[1.01] duration-200 shadow-md"
            : "scale-100 duration-[300ms] lg:hover:-translate-y-1 lg:hover:shadow-xl"
        } ${className}`}
      >
        {children}
      </Element>
    </div>
  );
}
