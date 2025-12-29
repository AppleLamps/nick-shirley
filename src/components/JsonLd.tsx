interface PersonJsonLdProps {
  name: string;
  description: string;
  url: string;
  image: string;
  sameAs: string[];
  jobTitle: string;
}

export function PersonJsonLd({ name, description, url, image, sameAs, jobTitle }: PersonJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description,
    url,
    image,
    sameAs,
    jobTitle,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebSiteJsonLdProps {
  name: string;
  url: string;
  description: string;
}

export function WebSiteJsonLd({ name, url, description }: WebSiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    publisher: {
      '@type': 'Person',
      name: 'Nick Shirley',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    image: image || 'https://nickshirley.vercel.app/nick.jpg',
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://nickshirley.vercel.app/about',
    },
    publisher: {
      '@type': 'Person',
      name: 'Nick Shirley',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nickshirley.vercel.app/nick.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Breadcrumb Schema for better navigation display in search results
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// VideoObject Schema for YouTube videos
interface VideoJsonLdProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl?: string;
  contentUrl?: string;
}

export function VideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  embedUrl,
  contentUrl,
}: VideoJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    ...(embedUrl && { embedUrl }),
    ...(contentUrl && { contentUrl }),
    author: {
      '@type': 'Person',
      name: 'Nick Shirley',
      url: 'https://nickshirley.vercel.app/about',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Organization/Person Schema with enhanced details
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://nickshirley.vercel.app/#person',
    name: 'Nick Shirley',
    alternateName: ['@nickshirley', '@nickshirleyy', 'nickshirley'],
    description: 'Nick Shirley is an independent journalist and YouTuber who travels the world to report on current events through investigative documentaries and on-the-ground reporting.',
    url: 'https://nickshirley.vercel.app',
    image: {
      '@type': 'ImageObject',
      url: 'https://nickshirley.vercel.app/nick.jpg',
      width: 1200,
      height: 630,
    },
    jobTitle: 'Independent Journalist',
    knowsAbout: ['Journalism', 'Investigative Reporting', 'Documentary Filmmaking', 'Current Events', 'International News'],
    sameAs: [
      'https://youtube.com/@nickshirley',
      'https://x.com/nickshirleyy',
      'https://instagram.com/nickshirley',
      'https://facebook.com/profile.php?id=61555695281120',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// FAQ Schema for common questions (helps with "has nick shirley vanished" queries)
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  items: FAQItem[];
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
