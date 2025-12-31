import ArticleCard from '@/components/ArticleCard';
import { getPublishedArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Latest Articles & News Updates | Nick Shirley - Independent Journalist',
  description: 'Read the latest articles, breaking news updates, and investigative reports from independent journalist and reporter Nick Shirley. Stay current with his newest stories and real-time coverage.',
  keywords: [
    'Nick Shirley latest',
    'Nick Shirley news',
    'Nick Shirley articles',
    'Nick Shirley updates',
    'Nick Shirley reports',
    'nickshirley latest',
    'Nick Shirley journalist latest',
    'Nick Shirley reporter latest',
  ],
  openGraph: {
    title: 'Latest Articles & Updates from Nick Shirley',
    description: 'Read the latest investigative reports and breaking news from independent journalist Nick Shirley.',
    url: 'https://nickshirley.vercel.app/articles',
    type: 'website',
    images: [
      {
        url: '/nick.jpg',
        width: 1200,
        height: 630,
        alt: 'Nick Shirley - Latest Articles and News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Articles from Nick Shirley',
    description: 'Breaking news and investigative reports from independent journalist Nick Shirley.',
    images: ['/nick.jpg'],
  },
};

// Sample articles for initial display when database is empty
const sampleArticles = [
  {
    id: 1,
    title: "On the Ground: Reporting from the Front Lines of Global Events",
    slug: "on-the-ground-reporting",
    excerpt: "A look at what it takes to be an independent journalist in today's rapidly changing media landscape.",
    featured_image: null,
    category: "update",
    source_type: "original",
    source_url: null,
    published: true,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Latest YouTube Documentary: Behind the Scenes",
    slug: "latest-youtube-documentary",
    excerpt: "The making of the newest investigative piece, from research to final edit.",
    featured_image: null,
    category: "video",
    source_type: "youtube",
    source_url: "https://youtube.com/@nickshirley",
    published: true,
    featured: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Breaking Down the Week's Top Stories",
    slug: "breaking-down-weeks-stories",
    excerpt: "Analysis and commentary on the major events shaping our world this week.",
    featured_image: null,
    category: "analysis",
    source_type: "original",
    source_url: null,
    published: true,
    featured: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    title: "X Thread: Live Updates from the Field",
    slug: "x-thread-live-updates",
    excerpt: "Real-time reporting compiled from X posts during breaking news coverage.",
    featured_image: null,
    category: "live",
    source_type: "x_post",
    source_url: "https://x.com/nickshirley",
    published: true,
    featured: false,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 5,
    title: "Interview: Perspectives from Local Voices",
    slug: "interview-local-voices",
    excerpt: "Conversations with people affected by the stories that make headlines.",
    featured_image: null,
    category: "interview",
    source_type: "original",
    source_url: null,
    published: true,
    featured: false,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString(),
  },
];

export default async function ArticlesPage() {
  let articles = [];

  try {
    articles = await getPublishedArticles(50);
  } catch {
    // Use sample articles if database isn't set up yet
    articles = sampleArticles;
  }

  // Use sample data if no articles in database
  if (articles.length === 0) {
    // articles = sampleArticles;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="border-t-4 border-black pt-8 mb-12">
        <h1 className="text-3xl font-bold mb-3 font-headline">Articles</h1>
        <p className="text-base text-gray-600 font-sans">
          Latest updates, reports, and stories from around the world.
        </p>
      </div>

      {/* Articles List */}
      <div className="divide-y divide-gray-200">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            slug={article.slug}
            excerpt={article.excerpt}
            featuredImage={article.featured_image}
            category={article.category}
            sourceType={article.source_type}
            createdAt={article.created_at}
          />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-500 font-sans text-base">No articles available yet.</p>
        </div>
      )}
    </div>
  );
}
