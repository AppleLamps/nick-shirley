import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'In the News | Nick Shirley',
  description: 'Recent media coverage and news articles about independent journalist Nick Shirley. See what news outlets are saying about his investigative reporting.',
  openGraph: {
    title: 'In the News | Nick Shirley',
    description: 'Recent media coverage and news articles about independent journalist Nick Shirley.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'In the News | Nick Shirley',
    description: 'Recent media coverage and news articles about independent journalist Nick Shirley.',
  },
};

export default function InTheNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
