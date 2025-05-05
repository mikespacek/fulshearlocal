import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fulshear TX Business Directory | Local Shops & Services",
  description: "Comprehensive business directory for Fulshear, Texas. Find local restaurants, shops, services and more in Fulshear, TX. The ultimate local guide for Fulshear residents and visitors.",
  keywords: "Fulshear, TX, Texas, business directory, local business, Fulshear shops, Fulshear restaurants, Fulshear services, local guide",
  metadataBase: new URL('https://fulshearlocal.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Fulshear TX Business Directory | Local Shops & Services",
    description: "Discover the best local businesses in Fulshear, Texas. Your complete guide to shops, restaurants, and services in Fulshear, TX.",
    url: 'https://fulshearlocal.com',
    siteName: 'Fulshear Local',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/social/fulshear-local-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Fulshear Local Business Directory',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fulshear TX Business Directory | Local Shops & Services",
    description: "Find the best local businesses in Fulshear, Texas. Your comprehensive guide to Fulshear, TX.",
    images: ['/images/social/fulshear-local-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    shortcut: ['/favicon.svg'],
    apple: [
      {
        url: '/favicon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
