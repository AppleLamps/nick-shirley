'use client';

import { useState, useEffect, useCallback } from 'react';

interface NewsArticle {
  id?: number;
  article_url?: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  published_at: string | null;
  fetched_at?: string;
}

interface NewsSearchResult {
  summary: string;
  articles: NewsArticle[];
  citations: string[];
  lastFetchedAt?: string;
  cached?: boolean;
}

export default function InTheNewsPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<NewsSearchResult | null>(null);
  const [error, setError] = useState<string>('');

  // Load cached news on mount
  const loadCachedNews = useCallback(async () => {
    try {
      setError('');

      const response = await fetch('/api/news/articles');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load news');
      }

      // Only set result if we have articles
      if (data.articles && data.articles.length > 0) {
        setResult({
          summary: data.summary,
          articles: data.articles.map((a: NewsArticle) => ({
            ...a,
            url: a.article_url || a.url,
          })),
          citations: data.citations || [],
          lastFetchedAt: data.lastFetchedAt,
          cached: data.cached,
        });
      }
    } catch (err) {
      // Don't show error on initial load if no cached data
      console.error('Error loading cached news:', err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCachedNews();
  }, [loadCachedNews]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');

    try {
      // Trigger refresh of cached data
      const response = await fetch('/api/admin/refresh/news-articles', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Refresh failed');
      }

      // Reload cached data after refresh
      await loadCachedNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh news');
    } finally {
      setRefreshing(false);
    }
  };

  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="border-t-4 border-black pt-8 mb-12">
        <h1 className="text-3xl font-bold mb-3 font-headline">In the News</h1>
        <p className="text-base text-gray-600 font-sans">
          Recent media coverage and mentions of Nick Shirley across news outlets.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing || initialLoading}
            className="px-6 py-3 bg-black text-white text-sm font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {refreshing ? 'Searching...' : result ? 'Refresh News' : 'Find Latest News Coverage'}
          </button>
          {refreshing && (
            <span className="text-sm text-gray-500 font-sans">
              Using AI to search for recent news articles...
            </span>
          )}
          {result?.lastFetchedAt && !refreshing && (
            <span className="text-sm text-gray-500 font-sans">
              Last updated: {formatLastUpdated(result.lastFetchedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Initial Loading State */}
      {initialLoading && (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent mb-4"></div>
          <p className="text-gray-500 font-sans">Loading cached news...</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
          {error}
        </div>
      )}

      {/* Results */}
      {!initialLoading && result && (
        <div className="space-y-8">
          {/* Summary Section */}
          <div className="border-l-4 border-black pl-6 py-2">
            <p className="text-lg text-gray-700 font-sans leading-relaxed">{result.summary}</p>
          </div>

          {/* Articles Grid */}
          {result.articles.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-headline border-b-2 border-black pb-2">
                News Articles ({result.articles.length})
              </h2>
              <div className="divide-y divide-gray-200">
                {result.articles.map((article, index) => (
                  <article key={article.article_url || index} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 font-headline">
                          {article.url ? (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {article.title}
                            </a>
                          ) : (
                            article.title
                          )}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-sans mb-3">
                          <span className="font-medium">{article.source}</span>
                          {article.published_at && (
                            <>
                              <span>•</span>
                              <span>{article.published_at}</span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-700 font-sans">{article.summary}</p>
                      </div>
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-4 py-2 border-2 border-black text-sm font-sans font-bold hover:bg-black hover:text-white transition-colors"
                        >
                          Read Full Article
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Sources Section */}
          {result.citations.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                Sources
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.citations.map((citation, index) => (
                  <li key={index}>
                    <a
                      href={citation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-sans break-all"
                    >
                      {citation}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty State - no cached data */}
      {!initialLoading && !result && !refreshing && (
        <div className="text-center py-16 border border-gray-200">
          <p className="text-gray-500 font-sans mb-4">
            Click the button above to search for recent news coverage about Nick Shirley.
          </p>
          <p className="text-sm text-gray-400 font-sans">
            Results are powered by AI and include articles from news outlets and web sources.
          </p>
        </div>
      )}
    </div>
  );
}
