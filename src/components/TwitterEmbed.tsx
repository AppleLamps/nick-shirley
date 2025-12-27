'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

interface TwitterEmbedProps {
  username: string;
  height?: number;
}

export default function TwitterEmbed({ username, height = 600 }: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Twitter widget script if not already loaded
    if (!document.getElementById('twitter-widget-script')) {
      const script = document.createElement('script');
      script.id = 'twitter-widget-script';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    } else if (window.twttr?.widgets) {
      // If script is already loaded, reload widgets
      window.twttr.widgets.load(containerRef.current || undefined);
    }

    // Also try to reload after a short delay (for initial load)
    const timeout = setTimeout(() => {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(containerRef.current || undefined);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [username]);

  return (
    <div ref={containerRef} className="border border-gray-200 bg-white overflow-hidden">
      <a
        className="twitter-timeline"
        data-height={height}
        data-theme="light"
        data-chrome="noheader nofooter noborders"
        href={`https://twitter.com/${username}`}
      >
        Loading tweets...
      </a>
    </div>
  );
}
