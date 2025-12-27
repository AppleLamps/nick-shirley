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

export async function upsertXPost(post: Omit<XPost, 'id' | 'fetched_at'>): Promise<void> {
  await sql`
    INSERT INTO x_posts (post_id, content, author_username, author_name, author_avatar, likes_count, retweets_count, replies_count, media_urls, posted_at)
    VALUES (${post.post_id}, ${post.content}, ${post.author_username}, ${post.author_name}, ${post.author_avatar}, ${post.likes_count}, ${post.retweets_count}, ${post.replies_count}, ${post.media_urls}, ${post.posted_at})
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
    INSERT INTO x_mentions (post_id, content, author_username, author_name, author_avatar, likes_count, retweets_count, replies_count, posted_at)
    VALUES (${mention.post_id}, ${mention.content}, ${mention.author_username}, ${mention.author_name}, ${mention.author_avatar}, ${mention.likes_count}, ${mention.retweets_count}, ${mention.replies_count}, ${mention.posted_at})
    ON CONFLICT (post_id)
    DO UPDATE SET
      content = EXCLUDED.content,
      likes_count = EXCLUDED.likes_count,
      retweets_count = EXCLUDED.retweets_count,
      replies_count = EXCLUDED.replies_count,
      fetched_at = CURRENT_TIMESTAMP
  `;
}
