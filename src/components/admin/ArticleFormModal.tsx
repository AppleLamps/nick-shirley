'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/db';
import dynamic from 'next/dynamic';

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 min-h-[200px] flex items-center justify-center">
      <span className="text-gray-400 text-sm">Loading editor...</span>
    </div>
  ),
});

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Partial<Article>) => Promise<void>;
  article?: Article | null;
  loading?: boolean;
}

const CATEGORIES = ['update', 'analysis', 'video', 'interview', 'live'];
const SOURCE_TYPES = [
  { value: '', label: 'None' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x_post', label: 'X Post' },
  { value: 'original', label: 'Original' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function ArticleFormModal({
  isOpen,
  onClose,
  onSave,
  article,
  loading = false,
}: ArticleFormModalProps) {
  const isEditing = !!article;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'update',
    source_type: '',
    source_url: '',
    published: false,
    featured: false,
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (article) {
        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          featured_image: article.featured_image || '',
          category: article.category || 'update',
          source_type: article.source_type || '',
          source_url: article.source_url || '',
          published: article.published ?? false,
          featured: article.featured ?? false,
        });
        setSlugManuallyEdited(true);
      } else {
        setFormData({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featured_image: '',
          category: 'update',
          source_type: '',
          source_url: '',
          published: false,
          featured: false,
        });
        setSlugManuallyEdited(false);
      }
    }
  }, [isOpen, article]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugManuallyEdited ? prev.slug : slugify(title),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...formData,
      excerpt: formData.excerpt || null,
      featured_image: formData.featured_image || null,
      source_type: formData.source_type || null,
      source_url: formData.source_url || null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-3xl mx-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">
            {isEditing ? 'Edit Article' : 'New Article'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black"
                placeholder="Article title"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-bold mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                required
                className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black"
                placeholder="article-url-slug"
              />
              <p className="text-xs text-gray-500 font-sans mt-1">
                URL: /articles/{formData.slug || 'your-slug'}
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-bold mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black resize-none"
                placeholder="Brief description for article previews"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-bold mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(markdown) => setFormData((prev) => ({ ...prev, content: markdown }))}
                placeholder="Write your article content..."
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-bold mb-1">Featured Image URL</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Category & Source Type Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Source Type</label>
                <select
                  value={formData.source_type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, source_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black bg-white"
                >
                  {SOURCE_TYPES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source URL */}
            {formData.source_type && (
              <div>
                <label className="block text-sm font-bold mb-1">Source URL</label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, source_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-black"
                  placeholder="https://..."
                />
              </div>
            )}

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm font-sans">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm font-sans">Featured</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-sans border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.slug || !formData.content}
              className="px-4 py-2 text-sm font-sans font-bold bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
