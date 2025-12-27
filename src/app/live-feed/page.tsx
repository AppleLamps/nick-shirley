import XFeed from '@/components/XFeed';

export const metadata = {
  title: 'Live Feed | Nick Shirley',
  description: 'Real-time updates from Nick Shirley on X and what people are saying about his reporting.',
};

export default function LiveFeedPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="border-t-4 border-black pt-8 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-4 h-4 bg-red-500 rounded-full live-indicator"></div>
          <h1 className="text-3xl font-bold font-headline">Live Feed</h1>
        </div>
        <p className="text-base text-gray-600 font-sans">
          Real-time updates from X.
        </p>
      </div>

      {/* Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Nick's Popular Posts */}
        <XFeed
          type="posts"
          title="Nick's Popular Posts (Past 5 Days)"
          refreshInterval={30 * 60 * 1000}
          maxHeight={800}
        />

        {/* Mentions */}
        <XFeed
          type="mentions"
          title="What People Are Saying"
          refreshInterval={30 * 60 * 1000}
          maxHeight={800}
        />
      </div>

      {/* Info Section */}
      <div className="mt-16 p-8 bg-gray-50 border border-gray-200">
        <h3 className="font-sans font-bold text-sm uppercase tracking-wider mb-3">
          About the Live Feed
        </h3>
        <p className="text-gray-600 text-sm font-sans leading-relaxed">
          This page displays real-time content from X (formerly Twitter). Nick&apos;s posts
          show his latest updates, reporting, and commentary. The mentions feed shows
          what others are saying about Nick and his work.
        </p>
        <div className="mt-4 flex gap-6">
          <a
            href="https://x.com/nickshirleyy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm font-bold text-black hover:underline"
          >
            Follow @nickshirleyy
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
