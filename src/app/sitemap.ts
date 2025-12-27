import { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/lib/db';

const BASE_URL = 'https://nickshirley.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/live-feed`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.7,
    },
  ];

  let articlePages: MetadataRoute.Sitemap = [];

  try {
    const articles = await getPublishedArticles(100);
    articlePages = articles.map((article) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // Database not available, return only static pages
  }

  return [...staticPages, ...articlePages];
}
