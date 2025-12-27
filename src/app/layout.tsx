import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = "https://nickshirley.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Nick Shirley | Independent Journalist",
    template: "%s | Nick Shirley",
  },
  description: "Nick Shirley is an independent journalist who travels the world to report on current events. Follow his latest stories, videos, and updates.",
  keywords: ["Nick Shirley", "journalist", "independent journalism", "current events", "news", "investigative journalism", "YouTube journalist"],
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
    title: "Nick Shirley | Independent Journalist",
    description: "Independent journalist traveling the world to report on current events.",
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
    title: "Nick Shirley | Independent Journalist",
    description: "Independent journalist traveling the world to report on current events.",
    images: ["/nick.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "google7804ad38c9ce48e7",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">
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
