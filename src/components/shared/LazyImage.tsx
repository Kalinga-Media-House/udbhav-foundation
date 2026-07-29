"use client";

import Image, { ImageProps } from "next/image";
import React, { useState } from "react";

export interface LazyImageProps extends Omit<ImageProps, "onLoad" | "loading"> {
  priority?: boolean;
}

export function LazyImage({ priority = false, className = "", ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      onLoad={() => setIsLoaded(true)}
      className={`transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.015]"
      } ${className}`}
    />
  );
}
