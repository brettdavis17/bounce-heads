import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trampoline Parks Directory | Find the Best Trampoline Parks in the US",
  description: "Discover the best trampoline parks across the United States. Find locations, hours, pricing, and reviews for family-friendly bouncing fun near you.",
  keywords: "trampoline parks, family fun, indoor activities, bouncing, kids activities, birthday parties, exercise, recreation centers, trampoline fitness, aerial sports, family entertainment, indoor playgrounds, bounce houses, foam pits, dodgeball courts, ninja courses",
  authors: [{ name: "Trampoline Parks Directory" }],
  creator: "Trampoline Parks Directory",
  publisher: "Trampoline Parks Directory",
  applicationName: "Trampoline Parks Directory",
  generator: "Next.js",
  category: "Recreation",
  classification: "Family Entertainment Directory",
  openGraph: {
    title: "Trampoline Parks Directory - Find Fun Near You",
    description: "Discover the best trampoline parks across the United States with locations, pricing, and reviews.",
    url: "https://trampolineparks.directory",
    siteName: "Trampoline Parks Directory",
    images: [
      {
        url: "https://trampolineparks.directory/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Trampoline Parks Directory - Find the Best Trampoline Parks",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trampoline Parks Directory",
    description: "Find the best trampoline parks in the US with our comprehensive directory.",
    images: ["https://trampolineparks.directory/twitter-image.jpg"],
    creator: "@trampolineparks",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://trampolineparks.directory",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://trampolineparks.directory" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        <meta name="language" content="en" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Trampoline Parks Directory",
                "description": "Find the best trampoline parks across the United States",
                "url": "https://trampolineparks.directory",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://trampolineparks.directory/directory?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Trampoline Parks Directory",
                  "url": "https://trampolineparks.directory"
                },
                "inLanguage": "en-US"
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Trampoline Parks Directory",
                "url": "https://trampolineparks.directory",
                "description": "The most comprehensive directory of trampoline parks across the United States",
                "foundingDate": "2024",
                "knowsAbout": [
                  "Trampoline Parks",
                  "Family Entertainment",
                  "Indoor Recreation",
                  "Birthday Parties",
                  "Fitness Activities",
                  "Kids Activities"
                ],
                "areaServed": {
                  "@type": "Country",
                  "name": "United States"
                },
                "serviceType": "Recreation Directory Service"
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Best Trampoline Parks in the United States",
                "description": "A comprehensive list of the best trampoline parks across America",
                "url": "https://trampolineparks.directory/directory",
                "numberOfItems": "100+",
                "itemListOrder": "https://schema.org/ItemListOrderAscending"
              }
            ])
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
