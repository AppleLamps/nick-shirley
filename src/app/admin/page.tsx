'use client';

import { useMemo, useState, useRef } from 'react';

type RefreshKey = 'xPosts' | 'xMentions' | 'youtubeVideos' | 'videoSummaries';

interface RefreshStatus {
  loading: boolean;
  success: boolean | null;
  message: string;
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
  });

  const [articleMessage, setArticleMessage] = useState<string>('');
  const [articleMessageTone, setArticleMessageTone] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [purging, setPurging] = useState(false);
  const [importFileName, setImportFileName] = useState<string>('');

  const adminPassword = useMemo(() => process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123', []);

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
    } catch (error: unknown) {
      setArticleMessage(error instanceof Error ? error.message : 'Delete failed');
      setArticleMessageTone('error');
    } finally {
      setPurging(false);
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['xPosts', 'xMentions', 'youtubeVideos', 'videoSummaries'] as RefreshKey[]).map((key) => (
                  <div key={key} className="border border-gray-200 p-4">
                    <h3 className="font-bold text-sm">
                      {key === 'xPosts' && 'X Posts'}
                      {key === 'xMentions' && 'X Mentions'}
                      {key === 'youtubeVideos' && 'YouTube Videos'}
                      {key === 'videoSummaries' && 'Video Summaries'}
                    </h3>
                    <p className="text-xs text-gray-500 font-sans mt-0.5 mb-3">
                      {key === 'xPosts' && "Nick's posts via xAI"}
                      {key === 'xMentions' && 'What people say about Nick'}
                      {key === 'youtubeVideos' && 'Latest videos from channel'}
                      {key === 'videoSummaries' && 'Regenerate all video summaries'}
                    </p>
                    <button
                      onClick={() => handleRefresh(key)}
                      disabled={refreshStatus[key].loading}
                      className="w-full px-3 py-2 bg-black text-white text-xs font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {refreshStatus[key].loading ? (key === 'videoSummaries' ? 'Generating...' : 'Refreshing...') : 'Refresh'}
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

          {/* Article Manager Section */}
          <section className="border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-bold text-lg">Article Manager</h2>
              <p className="text-xs text-gray-500 font-sans">Import or export all articles as a single JSON file</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </section>
        </div>
      )}
    </div>
  );
}
