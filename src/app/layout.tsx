import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";

const BASE_URL = "https://nickshirley.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Nick Shirley | Independent Journalist & YouTuber",
    template: "%s | Nick Shirley",
  },
  description: "Nick Shirley (@nickshirley) is an independent journalist and YouTuber who travels the world to report on current events. Watch his latest investigative documentaries, stories, and real-time updates.",
  keywords: [
    "Nick Shirley",
    "Nick Shirley journalist",
    "Nick Shirley YouTube",
    "nickshirley",
    "@nickshirley",
    "independent journalist",
    "investigative journalism",
    "YouTube journalist",
    "current events",
    "documentary filmmaker",
    "on the ground reporting",
  ],
  authors: [{ name: "Nick Shirley", url: `${BASE_URL}/about` }],
  creator: "Nick Shirley",
  publisher: "Nick Shirley",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Nick Shirley",
    title: "Nick Shirley | Independent Journalist & YouTuber",
    description: "Independent journalist and YouTuber traveling the world to report on current events through investigative documentaries.",
    images: [
      {
        url: "/nick.jpg",
        width: 1200,
        height: 630,
        alt: "Nick Shirley - Independent Journalist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nickshirleyy",
    creator: "@nickshirleyy",
    title: "Nick Shirley | Independent Journalist & YouTuber",
    description: "Independent journalist traveling the world to report on current events.",
    images: ["/nick.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "google7804ad38c9ce48e7",
  },
  other: {
    "google-site-verification": "google7804ad38c9ce48e7",
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
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className="antialiased bg-white">
        <OrganizationJsonLd />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
