'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Article } from '@/lib/db';
import ArticleTable from '@/components/admin/ArticleTable';
import ArticleFormModal from '@/components/admin/ArticleFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

type RefreshKey = 'xPosts' | 'xMentions' | 'youtubeVideos' | 'videoSummaries' | 'newsArticles';

interface RefreshStatus {
  loading: boolean;
  success: boolean | null;
  message: string;
}

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

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [refreshStatus, setRefreshStatus] = useState<Record<RefreshKey, RefreshStatus>>({
    xPosts: { loading: false, success: null, message: '' },
    xMentions: { loading: false, success: null, message: '' },
    youtubeVideos: { loading: false, success: null, message: '' },
    videoSummaries: { loading: false, success: null, message: '' },
    newsArticles: { loading: false, success: null, message: '' },
  });

  const [articleMessage, setArticleMessage] = useState<string>('');
  const [articleMessageTone, setArticleMessageTone] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [purging, setPurging] = useState(false);
  const [importFileName, setImportFileName] = useState<string>('');

  // Article management state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showBulkOps, setShowBulkOps] = useState(false);

  // News search state
  const [newsSearching, setNewsSearching] = useState(false);
  const [newsResult, setNewsResult] = useState<NewsSearchResult | null>(null);
  const [newsError, setNewsError] = useState<string>('');

  const adminPassword = useMemo(() => process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123', []);

  const fetchArticles = useCallback(async () => {
    try {
      setArticlesLoading(true);
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      fetchArticles();
    }
  }, [isUnlocked, fetchArticles]);

  const handleUnlock = () => {
    if (password === adminPassword) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleRefresh = async (type: RefreshKey) => {
    setRefreshStatus(prev => ({
      ...prev,
      [type]: { loading: true, success: null, message: 'Refreshing...' },
    }));

    try {
      const endpoints: Record<RefreshKey, string> = {
        xPosts: '/api/admin/refresh/x-posts',
        xMentions: '/api/admin/refresh/x-mentions',
        youtubeVideos: '/api/admin/refresh/youtube-videos',
        videoSummaries: '/api/admin/refresh/video-summaries',
        newsArticles: '/api/admin/refresh/news-articles',
      };

      const response = await fetch(endpoints[type], { method: 'POST' });
      const data = await response.json();

      setRefreshStatus(prev => ({
        ...prev,
        [type]: {
          loading: false,
          success: response.ok,
          message: data.message || data.error || (response.ok ? 'Success!' : 'Failed'),
        },
      }));
    } catch {
      setRefreshStatus(prev => ({
        ...prev,
        [type]: { loading: false, success: false, message: 'Network error' },
      }));
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setArticleMessage('');
    setArticleMessageTone('neutral');

    try {
      const res = await fetch('/api/admin/articles/export');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Export failed');
      }

      const blob = new Blob([JSON.stringify(data.articles, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'articles-export.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setArticleMessage(`Exported ${data.count || data.articles?.length || 0} articles.`);
      setArticleMessageTone('success');
    } catch (error: unknown) {
      setArticleMessage(error instanceof Error ? error.message : 'Export failed');
      setArticleMessageTone('error');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    setImporting(true);
    setArticleMessage('');
    setArticleMessageTone('neutral');
    setImportFileName(file.name);

    try {
      const text = await file.text();
      const res = await fetch('/api/admin/articles/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: text,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setArticleMessage(`Imported ${data.processed} articles${data.skipped ? `, skipped ${data.skipped}` : ''}.`);
      setArticleMessageTone(data.skipped ? 'neutral' : 'success');
      fetchArticles(); // Refresh article list
    } catch (error: unknown) {
      setArticleMessage(error instanceof Error ? error.message : 'Import failed');
      setArticleMessageTone('error');
    } finally {
      setImporting(false);
      setImportFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePurge = async () => {
    if (!confirm('Delete ALL articles? This cannot be undone.')) return;
    setPurging(true);
    setArticleMessage('');
    setArticleMessageTone('neutral');

    try {
      const res = await fetch('/api/admin/articles/purge', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setArticleMessage('All articles deleted.');
      setArticleMessageTone('success');
      fetchArticles(); // Refresh article list
    } catch (error: unknown) {
      setArticleMessage(error instanceof Error ? error.message : 'Delete failed');
      setArticleMessageTone('error');
    } finally {
      setPurging(false);
    }
  };

  // Article CRUD handlers
  const handleCreateNew = () => {
    setEditingArticle(null);
    setShowFormModal(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setShowFormModal(true);
  };

  const handleDelete = (article: Article) => {
    setDeletingArticle(article);
    setShowDeleteModal(true);
  };

  const handleSaveArticle = async (articleData: Partial<Article>) => {
    setSaving(true);
    try {
      if (editingArticle) {
        // Update existing article
        const res = await fetch(`/api/admin/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
      } else {
        // Create new article
        const res = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Create failed');
      }
      setShowFormModal(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('Save error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingArticle) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${deletingArticle.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setShowDeleteModal(false);
      setDeletingArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  // News search handler
  const handleNewsSearch = async () => {
    setNewsSearching(true);
    setNewsError('');
    setNewsResult(null);

    try {
      const response = await fetch('/api/admin/news-search', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setNewsResult({
        summary: data.summary,
        articles: data.articles,
        citations: data.citations,
      });
    } catch (error) {
      setNewsError(error instanceof Error ? error.message : 'Failed to search news');
    } finally {
      setNewsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="border-t-4 border-black pt-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-600 font-sans text-sm">Manage content, feeds, and cache refreshes.</p>
      </div>

      {!isUnlocked ? (
        <div className="max-w-md border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-1">Unlock Admin</h2>
          <p className="text-xs text-gray-500 font-sans mb-4">Enter password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black"
          />
          {error && <p className="text-sm text-red-500 font-sans mt-2">{error}</p>}
          <button
            onClick={handleUnlock}
            className="mt-4 w-full bg-black text-white py-2 font-sans text-sm font-bold hover:bg-gray-800"
          >
            Unlock
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Feed Refresh Section */}
          <section className="border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-bold text-lg">Feed Refresh</h2>
              <p className="text-xs text-gray-500 font-sans">Manually trigger X and YouTube cache refreshes</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(['xPosts', 'xMentions', 'youtubeVideos', 'videoSummaries', 'newsArticles'] as RefreshKey[]).map((key) => (
                  <div key={key} className="border border-gray-200 p-4">
                    <h3 className="font-bold text-sm">
                      {key === 'xPosts' && 'X Posts'}
                      {key === 'xMentions' && 'X Mentions'}
                      {key === 'youtubeVideos' && 'YouTube Videos'}
                      {key === 'videoSummaries' && 'Video Summaries'}
                      {key === 'newsArticles' && 'News Articles'}
                    </h3>
                    <p className="text-xs text-gray-500 font-sans mt-0.5 mb-3">
                      {key === 'xPosts' && "Nick's posts via xAI"}
                      {key === 'xMentions' && 'What people say about Nick'}
                      {key === 'youtubeVideos' && 'Latest videos from channel'}
                      {key === 'videoSummaries' && 'Regenerate all video summaries'}
                      {key === 'newsArticles' && 'Media coverage from news sites'}
                    </p>
                    <button
                      onClick={() => handleRefresh(key)}
                      disabled={refreshStatus[key].loading}
                      className="w-full px-3 py-2 bg-black text-white text-xs font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {refreshStatus[key].loading ? (key === 'videoSummaries' ? 'Generating...' : key === 'newsArticles' ? 'Searching...' : 'Refreshing...') : 'Refresh'}
                    </button>
                    {refreshStatus[key].message && (
                      <p
                        className={`text-xs font-sans mt-2 ${refreshStatus[key].success ? 'text-green-700' : refreshStatus[key].success === false ? 'text-red-600' : 'text-gray-500'
                          }`}
                      >
                        {refreshStatus[key].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* In the News Section */}
          <section className="border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-bold text-lg">In the News</h2>
              <p className="text-xs text-gray-500 font-sans">Search for recent media coverage about Nick Shirley</p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleNewsSearch}
                  disabled={newsSearching}
                  className="px-4 py-2 bg-black text-white text-sm font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {newsSearching ? 'Searching...' : 'Search News'}
                </button>
                {newsSearching && (
                  <span className="text-sm text-gray-500 font-sans">
                    Using AI to search for news articles...
                  </span>
                )}
              </div>

              {newsError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
                  {newsError}
                </div>
              )}

              {newsResult && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="p-4 bg-gray-50 border border-gray-200">
                    <h3 className="font-bold text-sm mb-2">Summary</h3>
                    <p className="text-sm text-gray-700 font-sans">{newsResult.summary}</p>
                  </div>

                  {/* Articles */}
                  {newsResult.articles.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-bold text-sm">Articles Found ({newsResult.articles.length})</h3>
                      {newsResult.articles.map((article, index) => (
                        <div key={index} className="border border-gray-200 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-sm mb-1">{article.title}</h4>
                              <p className="text-xs text-gray-500 font-sans mb-2">
                                {article.source} {article.published_at && `• ${article.published_at}`}
                              </p>
                              <p className="text-sm text-gray-700 font-sans">{article.summary}</p>
                            </div>
                            {article.url && (
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline font-sans whitespace-nowrap"
                              >
                                View Article →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-sans">No articles found.</p>
                  )}

                  {/* Citations */}
                  {newsResult.citations.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="font-bold text-xs mb-2 text-gray-500">Sources</h3>
                      <ul className="space-y-1">
                        {newsResult.citations.map((citation, index) => (
                          <li key={index}>
                            <a
                              href={citation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline font-sans break-all"
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
            </div>
          </section>

          {/* Article Manager Section */}
          <section className="border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">Article Manager</h2>
                <p className="text-xs text-gray-500 font-sans">Create, edit, and manage articles</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-black text-white text-sm font-sans font-bold hover:bg-gray-800"
              >
                New Article
              </button>
            </div>

            <div className="p-6">
              {/* Article Table */}
              <ArticleTable
                articles={articles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={articlesLoading}
              />

              {/* Bulk Operations Toggle */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <button
                  onClick={() => setShowBulkOps(!showBulkOps)}
                  className="text-sm text-gray-600 font-sans hover:text-black flex items-center gap-2"
                >
                  <span className={`transform transition-transform ${showBulkOps ? 'rotate-90' : ''}`}>
                    &#9654;
                  </span>
                  Bulk Operations (Import / Export / Delete All)
                </button>

                {showBulkOps && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Export Card */}
                    <div className="border border-gray-200 p-4">
                      <h3 className="font-bold text-sm mb-1">Export</h3>
                      <p className="text-xs text-gray-500 font-sans mb-3">Download every article in one JSON file.</p>
                      <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="w-full px-4 py-2 bg-black text-white text-xs font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400"
                      >
                        {exporting ? 'Exporting...' : 'Export Articles'}
                      </button>
                    </div>

                    {/* Import Card */}
                    <div className="border border-gray-200 p-4">
                      <h3 className="font-bold text-sm mb-1">Import</h3>
                      <p className="text-xs text-gray-500 font-sans mb-3">Upload a JSON file with an array of articles.</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        onChange={(e) => handleImport(e.target.files?.[0] || null)}
                        disabled={importing}
                        className="hidden"
                        id="import-file"
                      />
                      <label
                        htmlFor="import-file"
                        className={`w-full block text-center px-4 py-2 text-xs font-sans font-bold cursor-pointer ${importing
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                          }`}
                      >
                        {importing ? 'Importing...' : 'Choose File'}
                      </label>
                      {importFileName && (
                        <p className="text-xs text-gray-500 font-sans mt-2 truncate">{importFileName}</p>
                      )}
                    </div>

                    {/* Delete All Card */}
                    <div className="border border-gray-200 p-4">
                      <h3 className="font-bold text-sm mb-1">Delete All</h3>
                      <p className="text-xs text-gray-500 font-sans mb-3">Remove every article from the database.</p>
                      <button
                        onClick={handlePurge}
                        disabled={purging}
                        className="w-full px-4 py-2 border-2 border-black text-black text-xs font-sans font-bold hover:bg-black hover:text-white disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white"
                      >
                        {purging ? 'Deleting...' : 'Delete All Articles'}
                      </button>
                    </div>
                  </div>
                )}

                {articleMessage && (
                  <p className={`mt-4 text-sm font-sans ${articleMessageTone === 'success'
                    ? 'text-green-700'
                    : articleMessageTone === 'error'
                      ? 'text-red-600'
                      : 'text-gray-600'
                    }`}>
                    {articleMessage}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Modals */}
      <ArticleFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingArticle(null);
        }}
        onSave={handleSaveArticle}
        article={editingArticle}
        loading={saving}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingArticle(null);
        }}
        onConfirm={handleConfirmDelete}
        articleTitle={deletingArticle?.title || ''}
        loading={deleting}
      />
    </div>
  );
}
