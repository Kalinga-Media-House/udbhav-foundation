import React from "react";
import Image from "next/image";

export type BrandLogoVariant = "udbhav" | "usfact" | "dual";

export interface BrandLogoProps {
  className?: string;
  variant?: BrandLogoVariant;
  /** When true, renders the dual institutional identity (UDBHAV primary + US FACT secondary) */
  showPartnerLogo?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Reusable BrandLogo component supporting primary UDBHAV Foundation identity
 * as well as dual-brand navigation display alongside US FACT partner identity.
 *
 * Preserves exact original aspect ratios:
 * - UDBHAV Foundation: 1080x1080 (1:1 square primary identity)
 * - US FACT: 3493x1080 (3.23:1 horizontal partner identity)
 */
export function BrandLogo({
  className = "",
  variant = "udbhav",
  showPartnerLogo = false,
  width = 56,
  height = 56,
  priority = false,
}: BrandLogoProps) {
  const isDual = variant === "dual" || showPartnerLogo;

  if (isDual) {
    return (
      <div
        className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}
      >
        {/* Primary Organization Identity: UDBHAV Foundation (1:1 square, slightly primary) */}
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

        {/* Refined Institutional Separator (1px wide, soft border, vertically centered) */}
        <span
          aria-hidden="true"
          className="h-6 sm:h-8 lg:h-[38px] w-[1px] bg-soft-border shrink-0"
        />

        {/* Associated Partner Identity: US FACT (3.23:1 horizontal, optically balanced) */}
        <div className="relative inline-flex items-center justify-center shrink-0">
          <Image
            src="/brand/usfact-logo.png"
            alt="US FACT logo"
            width={142}
            height={44}
            priority={priority}
            className="h-6 w-auto sm:h-7 lg:h-[44px] object-contain shrink-0 opacity-95"
            sizes="(max-width: 640px) 78px, (max-width: 1024px) 96px, 142px"
          />
        </div>
      </div>
    );
  }

  if (variant === "usfact") {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      >
        <Image
          src="/brand/usfact-logo.png"
          alt="US FACT logo"
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-auto object-contain"
          sizes="(max-width: 768px) 96px, 120px"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <Image
        src="/brand/udbhav-logo.png"
        alt="UDBHAV Foundation logo"
        width={width}
        height={height}
        priority={priority}
        className="h-auto w-auto object-contain"
        sizes="(max-width: 768px) 48px, 64px"
      />
    </div>
  );
}

export default BrandLogo;
