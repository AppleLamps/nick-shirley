'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
        createTimeline: (
          source: { sourceType: string; screenName: string },
          target: HTMLElement,
          options?: Record<string, unknown>
        ) => Promise<HTMLElement | undefined>;
      };
    };
  }
}

interface TwitterEmbedProps {
  username: string;
  height?: number;
}

export default function TwitterEmbed({ username, height = 400 }: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const createTimeline = async () => {
      if (!containerRef.current || !window.twttr?.widgets) return;

      try {
        // Clear container first
        containerRef.current.innerHTML = '';

        // Use the factory function as recommended in docs
        const element = await window.twttr.widgets.createTimeline(
          {
            sourceType: 'profile',
            screenName: username,
          },
          containerRef.current,
          {
            height,
            chrome: 'noheader nofooter noborders',
            theme: 'light',
          }
        );

        if (mounted) {
          if (element) {
            setIsLoading(false);
            setLoadFailed(false);
          } else {
            setLoadFailed(true);
            setIsLoading(false);
          }
        }
      } catch {
        if (mounted) {
          setLoadFailed(true);
          setIsLoading(false);
        }
      }
    };

    // Load Twitter widget script
    if (!document.getElementById('twitter-widget-script')) {
      const script = document.createElement('script');
      script.id = 'twitter-widget-script';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';

      script.onload = () => {
        if (mounted) {
          createTimeline();
        }
      };

      script.onerror = () => {
        if (mounted) {
          setLoadFailed(true);
          setIsLoading(false);
        }
      };

      document.body.appendChild(script);
    } else if (window.twttr?.widgets) {
      createTimeline();
    } else {
      // Script exists but twttr not ready, wait a bit
      const timeout = setTimeout(() => {
        if (mounted && window.twttr?.widgets) {
          createTimeline();
        } else if (mounted) {
          setLoadFailed(true);
          setIsLoading(false);
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }

    return () => {
      mounted = false;
    };
  }, [username, height]);

  if (loadFailed) {
    return (
      <div className="bg-white">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-sans mb-3">
            Unable to load tweets
          </p>
          <a
            href={`https://x.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-sans font-bold text-black hover:underline"
          >
            View @{username} on X
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden relative">
      {isLoading && (
        <div className="flex items-center justify-center bg-white" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500 font-sans">Loading tweets...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ minHeight: isLoading ? 0 : height }} />
    </div>
  );
}
