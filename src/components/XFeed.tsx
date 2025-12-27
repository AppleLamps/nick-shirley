'use client';

import { useEffect, useState, useCallback } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

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
  refreshInterval?: number; // in milliseconds, default 5 minutes
}

export default function XFeed({
  type,
  title,
  refreshInterval = 5 * 60 * 1000,
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

    // Set up auto-refresh
    const interval = setInterval(fetchPosts, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPosts, refreshInterval]);

  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, 'MMM d');
  };

  return (
    <div className="border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full live-indicator"></div>
          <h3 className="font-sans font-bold text-sm uppercase tracking-wider">
            {title}
          </h3>
        </div>
        {lastUpdated && (
          <span className="font-sans text-xs text-gray-500">
            Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="feed-container">
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
              className="mt-2 text-sm text-gray-600 underline font-sans"
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500 font-sans">No posts available</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {posts.map((post) => (
              <li key={post.post_id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-sm">
                      {(post.author_name?.[0] || post.author_username[0]).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Author info */}
                    <div className="flex items-center gap-1 font-sans text-sm">
                      <span className="font-bold truncate">
                        {post.author_name || post.author_username}
                      </span>
                      <span className="text-gray-500">@{post.author_username}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-500">
                        {formatPostDate(post.posted_at)}
                      </span>
                    </div>

                    {/* Post content */}
                    <p className="mt-1 text-sm leading-relaxed">
                      {post.content}
                    </p>

                    {/* Engagement stats */}
                    <div className="flex items-center gap-4 mt-2 font-sans text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.replies_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {post.retweets_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likes_count}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3">
        <a
          href={type === 'posts' ? 'https://x.com/nickshirley' : 'https://x.com/search?q=nickshirley'}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-gray-600 hover:text-black flex items-center gap-1"
        >
          View more on X
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
