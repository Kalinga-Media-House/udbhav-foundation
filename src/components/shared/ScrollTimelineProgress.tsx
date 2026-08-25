"use client";

import React, { useEffect, useRef } from "react";

interface ScrollTimelineProgressProps {
  className?: string;
  lineClassName?: string;
  nodeClassName?: string;
}

export function ScrollTimelineProgress({ className, lineClassName, nodeClassName }: ScrollTimelineProgressProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      if (progressRef.current) progressRef.current.style.transform = "scaleY(1)";
      if (nodeRef.current) nodeRef.current.style.display = "none";
      return;
    }

    let ticking = false;

    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress: 0 when top is at 70% of viewport, 1 when bottom is at 40% of viewport.
      const start = viewportHeight * 0.75;
      const end = viewportHeight * 0.35;
      
      const totalScroll = rect.height + (start - end);
      const currentScroll = start - rect.top;
      
      let p = currentScroll / totalScroll;
      p = Math.max(0, Math.min(1, p));
      
      // Update DOM directly for performance
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${p})`;
      }
      if (nodeRef.current) {
        nodeRef.current.style.transform = `translateY(${p * rect.height}px)`;
      }

      // Check nodes in this section to activate them
      const section = containerRef.current.closest("section");
      if (section) {
        const progressY = rect.top + p * rect.height;
        const nodes = section.querySelectorAll<HTMLElement>("[data-timeline-node]");
        
        nodes.forEach(n => {
          const nRect = n.getBoundingClientRect();
          // nodeCenterY relative to the viewport
          const nodeCenterY = nRect.top + nRect.height / 2;
          
          if (progressY >= nodeCenterY) {
            if (n.dataset.timelineNode !== "active") {
                n.dataset.timelineNode = "active";
            }
          } else {
            if (n.dataset.timelineNode !== "inactive") {
                n.dataset.timelineNode = "inactive";
            }
          }
        });
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    
    // Initial checks and observers for late-loading images
    setTimeout(update, 100);
    setTimeout(update, 1000);

    const observer = new ResizeObserver(() => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    });
    
    if (containerRef.current) {
        observer.observe(containerRef.current);
        const section = containerRef.current.closest("section");
        if (section) observer.observe(section);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute z-0 ${className}`}>
      {/* Progress track */}
      <div 
        ref={progressRef}
        className={`absolute top-0 left-[-1px] w-[2px] bg-udbhav-blue-deep origin-top transition-transform duration-75 ease-linear ${lineClassName || ""}`}
        style={{ height: "100%", transform: "scaleY(0)" }}
      />
    </div>
  );
}
