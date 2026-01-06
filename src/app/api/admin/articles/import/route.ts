import { NextResponse } from 'next/server';
import { upsertArticle } from '@/lib/db';

export const dynamic = 'force-dynamic';

function normalizeArticles(input: unknown): unknown[] | null {
  if (Array.isArray(input)) return input;
  if (input && typeof input === 'object' && 'articles' in input) {
    const payload = (input as { articles?: unknown }).articles;
    if (Array.isArray(payload)) return payload;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const rawText = await request.text();
    if (!rawText) {
      return NextResponse.json(
        { success: false, error: 'No data received', processed: 0, skipped: 0, errors: ['Empty body'] },
        { status: 400 }
      );
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON', processed: 0, skipped: 0, errors: ['JSON parse error'] },
        { status: 400 }
      );
    }

    const articles = normalizeArticles(payload);
    if (!articles) {
      return NextResponse.json(
        { success: false, error: 'Expected an array of articles', processed: 0, skipped: 0, errors: ['Invalid shape'] },
        { status: 400 }
      );
    }

    let processed = 0;
    const errors: string[] = [];

    for (const [index, article] of articles.entries()) {
      if (!article || typeof article !== 'object') {
        errors.push(`Row ${index + 1}: Not an object`);
        continue;
      }

      const record = article as Record<string, unknown>;
      const title = typeof record.title === 'string' ? record.title : null;
      const slug = typeof record.slug === 'string' ? record.slug : null;
      const content = typeof record.content === 'string' ? record.content : null;

      if (!title || !slug || !content) {
        errors.push(`Row ${index + 1}: Missing title, slug, or content`);
        continue;
      }

      try {
        await upsertArticle({
          title,
          slug,
          excerpt: typeof record.excerpt === 'string' ? record.excerpt : null,
          content,
          featured_image: typeof record.featured_image === 'string' ? record.featured_image : null,
          category: typeof record.category === 'string' ? record.category : 'update',
          author: typeof record.author === 'string' ? record.author : 'Nick Shirley',
          source_type: typeof record.source_type === 'string' ? record.source_type : null,
          source_url: typeof record.source_url === 'string' ? record.source_url : null,
          published: typeof record.published === 'boolean' ? record.published : false,
          featured: typeof record.featured === 'boolean' ? record.featured : false,
          created_at: record.created_at ? new Date(record.created_at as string) : undefined,
          updated_at: record.updated_at ? new Date(record.updated_at as string) : undefined,
        });
        processed += 1;
      } catch (err) {
        console.error('Admin: Error importing article', slug, err);
        errors.push(`Row ${index + 1}: ${slug || 'unknown'} failed to import`);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      processed,
      skipped: errors.length,
      errors,
    });
  } catch (error) {
    console.error('Admin: Error importing articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import articles', processed: 0, skipped: 0, errors: ['Unexpected server error'] },
      { status: 500 }
    );
  }
}
