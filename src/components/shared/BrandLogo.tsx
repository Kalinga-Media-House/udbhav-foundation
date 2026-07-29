import Image from 'next/image';
import React from 'react';

export interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Reusable BrandLogo component supporting primary UDBHAV Foundation identity.
 * Desktop: Stacked text (UDBHAV Foundation).
 * Mobile: Inline text (UDBHAV Foundation).
 */
export function BrandLogo({
  className = '',
  width = 56,
  height = 56,
  priority = false,
}: BrandLogoProps) {
  return (
    <div className={`flex shrink-0 items-center gap-2 sm:gap-3 ${className}`}>
      {/* Primary Organization Identity: UDBHAV Foundation Logo */}
      <div className="relative inline-flex shrink-0 items-center justify-center">
        <Image
          src="/brand/udbhav-logo.png"
          alt="UDBHAV Foundation logo"
          width={width}
          height={height}
          priority={priority}
          className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12 lg:h-[54px] lg:w-[54px]"
          sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, 54px"
        />
      </div>

      {/* Typography: Stacked for all viewports */}
      <div className="flex flex-col justify-center">
        <span className="text-udbhav-blue-deep font-heading text-lg font-bold leading-none tracking-tight sm:text-xl lg:text-2xl">
          UDBHAV
        </span>
        <span className="text-impact-green mt-0.5 font-heading text-[11px] font-medium uppercase leading-tight tracking-wide sm:text-[13px] lg:text-[15px]">
          FOUNDATION
        </span>
      </div>
    </div>
  );
}

export default BrandLogo;
