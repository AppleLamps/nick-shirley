import { NextResponse } from 'next/server';
import { getYouTubeVideos, upsertYouTubeVideo } from '@/lib/db';
import { fetchYouTubeVideos } from '@/lib/youtube';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // First, try to get cached videos from the database
    let videos = await getYouTubeVideos(5);

    // If no videos or videos are stale (older than 1 hour), fetch fresh ones
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const needsRefresh =
      videos.length === 0 ||
      (videos[0] && new Date(videos[0].fetched_at) < oneHourAgo);

    if (needsRefresh) {
      try {
        // Fetch fresh videos from YouTube API (only 5 most recent)
        const freshVideos = await fetchYouTubeVideos(5);

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

        // Get the updated videos
        videos = await getYouTubeVideos(5);
      } catch (fetchError) {
        console.error('Error fetching fresh videos:', fetchError);
        // Continue with cached videos if fetch fails
      }
    }

    return NextResponse.json({
      videos,
      cached: !needsRefresh,
    });
  } catch (error) {
    console.error('Error in YouTube videos API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos', videos: [] },
      { status: 500 }
    );
  }
}
