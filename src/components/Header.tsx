'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="border-b border-gray-200">
      {/* Top bar with date and social links */}
      <div className="border-b border-gray-100 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs text-gray-500 font-sans">
          <div className="flex items-center gap-4">
            <span>{currentDate}</span>
            <span className="text-gray-300">|</span>
            <span>
              website made by{' '}
              <a
                href="https://x.com/lamps_apple"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                @lamps_apple
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com/@nickshirley"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://x.com/nickshirley"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              X / Twitter
            </a>
          </div>
        </div>
      </div>

      {/* Main header with logo */}
      <div className="py-8 md:py-10">
        <div className="max-w-[1600px] mx-auto px-4 text-center">
          <Link href="/">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
              Nick Shirley
            </h1>
          </Link>
          <p className="mt-3 text-gray-600 font-sans text-sm md:text-base tracking-[0.2em] uppercase">
            Independent Journalist
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200 border-b-2 border-black mb-8">
        <div className="max-w-[1600px] mx-auto px-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden w-full py-4 flex items-center justify-center gap-2 font-sans text-base font-bold"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>Menu</span>
            <svg
              className={`w-5 h-5 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Desktop navigation */}
          <ul className={`
            md:flex md:justify-center md:gap-12 py-4 font-sans text-sm md:text-base font-bold uppercase tracking-wider
            ${menuOpen ? 'block' : 'hidden md:flex'}
          `}>
            <li>
              <Link href="/" className="block py-2 md:py-0 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/articles" className="block py-2 md:py-0 hover:underline">
                Articles
              </Link>
            </li>
            <li>
              <Link href="/videos" className="block py-2 md:py-0 hover:underline">
                Videos
              </Link>
            </li>
            <li>
              <Link href="/live-feed" className="block py-2 md:py-0 hover:underline">
                Live Feed
              </Link>
            </li>
            <li>
              <Link href="/in-the-news" className="block py-2 md:py-0 hover:underline">
                In the News
              </Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 md:py-0 hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
