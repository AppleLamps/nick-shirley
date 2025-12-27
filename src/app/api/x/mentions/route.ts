import { NextResponse } from 'next/server';
import { getXMentions, upsertXMention } from '@/lib/db';
import { fetchMentionsAboutNick } from '@/lib/xai';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // First, try to get cached mentions from the database
    let mentions = await getXMentions(20);

    // If no mentions or mentions are stale (older than 5 minutes), fetch fresh ones
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const needsRefresh =
      mentions.length === 0 ||
      (mentions[0] && new Date(mentions[0].fetched_at) < fiveMinutesAgo);

    if (needsRefresh) {
      try {
        // Fetch fresh mentions from XAI
        const freshMentions = await fetchMentionsAboutNick();

        // Store them in the database
        for (const mention of freshMentions) {
          await upsertXMention({
            post_id: mention.post_id,
            content: mention.content,
            author_username: mention.author_username,
            author_name: mention.author_name,
            author_avatar: null,
            likes_count: mention.likes_count,
            retweets_count: mention.retweets_count,
            replies_count: mention.replies_count,
            posted_at: new Date(mention.posted_at),
          });
        }

        // Get the updated mentions
        mentions = await getXMentions(20);
      } catch (fetchError) {
        console.error('Error fetching fresh mentions:', fetchError);
        // Continue with cached mentions if fetch fails
      }
    }

    return NextResponse.json({
      posts: mentions,
      cached: !needsRefresh,
    });
  } catch (error) {
    console.error('Error in X mentions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentions', posts: [] },
      { status: 500 }
    );
  }
}
