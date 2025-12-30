'use client';

import { useState } from 'react';

interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  url: string;
  published_at: string;
}

interface NewsSearchResult {
  summary: string;
  articles: NewsArticle[];
  citations: string[];
}

export default function InTheNewsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewsSearchResult | null>(null);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch('/api/admin/news-search', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResult({
        summary: data.summary,
        articles: data.articles,
        citations: data.citations,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search news');
    } finally {
      setLoading(false);
    }
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
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-black text-white text-sm font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Searching...' : 'Find Latest News Coverage'}
          </button>
          {loading && (
            <span className="text-sm text-gray-500 font-sans">
              Using AI to search for recent news articles...
            </span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Summary Section */}
          <div className="border-l-4 border-black pl-6 py-2">
            <p className="text-lg text-gray-700 font-sans leading-relaxed">{result.summary}</p>
          </div>

          {/* Articles Grid */}
          {result.articles.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-headline border-b-2 border-black pb-2">
                News Articles ({result.articles.length})
              </h2>
              <div className="divide-y divide-gray-200">
                {result.articles.map((article, index) => (
                  <article key={index} className="py-6 first:pt-0 last:pb-0">
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
          ) : hasSearched && !loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-sans">
                No news articles found. Try searching again later.
              </p>
            </div>
          ) : null}

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

      {/* Empty State before search */}
      {!hasSearched && !loading && (
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
