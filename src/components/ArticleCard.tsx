import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  category?: string;
  sourceType?: string | null;
  createdAt: Date | string;
  featured?: boolean;
}

export default function ArticleCard({
  title,
  slug,
  excerpt,
  featuredImage,
  category = 'Update',
  sourceType,
  createdAt,
  featured = false,
}: ArticleCardProps) {
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const formattedDate = format(date, 'MMMM d, yyyy');

  const getCategoryLabel = () => {
    if (sourceType === 'youtube') return 'Video';
    if (sourceType === 'x_post') return 'X Post';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (featured) {
    return (
      <article className="article-card group">
        <Link href={`/articles/${slug}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredImage && (
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">
                  {getCategoryLabel()}
                </span>
                <span className="text-gray-300">|</span>
                <time className="font-sans text-xs text-gray-500">
                  {formattedDate}
                </time>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:underline">
                {title}
              </h2>
              {excerpt && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {excerpt}
                </p>
              )}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="article-card group py-4">
      <Link href={`/articles/${slug}`}>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">
                {getCategoryLabel()}
              </span>
              <span className="text-gray-300">|</span>
              <time className="font-sans text-xs text-gray-500">
                {formattedDate}
              </time>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:underline">
              {title}
            </h3>
            {excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {excerpt}
              </p>
            )}
          </div>
          {featuredImage && (
            <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
