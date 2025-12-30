import { NextResponse } from 'next/server';
import { searchNewsAboutNick } from '@/lib/xai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for news search

export async function POST() {
  try {
    console.log('Admin: Searching for news about Nick Shirley...');

    const result = await searchNewsAboutNick();

    console.log(`Admin: Found ${result.articles.length} news articles`);

    return NextResponse.json({
      success: true,
      message: `Found ${result.articles.length} news articles`,
      summary: result.summary,
      articles: result.articles,
      citations: result.citations,
    });
  } catch (error) {
    console.error('Admin: Error searching news:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search news',
        summary: '',
        articles: [],
        citations: [],
      },
      { status: 500 }
    );
  }
}
