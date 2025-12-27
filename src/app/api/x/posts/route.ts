import { NextResponse } from 'next/server';
import { getXPosts, upsertXPost } from '@/lib/db';
import { fetchNickShirleyPosts } from '@/lib/xai';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // First, try to get cached posts from the database
    let posts = await getXPosts(20);

    // If no posts or posts are stale (older than 30 minutes), fetch fresh ones
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const needsRefresh =
      posts.length === 0 ||
      (posts[0] && new Date(posts[0].fetched_at) < thirtyMinutesAgo);

    if (needsRefresh) {
      try {
        // Fetch fresh posts from XAI
        const freshPosts = await fetchNickShirleyPosts();

        // Store them in the database
        for (const post of freshPosts) {
          await upsertXPost({
            post_id: post.post_id,
            content: post.content,
            author_username: post.author_username,
            author_name: post.author_name,
            author_avatar: null,
            likes_count: post.likes_count,
            retweets_count: post.retweets_count,
            replies_count: post.replies_count,
            media_urls: null,
            posted_at: new Date(post.posted_at),
          });
        }

        // Get the updated posts
        posts = await getXPosts(20);
      } catch (fetchError) {
        console.error('Error fetching fresh posts:', fetchError);
        // Continue with cached posts if fetch fails
      }
    }

    return NextResponse.json({
      posts,
      cached: !needsRefresh,
    });
  } catch (error) {
    console.error('Error in X posts API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', posts: [] },
      { status: 500 }
    );
  }
}
