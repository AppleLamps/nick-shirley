import { NextResponse } from 'next/server';
import { upsertXPost } from '@/lib/db';
import { fetchNickShirleyPosts } from '@/lib/xai';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('Admin: Manually refreshing X posts...');

    const freshPosts = await fetchNickShirleyPosts();

    if (freshPosts.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No posts returned from xAI',
        count: 0,
      });
    }

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

    console.log(`Admin: Successfully refreshed ${freshPosts.length} X posts`);

    return NextResponse.json({
      success: true,
      message: `Refreshed ${freshPosts.length} posts`,
      count: freshPosts.length,
    });
  } catch (error) {
    console.error('Admin: Error refreshing X posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh posts'
      },
      { status: 500 }
    );
  }
}
