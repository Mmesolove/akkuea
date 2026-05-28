'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React from 'react';

interface Props {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...rest }: Props) {
  return (
    <NextThemeProvider {...(rest as any)}>
      {children}
    </NextThemeProvider>
  );
}

export default ThemeProvider;
