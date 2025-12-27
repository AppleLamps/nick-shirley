import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = await getAllArticles();
    const serialized = articles.map((article) => ({
      ...article,
      created_at: article.created_at ? new Date(article.created_at).toISOString() : null,
      updated_at: article.updated_at ? new Date(article.updated_at).toISOString() : null,
    }));

    return NextResponse.json({
      success: true,
      count: serialized.length,
      articles: serialized,
    });
  } catch (error) {
    console.error('Admin: Error exporting articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export articles', articles: [] },
      { status: 500 }
    );
  }
}
