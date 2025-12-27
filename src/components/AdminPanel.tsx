'use client';

import { useState } from 'react';

interface RefreshStatus {
  loading: boolean;
  success: boolean | null;
  message: string;
}

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [refreshStatus, setRefreshStatus] = useState<Record<string, RefreshStatus>>({
    xPosts: { loading: false, success: null, message: '' },
    xMentions: { loading: false, success: null, message: '' },
    youtubeVideos: { loading: false, success: null, message: '' },
  });

  const handleUnlock = () => {
    // Simple password check - in production you'd want this server-side
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleRefresh = async (type: 'xPosts' | 'xMentions' | 'youtubeVideos') => {
    setRefreshStatus(prev => ({
      ...prev,
      [type]: { loading: true, success: null, message: 'Refreshing...' }
    }));

    try {
      const endpoints: Record<string, string> = {
        xPosts: '/api/admin/refresh/x-posts',
        xMentions: '/api/admin/refresh/x-mentions',
        youtubeVideos: '/api/admin/refresh/youtube-videos',
      };

      const response = await fetch(endpoints[type], { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        setRefreshStatus(prev => ({
          ...prev,
          [type]: { loading: false, success: true, message: data.message || 'Success!' }
        }));
      } else {
        setRefreshStatus(prev => ({
          ...prev,
          [type]: { loading: false, success: false, message: data.error || 'Failed' }
        }));
      }
    } catch {
      setRefreshStatus(prev => ({
        ...prev,
        [type]: { loading: false, success: false, message: 'Network error' }
      }));
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsUnlocked(false);
    setPassword('');
    setError('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-gray-600 text-xs font-sans ml-2"
        title="Admin"
      >
        [Admin]
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white z-50 shadow-xl border border-gray-200">
        <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h2 className="font-bold">Admin Panel</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {!isUnlocked ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 font-sans">
                Enter admin password to continue
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black"
              />
              {error && (
                <p className="text-sm text-red-500 font-sans">{error}</p>
              )}
              <button
                onClick={handleUnlock}
                className="w-full bg-black text-white py-2 font-sans text-sm font-bold hover:bg-gray-800"
              >
                Unlock
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 font-sans mb-4">
                Manually trigger API refreshes. This bypasses the cache timer.
              </p>

              {/* X Posts */}
              <div className="border border-gray-200 p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm">X Posts</h3>
                    <p className="text-xs text-gray-500 font-sans">Nick&apos;s posts via xAI</p>
                  </div>
                  <button
                    onClick={() => handleRefresh('xPosts')}
                    disabled={refreshStatus.xPosts.loading}
                    className="px-3 py-1 bg-black text-white text-xs font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400"
                  >
                    {refreshStatus.xPosts.loading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
                {refreshStatus.xPosts.message && (
                  <p className={`text-xs mt-2 font-sans ${refreshStatus.xPosts.success ? 'text-green-600' : refreshStatus.xPosts.success === false ? 'text-red-500' : 'text-gray-500'}`}>
                    {refreshStatus.xPosts.message}
                  </p>
                )}
              </div>

              {/* X Mentions */}
              <div className="border border-gray-200 p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm">X Mentions</h3>
                    <p className="text-xs text-gray-500 font-sans">What people say about Nick via xAI</p>
                  </div>
                  <button
                    onClick={() => handleRefresh('xMentions')}
                    disabled={refreshStatus.xMentions.loading}
                    className="px-3 py-1 bg-black text-white text-xs font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400"
                  >
                    {refreshStatus.xMentions.loading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
                {refreshStatus.xMentions.message && (
                  <p className={`text-xs mt-2 font-sans ${refreshStatus.xMentions.success ? 'text-green-600' : refreshStatus.xMentions.success === false ? 'text-red-500' : 'text-gray-500'}`}>
                    {refreshStatus.xMentions.message}
                  </p>
                )}
              </div>

              {/* YouTube Videos */}
              <div className="border border-gray-200 p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm">YouTube Videos</h3>
                    <p className="text-xs text-gray-500 font-sans">Latest 5 videos from channel</p>
                  </div>
                  <button
                    onClick={() => handleRefresh('youtubeVideos')}
                    disabled={refreshStatus.youtubeVideos.loading}
                    className="px-3 py-1 bg-black text-white text-xs font-sans font-bold hover:bg-gray-800 disabled:bg-gray-400"
                  >
                    {refreshStatus.youtubeVideos.loading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
                {refreshStatus.youtubeVideos.message && (
                  <p className={`text-xs mt-2 font-sans ${refreshStatus.youtubeVideos.success ? 'text-green-600' : refreshStatus.youtubeVideos.success === false ? 'text-red-500' : 'text-gray-500'}`}>
                    {refreshStatus.youtubeVideos.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
