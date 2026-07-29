import * as React from 'react';

export const LoadingSpinner = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center p-4 ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);
