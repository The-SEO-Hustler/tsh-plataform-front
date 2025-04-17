import Link from 'next/link';
import { cn } from "@/lib/utils";

/**
 * SEO Tool Card Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Tool title
 * @param {string} props.description - Tool description
 * @param {React.ComponentType|React.ReactNode} props.Icon - Icon component from lucide-react or Next.js Image component
 * @param {string} props.href - Link to the tool
 * @param {boolean} props.featured - Whether this is a featured tool
 * @param {string} props.category - Tool category
 */
export default function ToolCard({ title, description, Icon, href, featured = false, category }) {
  return (
    <Link
      href={href}
      className={cn(
        "block group rounded-lg overflow-hidden h-full transition-all !no-underline",
        featured
          ? 'bg-primary/70 text-primary-foreground shadow-md'
          : 'bg-white text-foreground shadow-sm hover:shadow-md'
      )}
    >
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className={cn(
            "w-24 h-24 rounded-md flex items-center justify-center",
            featured ? 'bg-primary-foreground/20' : 'bg-accent/40'
          )}>
            {/* Display icon based on tool type */}
            {Icon && (
              typeof Icon === 'function' ? (
                <Icon className={cn(
                  "w-6 h-6",
                  featured ? 'text-primary-foreground' : 'text-accent-foreground'
                )} />
              ) : (
                <div className=" flex items-center justify-center">
                  {Icon}
                </div>
              )
            )}
          </div>

          {category && (
            <span className={cn(
              "ml-auto text-xs font-medium px-2 py-1 rounded-sm",
              featured ? 'bg-primary-foreground/20' : 'bg-accent text-accent-foreground'
            )}>
              {category}
            </span>
          )}
        </div>

        <h3 className={cn(
          "text-lg font-bold mb-2",
          featured ? 'text-primary-foreground' : 'text-foreground'
        )}>
          {title}
        </h3>

        <p className={cn(
          "text-sm",
          featured ? 'text-primary-foreground/80' : 'text-muted-foreground'
        )}>
          {description}
        </p>

        <div className="mt-4 flex items-center">
          <span className={cn(
            "text-sm font-medium",
            featured ? 'text-primary-foreground' : 'text-primary'
          )}>
            Try now
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className={cn(
            "w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform",
            featured ? 'text-primary-foreground' : 'text-primary'
          )} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </Link>
  );
}
