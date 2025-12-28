'use client';

import { Article } from '@/lib/db';

interface ArticleTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
  loading?: boolean;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export default function ArticleTable({
  articles,
  onEdit,
  onDelete,
  loading = false,
}: ArticleTableProps) {
  if (loading) {
    return (
      <div className="border border-gray-200 p-8 text-center">
        <p className="text-gray-500 font-sans text-sm">Loading articles...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="border border-gray-200 p-8 text-center">
        <p className="text-gray-500 font-sans text-sm">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 font-bold font-sans">Title</th>
            <th className="text-left px-4 py-3 font-bold font-sans w-24">Category</th>
            <th className="text-left px-4 py-3 font-bold font-sans w-24">Status</th>
            <th className="text-left px-4 py-3 font-bold font-sans w-28">Created</th>
            <th className="text-right px-4 py-3 font-bold font-sans w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr
              key={article.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <div className="font-medium">{truncate(article.title, 50)}</div>
                <div className="text-xs text-gray-500 font-sans">/{article.slug}</div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-0.5 text-xs font-sans bg-gray-100 rounded">
                  {article.category}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1.5">
                  {article.published ? (
                    <span className="inline-block px-2 py-0.5 text-xs font-sans bg-green-100 text-green-800 rounded">
                      Published
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-xs font-sans bg-yellow-100 text-yellow-800 rounded">
                      Draft
                    </span>
                  )}
                  {article.featured && (
                    <span className="inline-block px-2 py-0.5 text-xs font-sans bg-blue-100 text-blue-800 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500 font-sans text-xs">
                {formatDate(article.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-2 justify-end">
                  <a
                    href={`/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 text-xs font-sans border border-gray-300 hover:bg-gray-50"
                  >
                    View
                  </a>
                  <button
                    onClick={() => onEdit(article)}
                    className="px-2 py-1 text-xs font-sans bg-black text-white hover:bg-gray-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(article)}
                    className="px-2 py-1 text-xs font-sans border border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
