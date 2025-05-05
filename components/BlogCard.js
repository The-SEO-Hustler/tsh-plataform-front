import Link from 'next/link';
import { cn } from "@/lib/utils";
import Image from 'next/image';
/**
 * Blog Post Card Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Blog post title
 * @param {string} props.excerpt - Blog post excerpt
 * @param {string} props.category - Blog post category
 * @param {string} props.date - Publication date
 * @param {string} props.readTime - Estimated read time
 * @param {string} props.slug - Blog post slug
 * @param {string} props.imageUrl - Featured image URL (optional)
 * @param {boolean} props.featured - Whether this is a featured post
 */
export default function BlogCard({
  post
}) {
  const { title, excerpt, category, date, readTime, slug, featuredImage, featuredImageAlt, featured } = post;

  // Sanitize excerpt to ensure consistent rendering
  const sanitizedExcerpt = excerpt ? excerpt.replace(/<[^>]*>/g, '') : '';

  return (
    <Link
      href={`/blog/${slug}`}
      className="block group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-full !no-underline bg-card"
    >
      {/* Image Container */}
      {featuredImage && (
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          <Image src={featuredImage} alt={featuredImageAlt} fill className="object-cover" />

          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent",
              featured && "from-primary/80"
            )}
          ></div>
          {featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-sm text-xs font-bold">
                Featured
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category and metadata */}
        <div className="flex items-center mb-3">
          <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-sm text-xs font-medium">
            {category}
          </span>
          {/* <span className="text-muted-foreground text-xs ml-auto flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {readTime} min read
          </span> */}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }} />

        {/* Date and Read More */}
        <div className="flex items-center text-sm">
          <span className="text-foreground/80">
            {date}
          </span>
          <span className="ml-auto text-primary font-medium flex items-center">
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
