// app/search/page.js
import Link from 'next/link';
import { getSearchResults } from '@/lib/wordpress/search/getSearchResults';
import ResourceCard from '@/components/ResourceCard';
import Container from '@/components/container';
import BlogCard from '@/components/BlogCard';
import { tools } from '@/lib/toolsMetaData';
import ToolCard from '@/components/ToolCard';
export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  // If no query provided, show a simple form or message
  if (!query) {
    return (
      <Container>
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p>Please enter a search term in the URL, e.g. <code>?q=seo</code>.</p>
      </Container>
    );
  }

  // Fetch matching items from WP
  let results = { posts: [], resources: [] };
  let toolsResults = [];
  try {
    results = await getSearchResults(query);
    toolsResults = tools.filter((tool) => tool.title.toLowerCase().includes(query.toLowerCase()) || tool.description.toLowerCase().includes(query.toLowerCase()));
  } catch (err) {
    console.error("Error fetching search results:", err);
  }



  return (
    <Container >
      <div className="py-12">

        <h1 className="text-2xl font-bold mb-4">Search results for “{query}”</h1>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsResults.length > 0 ? (
              toolsResults.map((tool, index) => {
                return (
                  <ToolCard
                    key={index}
                    title={tool.title}
                    description={tool.description}
                    Icon={tool.Icon}
                    href={tool.href}
                  />
                )
              })) : (
              <p className="text-foreground/80">No tools found.</p>
            )}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.posts.length > 0 ? (
              results.posts.map((post, index) => {
                return (
                  <BlogCard
                    key={index}
                    post={post}
                  />
                )
              })) : (
              <p className="text-foreground/80">No posts found.</p>
            )}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.resources?.length > 0 ? (
              results.resources.map((resource) => {
                return (
                  <ResourceCard
                    key={resource.id}
                    title={resource.title}
                    excerpt={resource.excerpt}
                    resourceTypes={resource.resourceTypes}
                    author={resource.author}
                    featuredImage={resource.featuredImage}
                    slug={resource.slug}
                  />
                )
              })) : (
              <p className="text-foreground/80">No resources found.</p>
            )}

          </div>
        </div>

        {/* If nothing found in any type */}
        {Object.values(results).every((arr) => arr.length === 0) && toolsResults.length === 0 && (
          <p className="mt-4 text-foreground/80">No results found.</p>
        )}
      </div>

    </Container>
  );
}
