import { NextResponse } from 'next/server';
import { getNewsArticles, getNewsSearchMetadata, getLastFetchedAtForNews } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Serve cached news only; no auto-refresh to respect manual refresh policy
    const articles = await getNewsArticles(20);
    const metadata = await getNewsSearchMetadata();
    const lastFetchedAt = await getLastFetchedAtForNews();

    return NextResponse.json({
      articles,
      summary: metadata?.summary || '',
      citations: metadata?.citations || [],
      cached: true,
      lastFetchedAt,
    });
  } catch (error) {
    console.error('Error in news articles API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch news articles',
        articles: [],
        summary: '',
        citations: [],
      },
      { status: 500 }
    );
  }
}
