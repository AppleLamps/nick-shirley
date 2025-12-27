import { NextResponse } from 'next/server';
import { deleteAllArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await deleteAllArticles();
    return NextResponse.json({ success: true, message: 'All articles deleted.' });
  } catch (error) {
    console.error('Admin: Error deleting articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete articles' },
      { status: 500 }
    );
  }
}
