import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getArticleBySlug } from '@/lib/db';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleJsonLd } from '@/components/JsonLd';

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
    content: `Independent journalism is more important than ever in today's rapidly evolving media landscape. As an independent journalist, I've had the privilege of traveling to some of the world's most significant locations to bring you stories that matter.

The work isn't easy. It requires **dedication**, *careful planning*, and a commitment to accuracy above all else. Every story begins with research, followed by on-the-ground reporting that can take days, weeks, or even months to complete.

## Why Independent Journalism Matters

In an era of instant news and social media, taking the time to verify facts, speak with multiple sources, and provide context has become increasingly rare. Independent journalists fill this crucial gap by prioritizing truth over speed.

The stories I cover aren't always the ones making headlines, but they're the ones that need to be told. From conflict zones to community gatherings, every story offers a window into the human experience.

## What's Next

I'm currently preparing for my next reporting trip, which will take me to regions that rarely receive international coverage. Stay tuned to my YouTube channel and X for updates as the journey unfolds.

Thank you for supporting independent journalism. Your engagement makes this work possible.`,
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
    content: `Creating a documentary is a journey that begins long before the cameras start rolling. For this latest piece, months of research laid the groundwork for what would become one of my most challenging projects yet.

The process involves:

*   Countless interviews
*   Hours of footage
*   Careful editing to ensure the story is told accurately and compellingly

Every frame matters, every word counts.

## The Research Phase

Before traveling to the location, I spent weeks gathering information, speaking with experts, and building connections with local contacts. This preparation is essential for telling a complete story.

## Watch the Documentary

The full documentary is now available on my YouTube channel. I hope it provides insight into a topic that deserves more attention.`,
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
    content: `This week has been marked by significant developments across multiple regions. Here's my analysis of what's happening and what it means for the broader picture.

## Story One

The first major development involves ongoing events that have been building for months. Context is crucial here—understanding the history helps make sense of current actions.

## Story Two

Meanwhile, attention has also turned to a separate but equally important situation. The international response has been mixed, with various stakeholders taking different positions.

> "The coming weeks will be critical."

## Looking Ahead

I'll continue monitoring these situations and providing updates through my channels. For real-time coverage, follow me on X.`,
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
      title: 'Article Not Found',
    };
  }

  const articleUrl = `https://nickshirley.vercel.app/articles/${slug}`;
  const description = article.excerpt || 'Read the full article from Nick Shirley.';
  const imageUrl = article.featured_image || 'https://nickshirley.vercel.app/nick.jpg';

  return {
    title: article.title,
    description,
    authors: [{ name: 'Nick Shirley' }],
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      url: articleUrl,
      publishedTime: new Date(article.created_at).toISOString(),
      modifiedTime: new Date(article.updated_at).toISOString(),
      authors: ['Nick Shirley'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: articleUrl,
    },
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
    // article = sampleArticles[slug] || null;
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

  const articleUrl = `https://nickshirley.vercel.app/articles/${slug}`;

  return (
    <>
      <ArticleJsonLd
        headline={article.title}
        description={article.excerpt || 'Read the full article from Nick Shirley.'}
        url={articleUrl}
        image={article.featured_image || undefined}
        datePublished={new Date(article.created_at).toISOString()}
        dateModified={new Date(article.updated_at).toISOString()}
        authorName="Nick Shirley"
      />
      <article className="max-w-[1000px] mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 font-sans text-sm text-gray-500">
        <Link href="/" className="hover:text-black">Home</Link>
        <span className="mx-3">/</span>
        <Link href="/articles" className="hover:text-black">Articles</Link>
        <span className="mx-3">/</span>
        <span className="text-black">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-sans text-sm font-bold uppercase tracking-wider text-gray-500">
            {article.category}
          </span>
          {article.source_type && (
            <>
              <span className="text-gray-300">|</span>
              <span className="font-sans text-sm text-gray-500">
                via {article.source_type === 'youtube' ? 'YouTube' : article.source_type === 'x_post' ? 'X' : 'Original'}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6 font-headline">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 font-serif italic">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 font-sans text-sm text-gray-500 border-t border-b border-gray-200 py-4">
          <span className="font-bold text-black">By Nick Shirley</span>
          <span>|</span>
          <time>{formattedDate}</time>
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="relative aspect-video mb-12 bg-gray-100">
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
        <div className="mb-12">
          <YouTubeEmbed videoId={youtubeVideoId} title={article.title} />
        </div>
      )}

      {/* Article Content */}
      <div className="article-content prose prose-base max-w-none font-serif">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>

      {/* Source Link */}
      {article.source_url && (
        <div className="mt-12 pt-8 border-t border-gray-200">
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
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="font-sans font-bold text-sm uppercase tracking-wider mb-4">
          Share this article
        </h3>
        <div className="flex gap-4">
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 font-sans text-sm font-bold"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-16">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 font-sans text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wider"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all articles
        </Link>
        </div>
      </article>
    </>
  );
}
