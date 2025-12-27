import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getArticleBySlug } from '@/lib/db';
import YouTubeEmbed from '@/components/YouTubeEmbed';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

// Sample articles for when database is not set up
const sampleArticles: Record<string, {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string;
  source_type: string | null;
  source_url: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}> = {
  'on-the-ground-reporting': {
    id: 1,
    title: "On the Ground: Reporting from the Front Lines of Global Events",
    slug: "on-the-ground-reporting",
    excerpt: "A look at what it takes to be an independent journalist in today's rapidly changing media landscape.",
    content: `
<p>Independent journalism is more important than ever in today's rapidly evolving media landscape. As an independent journalist, I've had the privilege of traveling to some of the world's most significant locations to bring you stories that matter.</p>

<p>The work isn't easy. It requires dedication, careful planning, and a commitment to accuracy above all else. Every story begins with research, followed by on-the-ground reporting that can take days, weeks, or even months to complete.</p>

<h2>Why Independent Journalism Matters</h2>

<p>In an era of instant news and social media, taking the time to verify facts, speak with multiple sources, and provide context has become increasingly rare. Independent journalists fill this crucial gap by prioritizing truth over speed.</p>

<p>The stories I cover aren't always the ones making headlines, but they're the ones that need to be told. From conflict zones to community gatherings, every story offers a window into the human experience.</p>

<h2>What's Next</h2>

<p>I'm currently preparing for my next reporting trip, which will take me to regions that rarely receive international coverage. Stay tuned to my YouTube channel and X for updates as the journey unfolds.</p>

<p>Thank you for supporting independent journalism. Your engagement makes this work possible.</p>
    `,
    featured_image: null,
    category: "update",
    source_type: "original",
    source_url: null,
    published: true,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  'latest-youtube-documentary': {
    id: 2,
    title: "Latest YouTube Documentary: Behind the Scenes",
    slug: "latest-youtube-documentary",
    excerpt: "The making of the newest investigative piece, from research to final edit.",
    content: `
<p>Creating a documentary is a journey that begins long before the cameras start rolling. For this latest piece, months of research laid the groundwork for what would become one of my most challenging projects yet.</p>

<p>The process involves countless interviews, hours of footage, and careful editing to ensure the story is told accurately and compellingly. Every frame matters, every word counts.</p>

<h2>The Research Phase</h2>

<p>Before traveling to the location, I spent weeks gathering information, speaking with experts, and building connections with local contacts. This preparation is essential for telling a complete story.</p>

<h2>Watch the Documentary</h2>

<p>The full documentary is now available on my YouTube channel. I hope it provides insight into a topic that deserves more attention.</p>
    `,
    featured_image: null,
    category: "video",
    source_type: "youtube",
    source_url: "https://youtube.com/@nickshirley",
    published: true,
    featured: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  'breaking-down-weeks-stories': {
    id: 3,
    title: "Breaking Down the Week's Top Stories",
    slug: "breaking-down-weeks-stories",
    excerpt: "Analysis and commentary on the major events shaping our world this week.",
    content: `
<p>This week has been marked by significant developments across multiple regions. Here's my analysis of what's happening and what it means for the broader picture.</p>

<h2>Story One</h2>

<p>The first major development involves ongoing events that have been building for months. Context is crucial here—understanding the history helps make sense of current actions.</p>

<h2>Story Two</h2>

<p>Meanwhile, attention has also turned to a separate but equally important situation. The international response has been mixed, with various stakeholders taking different positions.</p>

<h2>Looking Ahead</h2>

<p>The coming weeks will be critical. I'll continue monitoring these situations and providing updates through my channels. For real-time coverage, follow me on X.</p>
    `,
    featured_image: null,
    category: "analysis",
    source_type: "original",
    source_url: null,
    published: true,
    featured: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  let article;

  try {
    article = await getArticleBySlug(slug);
  } catch {
    article = sampleArticles[slug] || null;
  }

  if (!article) {
    article = sampleArticles[slug] || null;
  }

  if (!article) {
    return {
      title: 'Article Not Found | Nick Shirley',
    };
  }

  return {
    title: `${article.title} | Nick Shirley`,
    description: article.excerpt || 'Read the full article from Nick Shirley.',
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article;

  try {
    article = await getArticleBySlug(slug);
  } catch {
    article = sampleArticles[slug] || null;
  }

  // Use sample article if not in database
  if (!article) {
    article = sampleArticles[slug] || null;
  }

  if (!article) {
    notFound();
  }

  const date = typeof article.created_at === 'string'
    ? new Date(article.created_at)
    : article.created_at;
  const formattedDate = format(date, 'MMMM d, yyyy');

  // Extract YouTube video ID if source is YouTube
  const youtubeVideoId = article.source_type === 'youtube' && article.source_url
    ? article.source_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/)?.[1]
    : null;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 font-sans text-sm text-gray-500">
        <Link href="/" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/articles" className="hover:text-black">Articles</Link>
        <span className="mx-2">/</span>
        <span className="text-black">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">
            {article.category}
          </span>
          {article.source_type && (
            <>
              <span className="text-gray-300">|</span>
              <span className="font-sans text-xs text-gray-500">
                via {article.source_type === 'youtube' ? 'YouTube' : article.source_type === 'x_post' ? 'X' : 'Original'}
              </span>
            </>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 font-sans text-sm text-gray-500">
          <span>By Nick Shirley</span>
          <span>|</span>
          <time>{formattedDate}</time>
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="relative aspect-video mb-8 bg-gray-100">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* YouTube Embed */}
      {youtubeVideoId && (
        <div className="mb-8">
          <YouTubeEmbed videoId={youtubeVideoId} title={article.title} />
        </div>
      )}

      {/* Article Content */}
      <div
        className="article-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Source Link */}
      {article.source_url && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm font-bold text-black hover:underline"
          >
            View original on {article.source_type === 'youtube' ? 'YouTube' : 'X'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      {/* Share Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="font-sans font-bold text-sm uppercase tracking-wider mb-4">
          Share this article
        </h3>
        <div className="flex gap-4">
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 font-sans text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Share on X
          </a>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-12">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 font-sans text-sm text-gray-600 hover:text-black"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all articles
        </Link>
      </div>
    </article>
  );
}
