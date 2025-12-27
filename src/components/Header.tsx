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
          <span>{currentDate}</span>
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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href="/">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Nick Shirley
            </h1>
          </Link>
          <p className="mt-2 text-gray-600 font-sans text-sm tracking-widest uppercase">
            Independent Journalist
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden w-full py-3 flex items-center justify-center gap-2 font-sans text-sm"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>Menu</span>
            <svg
              className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Desktop navigation */}
          <ul className={`
            md:flex md:justify-center md:gap-8 py-3 font-sans text-sm
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
