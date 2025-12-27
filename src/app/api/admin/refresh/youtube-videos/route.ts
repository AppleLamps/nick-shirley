import { NextResponse } from 'next/server';
import { upsertYouTubeVideo } from '@/lib/db';
import { fetchYouTubeVideos } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('Admin: Manually refreshing YouTube videos...');

    const freshVideos = await fetchYouTubeVideos(5);

    if (freshVideos.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No videos returned from YouTube API',
        count: 0,
      });
    }

    // Store them in the database
    for (const video of freshVideos) {
      await upsertYouTubeVideo({
        video_id: video.video_id,
        title: video.title,
        description: video.description,
        thumbnail_url: video.thumbnail_url,
        published_at: new Date(video.published_at),
        view_count: video.view_count,
        like_count: video.like_count,
      });
    }

    console.log(`Admin: Successfully refreshed ${freshVideos.length} YouTube videos`);

    return NextResponse.json({
      success: true,
      message: `Refreshed ${freshVideos.length} videos`,
      count: freshVideos.length,
    });
  } catch (error) {
    console.error('Admin: Error refreshing YouTube videos:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh videos'
      },
      { status: 500 }
    );
  }
}
