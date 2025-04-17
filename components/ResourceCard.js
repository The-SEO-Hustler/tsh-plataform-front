import Link from 'next/link';
import { cn } from "@/lib/utils";

/**
 * Resource Card Component (for ebooks, cheatsheets, guides)
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Resource title
 * @param {string} props.excerpt - Resource excerpt
 * @param {string} props.resourceTypes - Resource types
 * @param {Object} props.author - Resource author
 * @param {Object} props.featuredImage - Resource featured image
 * @param {string} props.slug - Resource slug
 * @param {boolean} props.premium - Whether this is a premium resource
 */
export default function ResourceCard({
  title,
  excerpt,
  resourceTypes,
  author,
  featuredImage,
  slug,
  premium = false,
}) {
  // Determine resource type from the resourceTypes data
  const resourceType = resourceTypes?.edges?.[0]?.node?.name || 'resource';

  // Determine icon based on resource type
  const getIconForType = (type) => {
    switch (type.toLowerCase()) {
      case 'ebook':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
      case 'spreadsheet':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        );
      case 'guide':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
            <path d="M10 9H8"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <path d="M13 2v7h7"></path>
          </svg>
        );
    }
  };

  // Get author information
  const authorName = author?.node?.name || 'Unknown Author';
  const authorAvatar = author?.node?.avatar?.url || null;

  // Get featured image
  const imageUrl = featuredImage?.node?.sourceUrl || null;
  const imageAlt = featuredImage?.node?.altText || title;

  const sanitizedExcerpt = excerpt ? excerpt.replace(/<[^>]*>/g, '') : '';

  return (
    <Link href={`/${resourceType}/${slug}`} className="rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-all h-full border border-border !no-underline">
      {/* Header */}
      <div className={cn(
        "p-4 flex items-center",
        premium ? 'bg-primary' : 'bg-muted'
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          premium ? 'bg-primary-foreground/20' : 'bg-muted-foreground/10'
        )}>
          {getIconForType(resourceType)}
        </div>
        <div className="ml-2">
          <span className={cn(
            "text-xs font-medium uppercase",
            premium ? 'text-primary-foreground/80' : 'text-muted-foreground/80'
          )}>
            {resourceType}
          </span>
        </div>
        {premium && (
          <span className="ml-auto bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded-sm text-xs font-medium">
            Premium
          </span>
        )}
      </div>

      {/* Featured Image */}
      {imageUrl && (
        <div className="relative h-48 w-full">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2 text-foreground">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}>
        </p>

        {/* Author info */}
        <div className="flex items-center mb-4">
          {authorAvatar && (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-6 h-6 rounded-full mr-2"
            />
          )}
          <span className="text-xs text-muted-foreground">{authorName}</span>
        </div>

        <div
          className={cn(
            "inline-flex items-center text-sm font-medium transition-colors",
            premium
              ? 'text-primary'
              : 'text-foreground hover:text-primary'
          )}
        >
          {premium ? 'Purchase Now' : 'View Resource'}

        </div>
      </div>
    </Link>
  );
}
