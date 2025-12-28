import { NextResponse } from 'next/server';
import { getAllYouTubeVideos, getLastFetchedAtForYouTubeVideos } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Serve cached videos only; no auto-refresh to respect manual refresh policy
    const videos = await getAllYouTubeVideos();
    const lastFetchedAt = await getLastFetchedAtForYouTubeVideos();

    return NextResponse.json({
      videos,
      cached: true,
      lastFetchedAt,
    });
  } catch (error) {
    console.error('Error in YouTube videos API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos', videos: [] },
      { status: 500 }
    );
  }
}
