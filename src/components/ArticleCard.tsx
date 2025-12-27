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
      <article className="article-card group mb-12">
        <Link href={`/articles/${slug}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {featuredImage && (
              <div className="md:col-span-8 relative aspect-[16/9] overflow-hidden bg-gray-100">
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className={`flex flex-col justify-center ${featuredImage ? 'md:col-span-4' : 'md:col-span-12'}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-sans text-sm font-bold uppercase tracking-wider text-gray-500">
                  {getCategoryLabel()}
                </span>
                <span className="text-gray-300">|</span>
                <time className="font-sans text-sm text-gray-500">
                  {formattedDate}
                </time>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 group-hover:underline leading-tight font-headline">
                {title}
              </h2>
              {excerpt && (
                <p className="text-gray-600 text-base md:text-lg leading-relaxed font-serif">
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
    <article className="article-card group py-8">
      <Link href={`/articles/${slug}`}>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">
                {getCategoryLabel()}
              </span>
              <span className="text-gray-300">|</span>
              <time className="font-sans text-xs text-gray-500">
                {formattedDate}
              </time>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:underline font-headline leading-tight">
              {title}
            </h3>
            {excerpt && (
              <p className="text-gray-600 text-base leading-relaxed line-clamp-3 font-serif">
                {excerpt}
              </p>
            )}
          </div>
          {featuredImage && (
            <div className="relative w-full md:w-64 aspect-[16/10] flex-shrink-0 overflow-hidden bg-gray-100">
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
