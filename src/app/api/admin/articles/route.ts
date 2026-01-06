import { NextResponse } from 'next/server';
import { getAllArticles, createArticle } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/articles - List all articles for admin
export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST /api/admin/articles - Create a new article
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const article = await createArticle({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content,
      featured_image: body.featured_image || null,
      category: body.category || 'update',
      author: body.author || 'Nick Shirley',
      source_type: body.source_type || null,
      source_url: body.source_url || null,
      published: body.published ?? false,
      featured: body.featured ?? false,
    });

    return NextResponse.json({
      success: true,
      article,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
