'use client';

import * as React from 'react';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-6 bg-background px-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-red-600">Fatal Error</h1>
            <p className="text-muted-foreground max-w-[500px] mx-auto">
              A critical system error occurred. We apologize for the inconvenience.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Refresh System
          </button>
        </div>
      </body>
    </html>
  );
}
