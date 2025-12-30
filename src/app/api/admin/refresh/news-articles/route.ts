import { NextResponse } from 'next/server';
import { upsertNewsArticle, upsertNewsSearchMetadata } from '@/lib/db';
import { searchNewsAboutNick } from '@/lib/xai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for news search

export async function POST() {
  try {
    console.log('Admin: Manually refreshing news articles...');

    const result = await searchNewsAboutNick();

    if (result.articles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No news articles returned from xAI',
        count: 0,
      });
    }

    // Store articles in the database
    for (const article of result.articles) {
      // Use URL as unique key, or generate one from title/source if no URL
      const articleUrl = article.url || `generated://${article.source}/${encodeURIComponent(article.title)}`;

      await upsertNewsArticle({
        article_url: articleUrl,
        title: article.title,
        summary: article.summary,
        source: article.source,
        published_at: article.published_at ? new Date(article.published_at) : null,
      });
    }

    // Store the summary and citations
    await upsertNewsSearchMetadata(result.summary, result.citations);

    console.log(`Admin: Successfully refreshed ${result.articles.length} news articles`);

    return NextResponse.json({
      success: true,
      message: `Refreshed ${result.articles.length} news articles`,
      count: result.articles.length,
    });
  } catch (error) {
    console.error('Admin: Error refreshing news articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh news articles'
      },
      { status: 500 }
    );
  }
}
