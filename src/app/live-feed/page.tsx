import XFeed from '@/components/XFeed';

export const metadata = {
  title: 'Live Feed | Nick Shirley',
  description: 'Real-time updates from Nick Shirley on X and what people are saying about his reporting.',
};

export default function LiveFeedPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="border-t-4 border-black pt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full live-indicator"></div>
          <h1 className="text-4xl font-bold">Live Feed</h1>
        </div>
        <p className="text-gray-600 font-sans">
          Real-time updates from X, refreshing every 5 minutes.
        </p>
      </div>

      {/* Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nick's Posts */}
        <div>
          <div className="mb-4">
            <h2 className="font-sans font-bold text-lg">Nick&apos;s Posts</h2>
            <p className="text-gray-500 text-sm font-sans">
              Latest posts from @nickshirley
            </p>
          </div>
          <XFeed
            type="posts"
            title="Nick's Posts"
            refreshInterval={5 * 60 * 1000}
          />
        </div>

        {/* Mentions */}
        <div>
          <div className="mb-4">
            <h2 className="font-sans font-bold text-lg">Mentions & Discussion</h2>
            <p className="text-gray-500 text-sm font-sans">
              What people are saying about Nick
            </p>
          </div>
          <XFeed
            type="mentions"
            title="Mentions"
            refreshInterval={5 * 60 * 1000}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 bg-gray-50 border border-gray-200">
        <h3 className="font-sans font-bold text-sm uppercase tracking-wider mb-3">
          About the Live Feed
        </h3>
        <p className="text-gray-600 text-sm font-sans leading-relaxed">
          This page displays real-time content from X (formerly Twitter). Nick&apos;s posts
          show his latest updates, reporting, and commentary. The mentions feed shows
          what others are saying about Nick and his work. Both feeds refresh automatically
          every 5 minutes to keep you up to date.
        </p>
        <div className="mt-4 flex gap-4">
          <a
            href="https://x.com/nickshirley"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm font-bold text-black hover:underline"
          >
            Follow @nickshirley
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
