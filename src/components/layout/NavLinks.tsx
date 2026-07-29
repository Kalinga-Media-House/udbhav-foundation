"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { MAIN_NAV_ITEMS } from "@/data/navigation";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1 xl:gap-2">
      {MAIN_NAV_ITEMS.map((item) => {
        // Exact match for "/", prefix match for nested routes like "/programmes/programme-name"
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href} className="flex items-center">
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "text-udbhav-blue font-semibold bg-soft-green/70"
                  : "text-text-primary hover:text-udbhav-blue hover:bg-soft-green/30"
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-impact-green"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default NavLinks;
