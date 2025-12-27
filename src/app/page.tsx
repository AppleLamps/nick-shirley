import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import XFeed from '@/components/XFeed';
import { getPublishedArticles, getFeaturedArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
];

export default async function Home() {
  let featuredArticles = [];
  let latestArticles = [];

  try {
    featuredArticles = await getFeaturedArticles(1);
    latestArticles = await getPublishedArticles(5);
  } catch {
    // Use sample articles if database isn't set up yet
    featuredArticles = sampleArticles.filter(a => a.featured);
    latestArticles = sampleArticles;
  }

  // Use sample data if no articles in database
  if (featuredArticles.length === 0) {
    // featuredArticles = sampleArticles.filter(a => a.featured);
  }
  if (latestArticles.length === 0) {
    // latestArticles = sampleArticles;
  }

  const featuredArticle = featuredArticles[0];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-12">
      {/* Featured Article */}
      {featuredArticle && (
        <section className="mb-16">
          <div className="border-t-4 border-black pt-8">
            <ArticleCard
              title={featuredArticle.title}
              slug={featuredArticle.slug}
              excerpt={featuredArticle.excerpt}
              featuredImage={featuredArticle.featured_image}
              category={featuredArticle.category}
              sourceType={featuredArticle.source_type}
              createdAt={featuredArticle.created_at}
              featured={true}
            />
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Articles Column */}
        <div className="lg:col-span-8">
          <div className="border-t-2 border-black pt-4 mb-8">
            <h2 className="font-sans font-bold text-lg uppercase tracking-wider mb-8">
              Latest Updates
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {latestArticles.slice(0, 5).map((article) => (
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

          <div className="mt-12">
            <Link
              href="/articles"
              className="inline-block font-sans text-base font-bold uppercase tracking-wider border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>

        {/* Sidebar with Live Feeds */}
        <div className="lg:col-span-4 space-y-12">
          {/* Nick's Popular Posts */}
          <XFeed
            type="posts"
            title="Nick's Popular Posts"
            refreshInterval={30 * 60 * 1000}
            maxHeight={600}
          />

          {/* Mentions Feed */}
          <XFeed
            type="mentions"
            title="What People Are Saying"
            refreshInterval={30 * 60 * 1000}
            maxHeight={600}
          />
        </div>
      </div>

      {/* About Section */}
      <section className="mt-24 border-t-4 border-black pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-headline">About Nick Shirley</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-xl font-serif">
              Nick Shirley is an independent journalist who travels the world to report
              on current events. With a commitment to on-the-ground reporting and
              unfiltered storytelling, Nick brings you the stories that matter most.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed text-xl font-serif">
              Follow his journey on YouTube and X for real-time updates, in-depth
              documentaries, and behind-the-scenes content from locations around the globe.
            </p>
            <Link
              href="/about"
              className="inline-block font-sans text-base font-bold uppercase tracking-wider underline hover:no-underline"
            >
              Read Full Bio
            </Link>
          </div>
          <div className="flex gap-6 justify-center md:justify-end">
            <a
              href="https://youtube.com/@nickshirley"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-sans text-base font-bold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube
            </a>
            <a
              href="https://x.com/nickshirleyy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-sans text-base font-bold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow on X
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
