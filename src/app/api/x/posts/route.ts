import { NextResponse } from 'next/server';
import { getLastFetchedAtForXPosts, getXPosts } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Serve cached posts only; no auto-refresh to respect manual refresh policy
    const posts = await getXPosts(20);
    const lastFetchedAt = await getLastFetchedAtForXPosts();

    return NextResponse.json({
      posts,
      cached: true,
      lastFetchedAt,
    });
  } catch (error) {
    console.error('Error in X posts API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', posts: [] },
      { status: 500 }
    );
  }
}
