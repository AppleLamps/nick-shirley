import { NextResponse } from 'next/server';
import { getLastFetchedAtForXMentions, getXMentions } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Serve cached mentions only; no auto-refresh to respect manual refresh policy
    const mentions = await getXMentions(20);
    const lastFetchedAt = await getLastFetchedAtForXMentions();

    return NextResponse.json({
      posts: mentions,
      cached: true,
      lastFetchedAt,
    });
  } catch (error) {
    console.error('Error in X mentions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentions', posts: [] },
      { status: 500 }
    );
  }
}
