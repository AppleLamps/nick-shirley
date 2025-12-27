import Link from 'next/link';
import { getYouTubeVideos, YouTubeVideo } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

export const metadata = {
  title: 'Videos | Nick Shirley',
  description: 'Watch documentaries, reports, and behind-the-scenes content from independent journalist Nick Shirley.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VideosPage() {
  let videos: YouTubeVideo[] = [];

  try {
    videos = await getYouTubeVideos(5);
  } catch (error) {
    console.error('Error fetching videos:', error);
  }

  const hasVideos = videos.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="border-t-4 border-black pt-6 mb-8">
        <h1 className="text-4xl font-bold mb-2">Videos</h1>
        <p className="text-gray-600 font-sans">
          Documentaries, reports, and behind-the-scenes content from the field.
        </p>
      </div>

      {/* YouTube Channel CTA */}
      <div className="mb-12 p-6 bg-black text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <div>
            <h2 className="font-bold text-xl">Subscribe on YouTube</h2>
            <p className="font-sans text-sm opacity-80">
              Get notified when new videos are published
            </p>
          </div>
        </div>
        <a
          href="https://youtube.com/@NickShirley"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-sans text-sm font-bold hover:bg-gray-100 transition-colors"
        >
          Subscribe
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Videos Grid */}
      {hasVideos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.video_id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <p className="text-gray-500 font-sans mb-4">No videos available yet</p>
          <a
            href="https://youtube.com/@NickShirley"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-black hover:underline font-sans"
          >
            Visit the YouTube channel
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      {/* View More CTA */}
      <div className="mt-12 text-center">
        <a
          href="https://youtube.com/@NickShirley"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-2 border-black px-8 py-4 font-sans text-sm font-bold hover:bg-black hover:text-white transition-colors"
        >
          View All Videos on YouTube
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Related Links */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="font-sans font-bold text-sm uppercase tracking-wider mb-6">
          More Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/articles"
            className="block p-6 border border-gray-200 hover:border-black transition-colors"
          >
            <h3 className="font-bold mb-2">Articles</h3>
            <p className="text-gray-600 text-sm font-sans">
              Written reports, analysis, and commentary
            </p>
          </Link>
          <Link
            href="/live-feed"
            className="block p-6 border border-gray-200 hover:border-black transition-colors"
          >
            <h3 className="font-bold mb-2">Live Feed</h3>
            <p className="text-gray-600 text-sm font-sans">
              Real-time updates from X
            </p>
          </Link>
          <Link
            href="/about"
            className="block p-6 border border-gray-200 hover:border-black transition-colors"
          >
            <h3 className="font-bold mb-2">About Nick</h3>
            <p className="text-gray-600 text-sm font-sans">
              Learn more about the journalist
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
