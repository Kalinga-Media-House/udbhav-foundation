'use client';

import * as React from 'react';

import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';

interface RootProvidersProps {
  children: React.ReactNode;
}

/**
 * Global provider wrapper.
 * Add QueryProvider, ToastProvider, ModalProvider here in the future.
 */
export const RootProviders = ({ children }: RootProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};
