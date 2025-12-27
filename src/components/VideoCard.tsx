'use client';

import { useState } from 'react';

interface VideoCardProps {
  video: {
    video_id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    published_at: Date;
    view_count: number;
  };
}

interface TranscriptSegment {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function formatTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Generate consistent colors for speakers
function getSpeakerColor(speaker: string): string {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-teal-100 text-teal-800',
  ];
  const index = speaker.charCodeAt(speaker.length - 1) % colors.length;
  return colors[index];
}

export default function VideoCard({ video }: VideoCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary'>('summary');
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const [fullText, setFullText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [transcriptProgress, setTranscriptProgress] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchTranscript = async () => {
    if (transcript) return; // Already fetched

    setLoadingTranscript(true);
    setTranscriptProgress('Downloading audio from YouTube...');
    setError('');

    try {
      const response = await fetch(`/api/youtube/transcript?videoId=${video.video_id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setTranscript(data.segments);
      setFullText(data.fullText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transcript');
    } finally {
      setLoadingTranscript(false);
      setTranscriptProgress('');
    }
  };

  const fetchSummary = async () => {
    if (summary) return; // Already fetched

    setLoadingSummary(true);
    setError('');

    try {
      // First fetch transcript if we don't have it
      let text = fullText;
      if (!text) {
        setTranscriptProgress('Downloading audio from YouTube...');
        const transcriptResponse = await fetch(`/api/youtube/transcript?videoId=${video.video_id}`);
        const transcriptData = await transcriptResponse.json();
        if (!transcriptResponse.ok) {
          throw new Error(transcriptData.error || 'Failed to fetch transcript');
        }
        text = transcriptData.fullText;
        setTranscript(transcriptData.segments);
        setFullText(text);
        setTranscriptProgress('');
      }

      const response = await fetch('/api/youtube/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          videoTitle: video.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setLoadingSummary(false);
      setTranscriptProgress('');
    }
  };

  const openModal = async () => {
    setShowModal(true);
    if (activeTab === 'summary') {
      fetchSummary();
    } else {
      fetchTranscript();
    }
  };

  const handleTabChange = (tab: 'transcript' | 'summary') => {
    setActiveTab(tab);
    setError('');
    if (tab === 'summary' && !summary) {
      fetchSummary();
    } else if (tab === 'transcript' && !transcript) {
      fetchTranscript();
    }
  };

  return (
    <>
      <div className="group">
        {/* Thumbnail - Click to open YouTube */}
        <a
          href={`https://www.youtube.com/watch?v=${video.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative aspect-video bg-gray-200 mb-4 overflow-hidden">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
            {/* Play overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </a>

        {/* Video Info */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          <a
            href={`https://www.youtube.com/watch?v=${video.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {video.title}
          </a>
        </h3>
        <p className="text-gray-600 text-sm font-sans mb-2 line-clamp-2">
          {video.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-sans text-gray-500">
            <span>{formatViewCount(video.view_count)} views</span>
            <span>•</span>
            <span>{formatRelativeTime(video.published_at)}</span>
          </div>
          <button
            onClick={openModal}
            className="text-xs font-sans font-medium text-black hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transcript
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] flex flex-col rounded-lg shadow-xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-lg line-clamp-1 pr-4">{video.title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleTabChange('summary')}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'summary'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                What is this video about?
              </button>
              <button
                onClick={() => handleTabChange('transcript')}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'transcript'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Full Transcript
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded">
                  {error}
                </div>
              )}

              {activeTab === 'summary' && (
                <div>
                  {loadingSummary || loadingTranscript ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-3"></div>
                      <span className="text-gray-600 text-sm">
                        {transcriptProgress || (loadingTranscript ? 'Transcribing audio with AI...' : 'Generating summary...')}
                      </span>
                      {loadingTranscript && (
                        <span className="text-gray-400 text-xs mt-2">
                          This may take a minute for longer videos
                        </span>
                      )}
                    </div>
                  ) : summary ? (
                    <div className="prose prose-sm max-w-none font-sans">
                      <div className="whitespace-pre-wrap">{summary}</div>
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div>
                  {loadingTranscript ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-3"></div>
                      <span className="text-gray-600 text-sm">
                        {transcriptProgress || 'Transcribing audio with AI...'}
                      </span>
                      <span className="text-gray-400 text-xs mt-2">
                        This may take a minute for longer videos
                      </span>
                    </div>
                  ) : transcript && transcript.length > 0 ? (
                    <div className="space-y-3 font-sans text-sm">
                      {transcript.map((segment, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <a
                            href={`https://www.youtube.com/watch?v=${video.video_id}&t=${Math.floor(segment.start)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-mono text-xs shrink-0 w-14 pt-0.5"
                          >
                            {formatTimestamp(segment.start)}
                          </a>
                          <div className="flex-1">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${getSpeakerColor(segment.speaker)}`}>
                              {segment.speaker}
                            </span>
                            <span className="text-gray-800">{segment.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : transcript && transcript.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No transcript segments found.
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <a
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-sans text-gray-600 hover:text-black flex items-center gap-1"
              >
                Watch on YouTube
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-black text-white text-sm font-sans hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
