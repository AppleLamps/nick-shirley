import { NextResponse } from 'next/server';
import { getPublishedArticles, getFeaturedArticles, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const articles = featured
      ? await getFeaturedArticles(limit)
      : await getPublishedArticles(limit);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles', articles: [] },
      { status: 500 }
    );
  }
}

// POST endpoint for creating articles (protected - add auth in production)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, featuredImage, category, sourceType, sourceUrl, published, featured } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO articles (title, slug, excerpt, content, featured_image, category, source_type, source_url, published, featured)
      VALUES (${title}, ${slug}, ${excerpt || null}, ${content}, ${featuredImage || null}, ${category || 'update'}, ${sourceType || null}, ${sourceUrl || null}, ${published || false}, ${featured || false})
      RETURNING *
    `;

    return NextResponse.json({ article: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
