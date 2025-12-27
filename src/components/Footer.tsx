import Link from 'next/link';
import AdminPanel from './AdminPanel';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-4">Nick Shirley</h3>
            <p className="text-gray-600 font-sans text-sm max-w-md">
              Independent journalist traveling the world to report on current events.
              Bringing you stories that matter, from the ground.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-bold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 font-sans text-sm text-gray-600">
              <li>
                <Link href="/articles" className="hover:text-black">
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-black">
                  Video Reports
                </Link>
              </li>
              <li>
                <Link href="/live-feed" className="hover:text-black">
                  Live Feed
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black">
                  About Nick
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-sans font-bold text-sm uppercase tracking-wider mb-4">
              Follow
            </h4>
            <ul className="space-y-2 font-sans text-sm text-gray-600">
              <li>
                <a
                  href="https://youtube.com/@nickshirley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/nickshirleyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X / Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="font-sans text-xs text-gray-500">
            &copy; {currentYear} Nick Shirley. All rights reserved.
          </p>
          <AdminPanel />
        </div>
      </div>
    </footer>
  );
}
