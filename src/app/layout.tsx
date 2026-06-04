import Footer from '@/app/_components/footer';
import { SITE_NAME, SITE_HOST, AUTHOR_AVATAR, GTM_ID } from '@/lib/constants';
import {
  HTML_LANG,
  OG_LOCALE,
  canonicalize,
  getMessages,
  localePath,
} from '@/lib/i18n';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { headers } from 'next/headers';
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

function resolveLocaleFromHeaders() {
  const path = headers().get('x-pathname') || '/';
  return canonicalize(path);
}

export function generateMetadata(): Metadata {
  const { locale, canonical } = resolveLocaleFromHeaders();
  const t = getMessages(locale);
  const oppositeLocale = locale === 'zh' ? 'en' : 'zh';

  return {
    metadataBase: new URL(SITE_HOST),
    title: SITE_NAME,
    description: t.siteDescription,
    openGraph: {
      title: SITE_NAME,
      description: t.siteDescription,
      url: localePath(locale, canonical),
      siteName: SITE_NAME,
      images: [AUTHOR_AVATAR],
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[oppositeLocale]],
      type: 'website',
    },
    alternates: {
      canonical: localePath(locale, canonical),
      languages: {
        'zh-Hans': localePath('zh', canonical),
        en: localePath('en', canonical),
        'x-default': localePath('zh', canonical),
      },
      types: {
        'application/rss+xml': [
          { url: localePath(locale, '/feed.xml'), title: `${SITE_NAME} RSS` },
        ],
      },
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale } = resolveLocaleFromHeaders();
  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas font-sans text-ink antialiased dark:bg-carbon dark:text-carbon-text">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <Footer locale={locale} />
          </div>
        </Providers>
        <SpeedInsights />
        <Analytics />
        <GoogleTagManager gtmId={GTM_ID} />
      </body>
    </html>
  );
}
