import Link from 'next/link';
import * as React from 'react';

import { APPLICATION } from '@/constants/application';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">
              {APPLICATION.BRAND_NAME}
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
            <Link href="/events" className="transition-colors hover:text-foreground/80 text-foreground/60">Events</Link>
            <Link href="/auth/login" className="transition-colors hover:text-foreground/80 text-foreground/60">Sign In</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
