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
