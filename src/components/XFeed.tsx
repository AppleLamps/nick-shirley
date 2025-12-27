'use client';

import { useEffect, useState, useCallback } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

const NICK_USERNAME = 'nickshirleyy';

interface XPost {
  id: number;
  post_id: string;
  content: string;
  author_username: string;
  author_name: string | null;
  author_avatar: string | null;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  posted_at: string;
}

interface XFeedProps {
  type: 'posts' | 'mentions';
  title: string;
  refreshInterval?: number;
  maxHeight?: number;
}

export default function XFeed({
  type,
  title,
  refreshInterval = 5 * 60 * 1000,
  maxHeight = 500,
}: XFeedProps) {
  const [posts, setPosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = type === 'posts' ? '/api/x/posts' : '/api/x/mentions';
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchPosts();

    const interval = setInterval(fetchPosts, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPosts, refreshInterval]);

  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return formatDistanceToNow(date, { addSuffix: false });
    }
    return format(date, 'MMM d');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-700">
            {title}
          </h3>
        </div>
        {lastUpdated && (
          <p className="font-sans text-xs text-gray-400 mt-1">
            Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </p>
        )}
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {loading && posts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500 font-sans">Loading...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-500 font-sans">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-2 text-sm text-gray-600 underline font-sans hover:text-black"
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500 font-sans">No posts available</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <article
                key={post.post_id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Author Row */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  {post.author_username.toLowerCase() === NICK_USERNAME ? (
                    <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden">
                      <Image
                        src="/nick.jpg"
                        alt="Nick Shirley"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="text-gray-500 font-bold text-xs">
                        {(post.author_name?.[0] || post.author_username[0]).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Author Info */}
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="font-sans text-sm font-bold text-gray-900 truncate max-w-[120px]">
                        {post.author_name || post.author_username}
                      </span>
                      <span className="font-sans text-xs text-gray-500 truncate">
                        @{post.author_username}
                      </span>
                      <span className="font-sans text-xs text-gray-400 ml-auto flex-shrink-0">
                        {formatPostDate(post.posted_at)}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="mt-1.5 text-sm text-gray-800 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-4 mt-2.5">
                      <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {formatNumber(post.replies_count)}
                      </span>
                      <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {formatNumber(post.retweets_count)}
                      </span>
                      <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {formatNumber(post.likes_count)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <a
          href={type === 'posts' ? 'https://x.com/nickshirleyy' : 'https://x.com/search?q=nickshirleyy'}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1 transition-colors"
        >
          View more on X
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
