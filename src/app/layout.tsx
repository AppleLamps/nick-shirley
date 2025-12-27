import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nick Shirley | Independent Journalist",
  description: "Nick Shirley is an independent journalist who travels the world to report on current events. Follow his latest stories, videos, and updates.",
  keywords: ["Nick Shirley", "journalist", "independent journalism", "current events", "news"],
  openGraph: {
    title: "Nick Shirley | Independent Journalist",
    description: "Independent journalist traveling the world to report on current events.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nick Shirley | Independent Journalist",
    description: "Independent journalist traveling the world to report on current events.",
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
