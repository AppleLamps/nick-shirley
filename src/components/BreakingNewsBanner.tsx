'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BreakingNewsBanner() {
  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <Link
          href="https://shirleydefense.com/products/quality-learing-center"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col md:flex-row items-center justify-center gap-4 group"
        >
          {/* Breaking News Label */}
          <div className="flex items-center gap-3">
            <span className="bg-white text-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider animate-pulse">
              Breaking News
            </span>
            <span className="hidden md:inline text-white/80">|</span>
          </div>

          {/* Hoodie Image */}
          <div className="relative w-16 h-16 md:w-12 md:h-12 flex-shrink-0 rounded overflow-hidden border-2 border-white/30">
            <Image
              src="/quality-learing-center-hoodie.png"
              alt="Quality Learing Center Hoodie"
              fill
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left">
            <p className="font-bold text-sm md:text-base group-hover:underline">
              Nick Shirley&apos;s Quality Learing Center Hoodie Now Available!
            </p>
            <p className="text-xs md:text-sm text-white/90 mt-1">
              All purchases will go to future videos, exposing fraud and keeping Nick and David safe
            </p>
          </div>

          {/* CTA Button */}
          <span className="bg-white text-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-red-100 transition-colors flex-shrink-0">
            Buy Now →
          </span>
        </Link>
      </div>
    </div>
  );
}
