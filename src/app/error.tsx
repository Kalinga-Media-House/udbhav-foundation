'use client';

import * as React from 'react';

import { clientLogger } from "@/lib/logger/client-logger";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    clientLogger.error('Application Error Boundary Caught Exception', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6 bg-background px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Something went wrong!</h1>
        <p className="text-muted-foreground max-w-[500px] mx-auto">
          An unexpected error occurred. Our team has been notified.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Try again
      </button>
    </div>
  );
}
