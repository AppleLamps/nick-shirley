// YouTube Data API v3 integration for fetching Nick Shirley's videos

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const CHANNEL_HANDLE = '@NickShirley';

export interface YouTubeVideoData {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
  view_count: number;
  like_count: number;
  duration: string;
}

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    liveBroadcastContent?: 'none' | 'live' | 'upcoming';
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    liveBroadcastContent?: 'none' | 'live' | 'upcoming';
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
  contentDetails: {
    duration: string;
  };
  liveStreamingDetails?: {
    actualStartTime?: string;
    actualEndTime?: string;
    scheduledStartTime?: string;
    scheduledEndTime?: string;
  };
}

function parseDuration(isoDuration: string): string {
  // Parse ISO 8601 duration (PT1H2M3S) to readable format (1:02:03)
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function parseDurationSeconds(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

async function getChannelId(apiKey: string): Promise<string | null> {
  // First try to get channel by handle
  const response = await fetch(
    `${YOUTUBE_API_URL}/channels?part=id&forHandle=${encodeURIComponent(CHANNEL_HANDLE)}&key=${apiKey}`
  );

  if (!response.ok) {
    console.error('Failed to fetch channel ID:', await response.text());
    return null;
  }

  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].id;
  }

  return null;
}

export async function fetchYouTubeVideos(limit = 5): Promise<YouTubeVideoData[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'your_youtube_api_key_here') {
    console.error('YouTube API key not configured');
    return [];
  }

  try {
    // Get the channel ID from the handle
    const channelId = await getChannelId(apiKey);
    if (!channelId) {
      console.error('Could not find channel ID for', CHANNEL_HANDLE);
      return [];
    }

    // Search for recent videos from this channel.
    // We intentionally over-fetch here so we can filter out Shorts and livestreams.
    const maxResults = Math.min(50, Math.max(limit * 10, limit));
    const searchResponse = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}&key=${apiKey}`
    );

    if (!searchResponse.ok) {
      console.error('Failed to search videos:', await searchResponse.text());
      return [];
    }

    const searchData = await searchResponse.json();
    const searchItems: YouTubeSearchItem[] = searchData.items || [];

    // Drop currently-live / upcoming live streams early (still keep VOD filtering below).
    const nonLiveSearchItems = searchItems.filter(
      (item) => item?.snippet?.liveBroadcastContent !== 'live' && item?.snippet?.liveBroadcastContent !== 'upcoming'
    );

    const videoIds = nonLiveSearchItems
      .map((item) => item.id.videoId)
      .filter(Boolean)
      .join(',');

    if (!videoIds) {
      return [];
    }

    // Get detailed video info including statistics, duration, and live metadata
    const videosResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=snippet,statistics,contentDetails,liveStreamingDetails&id=${videoIds}&key=${apiKey}`
    );

    if (!videosResponse.ok) {
      console.error('Failed to fetch video details:', await videosResponse.text());
      return [];
    }

    const videosData = await videosResponse.json();

    const items: YouTubeVideoItem[] = videosData.items || [];

    // Filter out Shorts and livestreams/replays
    const filtered = items
      .filter((video) => {
        const durationSeconds = parseDurationSeconds(video.contentDetails?.duration || '');
        const isShort = durationSeconds > 0 && durationSeconds <= 60;
        const isLiveOrUpcoming =
          video.snippet?.liveBroadcastContent === 'live' ||
          video.snippet?.liveBroadcastContent === 'upcoming';
        const isLivestreamReplay = Boolean(video.liveStreamingDetails);

        return !isShort && !isLiveOrUpcoming && !isLivestreamReplay;
      })
      .sort(
        (a, b) =>
          new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime()
      )
      .slice(0, limit)
      .map((video) => ({
        video_id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail_url:
          video.snippet.thumbnails.high?.url ||
          video.snippet.thumbnails.medium?.url ||
          video.snippet.thumbnails.default?.url ||
          '',
        published_at: video.snippet.publishedAt,
        view_count: parseInt(video.statistics.viewCount || '0', 10),
        like_count: parseInt(video.statistics.likeCount || '0', 10),
        duration: parseDuration(video.contentDetails.duration),
      }));

    return filtered;

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}
