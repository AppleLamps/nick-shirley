import { neon } from '@neondatabase/serverless';

// Create a SQL query function using Neon serverless driver
// This is safe to use in serverless environments like Vercel
export const sql = neon(process.env.DATABASE_URL!);

// Type definitions for database models
export interface Article {
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
  created_at: Date;
  updated_at: Date;
}

export interface XPost {
  id: number;
  post_id: string;
  content: string;
  author_username: string;
  author_name: string | null;
  author_avatar: string | null;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  media_urls: string[] | null;
  posted_at: Date;
  fetched_at: Date;
}

export interface XMention {
  id: number;
  post_id: string;
  content: string;
  author_username: string;
  author_name: string | null;
  author_avatar: string | null;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  posted_at: Date;
  fetched_at: Date;
}

export interface YouTubeVideo {
  id: number;
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  published_at: Date;
  view_count: number;
  like_count: number;
  summary: string | null;
  fetched_at: Date;
}

export interface TranscriptSegment {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface YouTubeTranscript {
  id: number;
  video_id: string;
  full_text: string;
  segments: TranscriptSegment[];
  duration_seconds: number | null;
  created_at: Date;
}

export interface NewsArticle {
  id: number;
  article_url: string;
  title: string;
  summary: string | null;
  source: string;
  published_at: Date | null;
  fetched_at: Date;
}

export interface NewsSearchMetadata {
  id: number;
  summary: string;
  citations: string[] | null;
  fetched_at: Date;
}

// Database query helpers
export async function getPublishedArticles(limit = 10): Promise<Article[]> {
  const result = await sql`
    SELECT * FROM articles
    WHERE published = true
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return result as Article[];
}

export async function getAllArticles(): Promise<Article[]> {
  const result = await sql`
    SELECT * FROM articles
    ORDER BY created_at DESC
  `;
  return result as Article[];
}

export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  const result = await sql`
    SELECT * FROM articles
    WHERE published = true AND featured = true
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return result as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const result = await sql`
    SELECT * FROM articles
    WHERE slug = ${slug} AND published = true
    LIMIT 1
  `;
  return (result[0] as Article) || null;
}

export async function upsertArticle(article: Partial<Article> & { slug: string; title: string; content: string }): Promise<void> {
  const createdAt = article.created_at ? new Date(article.created_at) : new Date();
  const updatedAt = article.updated_at ? new Date(article.updated_at) : new Date();

  await sql`
    INSERT INTO articles (title, slug, excerpt, content, featured_image, category, source_type, source_url, published, featured, created_at, updated_at)
    VALUES (
      ${article.title},
      ${article.slug},
      ${article.excerpt || null},
      ${article.content},
      ${article.featured_image || null},
      ${article.category || 'update'},
      ${article.source_type || null},
      ${article.source_url || null},
      ${article.published ?? false},
      ${article.featured ?? false},
      ${createdAt},
      ${updatedAt}
    )
    ON CONFLICT (slug)
    DO UPDATE SET
      title = EXCLUDED.title,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      featured_image = EXCLUDED.featured_image,
      category = EXCLUDED.category,
      source_type = EXCLUDED.source_type,
      source_url = EXCLUDED.source_url,
      published = EXCLUDED.published,
      featured = EXCLUDED.featured,
      updated_at = EXCLUDED.updated_at
  `;
}

export async function deleteAllArticles(): Promise<void> {
  await sql`DELETE FROM articles`;
}

export async function getArticleById(id: number): Promise<Article | null> {
  const result = await sql`
    SELECT * FROM articles
    WHERE id = ${id}
    LIMIT 1
  `;
  return (result[0] as Article) || null;
}

export async function deleteArticleById(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM articles
    WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}

export async function createArticle(
  article: Omit<Article, 'id' | 'created_at' | 'updated_at'>
): Promise<Article> {
  const result = await sql`
    INSERT INTO articles (title, slug, excerpt, content, featured_image, category, source_type, source_url, published, featured, created_at, updated_at)
    VALUES (
      ${article.title},
      ${article.slug},
      ${article.excerpt || null},
      ${article.content},
      ${article.featured_image || null},
      ${article.category || 'update'},
      ${article.source_type || null},
      ${article.source_url || null},
      ${article.published ?? false},
      ${article.featured ?? false},
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
    RETURNING *
  `;
  return result[0] as Article;
}

export async function updateArticleById(
  id: number,
  article: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>
): Promise<Article | null> {
  const result = await sql`
    UPDATE articles SET
      title = COALESCE(${article.title ?? null}, title),
      slug = COALESCE(${article.slug ?? null}, slug),
      excerpt = ${article.excerpt ?? null},
      content = COALESCE(${article.content ?? null}, content),
      featured_image = ${article.featured_image ?? null},
      category = COALESCE(${article.category ?? null}, category),
      source_type = ${article.source_type ?? null},
      source_url = ${article.source_url ?? null},
      published = COALESCE(${article.published ?? null}, published),
      featured = COALESCE(${article.featured ?? null}, featured),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as Article) || null;
}

export async function getXPosts(limit = 20): Promise<XPost[]> {
  const result = await sql`
    SELECT * FROM x_posts
    ORDER BY posted_at DESC
    LIMIT ${limit}
  `;
  return result as XPost[];
}

export async function getXMentions(limit = 20): Promise<XMention[]> {
  const result = await sql`
    SELECT * FROM x_mentions
    ORDER BY posted_at DESC
    LIMIT ${limit}
  `;
  return result as XMention[];
}

export async function getLastFetchedAtForXPosts(): Promise<Date | null> {
  const result = await sql`
    SELECT MAX(fetched_at) AS fetched_at
    FROM x_posts
  `;
  const fetchedAt = result[0]?.fetched_at;
  return fetchedAt ? new Date(fetchedAt) : null;
}

export async function getLastFetchedAtForXMentions(): Promise<Date | null> {
  const result = await sql`
    SELECT MAX(fetched_at) AS fetched_at
    FROM x_mentions
  `;
  const fetchedAt = result[0]?.fetched_at;
  return fetchedAt ? new Date(fetchedAt) : null;
}

export async function getLastFetchedAtForYouTubeVideos(): Promise<Date | null> {
  const result = await sql`
    SELECT MAX(fetched_at) AS fetched_at
    FROM youtube_videos
  `;
  const fetchedAt = result[0]?.fetched_at;
  return fetchedAt ? new Date(fetchedAt) : null;
}

export async function upsertXPost(post: Omit<XPost, 'id' | 'fetched_at'>): Promise<void> {
  await sql`
    INSERT INTO x_posts (post_id, content, author_username, author_name, author_avatar, likes_count, retweets_count, replies_count, media_urls, posted_at, fetched_at)
    VALUES (${post.post_id}, ${post.content}, ${post.author_username}, ${post.author_name}, ${post.author_avatar}, ${post.likes_count}, ${post.retweets_count}, ${post.replies_count}, ${post.media_urls}, ${post.posted_at}, CURRENT_TIMESTAMP)
    ON CONFLICT (post_id)
    DO UPDATE SET
      content = EXCLUDED.content,
      likes_count = EXCLUDED.likes_count,
      retweets_count = EXCLUDED.retweets_count,
      replies_count = EXCLUDED.replies_count,
      fetched_at = CURRENT_TIMESTAMP
  `;
}

export async function upsertXMention(mention: Omit<XMention, 'id' | 'fetched_at'>): Promise<void> {
  await sql`
    INSERT INTO x_mentions (post_id, content, author_username, author_name, author_avatar, likes_count, retweets_count, replies_count, posted_at, fetched_at)
    VALUES (${mention.post_id}, ${mention.content}, ${mention.author_username}, ${mention.author_name}, ${mention.author_avatar}, ${mention.likes_count}, ${mention.retweets_count}, ${mention.replies_count}, ${mention.posted_at}, CURRENT_TIMESTAMP)
    ON CONFLICT (post_id)
    DO UPDATE SET
      content = EXCLUDED.content,
      likes_count = EXCLUDED.likes_count,
      retweets_count = EXCLUDED.retweets_count,
      replies_count = EXCLUDED.replies_count,
      fetched_at = CURRENT_TIMESTAMP
  `;
}

export async function getYouTubeVideos(limit = 5): Promise<YouTubeVideo[]> {
  const result = await sql`
    SELECT * FROM youtube_videos
    ORDER BY published_at DESC
    LIMIT ${limit}
  `;
  return result as YouTubeVideo[];
}

export async function getAllYouTubeVideos(): Promise<YouTubeVideo[]> {
  const result = await sql`
    SELECT * FROM youtube_videos
    ORDER BY published_at DESC
  `;
  return result as YouTubeVideo[];
}

export async function clearYouTubeVideos(): Promise<void> {
  await sql`
    DELETE FROM youtube_videos
  `;
}

export async function upsertYouTubeVideo(video: Omit<YouTubeVideo, 'id' | 'fetched_at'>): Promise<void> {
  await sql`
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, published_at, view_count, like_count, summary, fetched_at)
    VALUES (${video.video_id}, ${video.title}, ${video.description}, ${video.thumbnail_url}, ${video.published_at}, ${video.view_count}, ${video.like_count}, ${video.summary}, CURRENT_TIMESTAMP)
    ON CONFLICT (video_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      thumbnail_url = EXCLUDED.thumbnail_url,
      view_count = EXCLUDED.view_count,
      like_count = EXCLUDED.like_count,
      fetched_at = CURRENT_TIMESTAMP
  `;
}

export async function getTranscript(videoId: string): Promise<YouTubeTranscript | null> {
  const result = await sql`
    SELECT * FROM youtube_transcripts
    WHERE video_id = ${videoId}
    LIMIT 1
  `;
  if (result.length === 0) return null;

  const row = result[0] as { id: number; video_id: string; full_text: string; segments: TranscriptSegment[]; duration_seconds: number | null; created_at: Date };
  return {
    ...row,
    segments: typeof row.segments === 'string' ? JSON.parse(row.segments) : row.segments,
  };
}

export async function saveTranscript(
  videoId: string,
  fullText: string,
  segments: TranscriptSegment[],
  durationSeconds: number | null
): Promise<void> {
  await sql`
    INSERT INTO youtube_transcripts (video_id, full_text, segments, duration_seconds)
    VALUES (${videoId}, ${fullText}, ${JSON.stringify(segments)}, ${durationSeconds})
    ON CONFLICT (video_id) DO UPDATE SET
      full_text = EXCLUDED.full_text,
      segments = EXCLUDED.segments,
      duration_seconds = EXCLUDED.duration_seconds
  `;
}

// News articles helpers
export async function getNewsArticles(limit = 20): Promise<NewsArticle[]> {
  const result = await sql`
    SELECT * FROM news_articles
    ORDER BY published_at DESC NULLS LAST, fetched_at DESC
    LIMIT ${limit}
  `;
  return result as NewsArticle[];
}

export async function getNewsSearchMetadata(): Promise<NewsSearchMetadata | null> {
  const result = await sql`
    SELECT * FROM news_search_metadata
    ORDER BY fetched_at DESC
    LIMIT 1
  `;
  return (result[0] as NewsSearchMetadata) || null;
}

export async function getLastFetchedAtForNews(): Promise<Date | null> {
  const result = await sql`
    SELECT MAX(fetched_at) AS fetched_at
    FROM news_articles
  `;
  const fetchedAt = result[0]?.fetched_at;
  return fetchedAt ? new Date(fetchedAt) : null;
}

export async function upsertNewsArticle(article: Omit<NewsArticle, 'id' | 'fetched_at'>): Promise<void> {
  await sql`
    INSERT INTO news_articles (article_url, title, summary, source, published_at, fetched_at)
    VALUES (${article.article_url}, ${article.title}, ${article.summary}, ${article.source}, ${article.published_at}, CURRENT_TIMESTAMP)
    ON CONFLICT (article_url)
    DO UPDATE SET
      title = EXCLUDED.title,
      summary = EXCLUDED.summary,
      source = EXCLUDED.source,
      published_at = EXCLUDED.published_at,
      fetched_at = CURRENT_TIMESTAMP
  `;
}

export async function upsertNewsSearchMetadata(summary: string, citations: string[]): Promise<void> {
  // Delete old metadata and insert new (keep only most recent)
  await sql`DELETE FROM news_search_metadata`;
  await sql`
    INSERT INTO news_search_metadata (summary, citations, fetched_at)
    VALUES (${summary}, ${citations}, CURRENT_TIMESTAMP)
  `;
}
