import Footer from '@/app/_components/footer';
import {
  SITE_NAME,
  SITE_HOST,
  SITE_DESCRIPTION,
  AUTHOR_AVATAR,
  GTM_ID,
} from '@/lib/constants';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManager } from '@next/third-parties/google';
import Providers from './providers';

import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_HOST),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_HOST,
    siteName: SITE_NAME,
    images: [AUTHOR_AVATAR],
    locale: 'zh_CN',
    type: 'website',
  },
  icons: {
    icon: [
      {
        sizes: '32x32',
        url: '/meta/favicon-32x32.png',
      },
      {
        sizes: '16x16',
        url: '/meta/favicon-16x16.png',
      },
    ],
    shortcut: '/meta/favicon.ico',
    apple: '/meta/apple-touch-icon.png',
  },
  manifest: '/meta/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas font-sans text-ink antialiased dark:bg-carbon dark:text-carbon-text">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
        <SpeedInsights />
        <Analytics />
        <GoogleTagManager gtmId={GTM_ID} />
      </body>
    </html>
  );
}
