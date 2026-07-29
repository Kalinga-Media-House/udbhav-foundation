import * as React from 'react';

export const MinimalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
};
