import Link from 'next/link';

export const metadata = {
  title: 'About | Nick Shirley',
  description: 'Learn more about Nick Shirley, an independent journalist who travels the world to report on current events.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="border-t-4 border-black pt-6 mb-8">
        <h1 className="text-4xl font-bold mb-4">About Nick Shirley</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Independent journalist bringing you stories from the ground.
        </p>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-lg leading-relaxed mb-6">
          Nick Shirley is an independent journalist who travels the world to report on
          current events. With a commitment to on-the-ground reporting and unfiltered
          storytelling, Nick brings audiences directly to the stories that shape our world.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">The Mission</h2>
        <p className="text-lg leading-relaxed mb-6">
          In an age of instant news and social media hot takes, Nick believes in taking
          the time to get the story right. His work prioritizes accuracy, context, and
          the human element that often gets lost in rapid-fire news cycles.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Every story begins with listening—to the people living the events, to the
          experts who provide context, and to the historical forces that shape the present.
          This approach takes more time, but it produces journalism that stands up to scrutiny.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Where to Find Nick</h2>
        <p className="text-lg leading-relaxed mb-6">
          Nick shares his work across multiple platforms to reach the widest possible audience:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {/* YouTube */}
          <a
            href="https://youtube.com/@nickshirley"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="font-sans font-bold text-lg">YouTube</span>
            </div>
            <p className="font-sans text-sm opacity-80">
              In-depth documentaries, investigative reports, and behind-the-scenes content.
            </p>
          </a>

          {/* X */}
          <a
            href="https://x.com/nickshirley"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="font-sans font-bold text-lg">X / Twitter</span>
            </div>
            <p className="font-sans text-sm opacity-80">
              Real-time updates, breaking news coverage, and daily commentary.
            </p>
          </a>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Supporting Independent Journalism</h2>
        <p className="text-lg leading-relaxed mb-6">
          Independent journalism relies on audience support. By following, sharing, and
          engaging with Nick&apos;s work, you help these important stories reach more people.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Every view, like, and share makes a difference in an era where independent
          voices compete with well-funded media organizations for attention.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Contact</h2>
        <p className="text-lg leading-relaxed mb-6">
          For press inquiries, collaboration opportunities, or to share a story tip,
          the best way to reach Nick is through direct message on X.
        </p>
      </div>

      {/* CTA Section */}
      <div className="mt-12 p-8 bg-gray-50 border border-gray-200">
        <h3 className="font-bold text-xl mb-4">Stay Updated</h3>
        <p className="text-gray-600 font-sans mb-6">
          Follow Nick on social media for the latest updates, or check the live feed
          for real-time posts.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://youtube.com/@nickshirley"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors font-sans text-sm font-bold"
          >
            Subscribe on YouTube
          </a>
          <a
            href="https://x.com/nickshirley"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors font-sans text-sm font-bold"
          >
            Follow on X
          </a>
          <Link
            href="/live-feed"
            className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors font-sans text-sm font-bold"
          >
            View Live Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
