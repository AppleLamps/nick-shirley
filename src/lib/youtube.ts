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

    // Search for videos from this channel
    const searchResponse = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${limit}&key=${apiKey}`
    );

    if (!searchResponse.ok) {
      console.error('Failed to search videos:', await searchResponse.text());
      return [];
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items?.map((item: YouTubeSearchItem) => item.id.videoId).join(',');

    if (!videoIds) {
      return [];
    }

    // Get detailed video info including statistics and duration
    const videosResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`
    );

    if (!videosResponse.ok) {
      console.error('Failed to fetch video details:', await videosResponse.text());
      return [];
    }

    const videosData = await videosResponse.json();

    return videosData.items?.map((video: YouTubeVideoItem) => ({
      video_id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail_url: video.snippet.thumbnails.high?.url ||
                     video.snippet.thumbnails.medium?.url ||
                     video.snippet.thumbnails.default?.url || '',
      published_at: video.snippet.publishedAt,
      view_count: parseInt(video.statistics.viewCount || '0'),
      like_count: parseInt(video.statistics.likeCount || '0'),
      duration: parseDuration(video.contentDetails.duration),
    })) || [];

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}
