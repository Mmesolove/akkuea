'use client';

/**
 * Providers Component
 * 
 * Centralizes all application providers including wallet providers.
 * This component wraps the application with necessary context providers.
 */

import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { PollarProvider } from '@pollar/react';
import { PollarWrapper } from '@/components/auth/PollarWrapper';
import { Toaster } from 'sonner';
import '@pollar/react/styles.css';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const pollarApiKey = process.env.NEXT_PUBLIC_POLLAR_API_KEY;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Pollar Provider - wraps with Pollar context */}
      {pollarApiKey ? (
        <PollarProvider
          config={{
            apiKey: pollarApiKey,
            stellarNetwork: 'testnet', // Use testnet by default
          }}
        >
          <PollarWrapper>
            {children}
            <Toaster />
          </PollarWrapper>
        </PollarProvider>
      ) : (
        <>
          {children}
          <Toaster />
        </>
      )}
    </ThemeProvider>
  );
}
