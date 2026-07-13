"use client";

import React from "react";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { ANNOUNCEMENTS } from "@/data/news-data";

export function AnnouncementTickerSection() {
  const notices = ANNOUNCEMENTS;

  if (notices.length === 0) return null;

  const renderNoticeItems = (keyPrefix: string) =>
    notices.map((notice, idx) => {
      const content = (
        <span className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-white/95 hover:text-[#EEF8E9] transition-colors whitespace-nowrap">
          <span className="ticker-dot w-1.5 h-1.5 rounded-full bg-[#439B25] shrink-0" />
          <span>{notice.text}</span>
          {notice.linkUrl && (
            <ChevronRight className="w-3.5 h-3.5 text-[#439B25] shrink-0" />
          )}
        </span>
      );

      return (
        <div
          key={`${keyPrefix}-${notice.id}-${idx}`}
          className="ticker-item inline-flex items-center px-5 sm:px-6 shrink-0"
        >
          {notice.linkUrl ? (
            notice.linkUrl.startsWith("#") ? (
              <a
                href={notice.linkUrl}
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#439B25] focus-visible:underline rounded"
              >
                {content}
              </a>
            ) : (
              <Link
                href={notice.linkUrl}
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#439B25] focus-visible:underline rounded"
              >
                {content}
              </Link>
            )
          ) : (
            content
          )}
        </div>
      );
    });

  return (
    <div
      aria-label="Latest UDBHAV Foundation updates"
      className="latest-update-ticker w-full bg-[#12245F] text-white border-b border-white/10 overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes latestUpdatePulse {
          0%,
          100% {
            opacity: 1;
            filter: brightness(1);
            box-shadow: 0 0 0 rgba(67, 155, 37, 0);
          }
          50% {
            opacity: 0.68;
            filter: brightness(1.18);
            box-shadow: 0 0 12px rgba(67, 155, 37, 0.5);
          }
        }

        @keyframes latestTickerScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .latest-update-label {
          animation: latestUpdatePulse 1.4s ease-in-out infinite;
        }

        .ticker-viewport {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          touch-action: pan-y;
        }

        .ticker-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: latestTickerScroll 30s linear infinite;
        }

        .ticker-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .ticker-track {
            animation-duration: 24s;
          }
        }

        @media (hover: hover) and (pointer: fine) {
          .ticker-viewport:hover .ticker-track {
            animation-play-state: paused;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .latest-update-label {
            animation: none !important;
          }
          .ticker-track {
            animation: none !important;
          }
          .ticker-viewport {
            overflow-x: auto;
          }
        }
      `}} />

      <div className="flex items-center h-10 sm:h-11">
        {/* Fixed Left Badge */}
        <div className="latest-update-label shrink-0 flex items-center gap-1.5 px-3 sm:px-4 h-full font-heading text-xs sm:text-sm font-bold uppercase tracking-wider z-10 bg-[#439B25] text-white shadow-md">
          <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse shrink-0" />
          <span className="whitespace-nowrap">LATEST UPDATE</span>
        </div>

        {/* Seamless Infinite Ticker Viewport */}
        <div className="ticker-viewport h-full flex items-center">
          <div className="ticker-track">
            {/* First notice group */}
            <div className="ticker-group">
              {renderNoticeItems("group1")}
            </div>

            {/* Exact duplicate notice group for seamless continuous loop */}
            <div className="ticker-group" aria-hidden="true">
              {renderNoticeItems("group2")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementTickerSection;
