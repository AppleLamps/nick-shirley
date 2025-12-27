import { NextResponse } from 'next/server';
import { upsertXMention } from '@/lib/db';
import { fetchMentionsAboutNick } from '@/lib/xai';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('Admin: Manually refreshing X mentions...');

    const freshMentions = await fetchMentionsAboutNick();

    if (freshMentions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No trending mentions found (100+ likes required)',
        count: 0,
      });
    }

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

    console.log(`Admin: Successfully refreshed ${freshMentions.length} X mentions`);

    return NextResponse.json({
      success: true,
      message: `Refreshed ${freshMentions.length} mentions`,
      count: freshMentions.length,
    });
  } catch (error) {
    console.error('Admin: Error refreshing X mentions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh mentions'
      },
      { status: 500 }
    );
  }
}
