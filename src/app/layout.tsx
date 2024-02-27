import Footer from "@/app/_components/footer";
import { SITE_NAME, SITE_HOST, SITE_DESCRIPTION, AUTHOR_AVATAR } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    icon: [{
      sizes: '32x32',
      url: '/meta/favicon-32x32.png',
    }, {
      sizes: '16x16',
      url: '/meta/favicon-16x16.png',
    }],
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
    <html lang="en">
      <head />
      <UserProvider>
        <body className={inter.className}>
          <div className="min-h-screen">{children}</div>
          <Footer />
          <Analytics />
        </body>
      </UserProvider>
    </html>
  );
}
