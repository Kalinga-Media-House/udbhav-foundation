import * as React from 'react';

import { Footer } from '../navigation/footer';
import { Header } from '../navigation/header';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
