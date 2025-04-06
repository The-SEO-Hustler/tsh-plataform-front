import Link from 'next/link';
import { cn } from "@/lib/utils";

/**
 * Resource Card Component (for ebooks, cheatsheets, guides)
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Resource title
 * @param {string} props.description - Resource description
 * @param {string} props.type - Resource type (ebook, cheatsheet, guide)
 * @param {string} props.format - Resource format (PDF, etc.)
 * @param {string} props.href - Link to the resource
 * @param {boolean} props.premium - Whether this is a premium resource
 */
export default function ResourceCard({
  title,
  description,
  type,
  format,
  href,
  premium = false,
}) {
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
      case 'cheatsheet':
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

  return (
    <div className="rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-all h-full border border-border">
      {/* Header */}
      <div className={cn(
        "p-4 flex items-center",
        premium ? 'bg-primary' : 'bg-muted'
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          premium ? 'bg-primary-foreground/20' : 'bg-muted-foreground/10'
        )}>
          {getIconForType(type)}
        </div>
        <div className="ml-2">
          <span className={cn(
            "text-xs font-medium uppercase",
            premium ? 'text-primary-foreground/80' : 'text-muted-foreground/80'
          )}>
            {type}
          </span>
          <span className={cn(
            "text-xs ml-2",
            premium ? 'text-primary-foreground/60' : 'text-muted-foreground/60'
          )}>
            {format}
          </span>
        </div>
        {premium && (
          <span className="ml-auto bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded-sm text-xs font-medium">
            Premium
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2 text-foreground">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>

        <Link
          href={href}
          className={cn(
            "inline-flex items-center text-sm font-medium transition-colors",
            premium
              ? 'text-primary'
              : 'text-foreground hover:text-primary'
          )}
        >
          {premium ? 'Purchase Now' : 'Download Free'}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {premium ? (
              <>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </>
            ) : (
              <>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </>
            )}
          </svg>
        </Link>
      </div>
    </div>
  );
}
