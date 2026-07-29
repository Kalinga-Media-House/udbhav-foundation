import Image from "next/image";
import React from "react";

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
  className = "",
  width = 56,
  height = 56,
  priority = false,
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 shrink-0 ${className}`}>
      {/* Primary Organization Identity: UDBHAV Foundation Logo */}
      <div className="relative inline-flex items-center justify-center shrink-0">
        <Image
          src="/brand/udbhav-logo.png"
          alt="UDBHAV Foundation logo"
          width={width}
          height={height}
          priority={priority}
          className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[54px] lg:w-[54px] object-contain shrink-0"
          sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, 54px"
        />
      </div>

      {/* Typography: Responsive */}
      <div className="flex flex-col justify-center">
        {/* Mobile: Inline text */}
        <span className="sm:hidden font-heading font-bold text-udbhav-blue-deep text-lg leading-none tracking-tight">
          UDBHAV Foundation
        </span>
        
        {/* Desktop: Stacked text */}
        <div className="hidden sm:flex flex-col">
          <span className="font-heading font-bold text-udbhav-blue-deep text-xl lg:text-2xl leading-none tracking-tight">
            UDBHAV
          </span>
          <span className="font-heading font-medium text-impact-green text-[13px] lg:text-[15px] leading-tight tracking-wide uppercase mt-0.5">
            Foundation
          </span>
        </div>
      </div>
    </div>
  );
}

export default BrandLogo;
