import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "LocallySF — Discover San Francisco's Best",
  description: "The complete guide to San Francisco's best restaurants, cafes, bars, shopping, and attractions. Real reviews, real photos, real local insights.",
  keywords: "San Francisco, restaurants, bars, cafes, shopping, attractions, local guide, directory",
  authors: [{ name: "LocallySF" }],
  creator: "LocallySF",
  publisher: "LocallySF",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://locallysf.com'),
  openGraph: {
    title: "LocallySF — Discover San Francisco's Best",
    description: "The complete guide to San Francisco's best restaurants, cafes, bars, shopping, and attractions.",
    url: 'https://locallysf.com',
    siteName: 'LocallySF',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'San Francisco Golden Gate Bridge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "LocallySF — Discover San Francisco's Best",
    description: "The complete guide to San Francisco's best restaurants, cafes, bars, shopping, and attractions.",
    images: ['https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}