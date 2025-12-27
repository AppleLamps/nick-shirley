import Link from 'next/link';

export const metadata = {
  title: 'Videos | Nick Shirley',
  description: 'Watch documentaries, reports, and behind-the-scenes content from independent journalist Nick Shirley.',
};

// Sample videos - in production these would come from YouTube API
const sampleVideos = [
  {
    id: 1,
    title: "Documentary: On the Ground in Crisis Zones",
    description: "An in-depth look at the realities of reporting from conflict areas and the stories that emerge from the chaos.",
    thumbnail: null,
    duration: "45:32",
    views: "125K",
    published: "2 weeks ago",
  },
  {
    id: 2,
    title: "Behind the Scenes: How Independent Journalism Works",
    description: "A look at the process behind creating investigative reports, from research to final edit.",
    thumbnail: null,
    duration: "22:15",
    views: "89K",
    published: "1 month ago",
  },
  {
    id: 3,
    title: "Interview Series: Voices from the Ground",
    description: "Conversations with people directly affected by the stories that make headlines around the world.",
    thumbnail: null,
    duration: "38:47",
    views: "156K",
    published: "1 month ago",
  },
  {
    id: 4,
    title: "Weekly Analysis: Breaking Down Current Events",
    description: "A comprehensive look at the week's major stories with context and expert analysis.",
    thumbnail: null,
    duration: "28:03",
    views: "67K",
    published: "3 days ago",
  },
];

export default function VideosPage() {
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
          href="https://youtube.com/@nickshirley"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sampleVideos.map((video) => (
          <article key={video.id} className="group">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-200 mb-4 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black text-white text-xs font-sans px-2 py-1">
                {video.duration}
              </div>
              {/* Play overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <h3 className="font-bold text-lg mb-2 group-hover:underline">
              {video.title}
            </h3>
            <p className="text-gray-600 text-sm font-sans mb-2 line-clamp-2">
              {video.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-sans text-gray-500">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{video.published}</span>
            </div>
          </article>
        ))}
      </div>

      {/* View More CTA */}
      <div className="mt-12 text-center">
        <a
          href="https://youtube.com/@nickshirley"
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
