'use client';

import { THEME } from '@/lib/constants';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <NextUIProvider>
        <NextThemesProvider
          attribute="class"
          themes={[THEME.LIGHT, THEME.DARK]}
        >
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </UserProvider>
  );
}
