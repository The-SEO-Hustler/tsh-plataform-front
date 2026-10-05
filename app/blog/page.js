import { GET_POSTS } from '@/lib/wordpress/posts/getPosts';
import { getAllCategories } from '@/lib/wordpress/posts/getAllCategories';
import BlogClient from '@/components/BlogClient';
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';
import { blogSchema } from '@/lib/schemas/blog-schema';
import { loadForStaticPage } from '@/lib/wordpress/api';
export const metadata = getMetadata(SEO_DATA.blog);



export default async function Blog() {
  // Fetch all posts
  const { value: allPosts } = await loadForStaticPage(
    "Blog index",
    () => GET_POSTS(),
    []
  );
  const { value: allCategories } = await loadForStaticPage(
    "Blog categories",
    () => getAllCategories(),
    []
  );

  // Format categories for the client component
  const categories = [
    { id: "all", label: "All Posts" },
    ...(allCategories || []).map(category => ({
      id: category.slug,
      label: category.name,
    })),
  ];

  // Format blog posts for the client component
  const blogPosts = (allPosts || [])
    .filter(({ node }) => node)
    .map(({ node }) => {
    // Sanitize excerpt to ensure consistent rendering
    const excerpt = node.excerpt ? node.excerpt.replace(/<[^>]*>/g, '') : '';

    return {
      title: node.title,
      excerpt: excerpt,
      category: node.categories?.edges[0]?.node?.name || 'Uncategorized',
      categorySlug: node.categories?.edges[0]?.node?.slug || 'uncategorized',
      slug: node.slug,
      date: new Date(node.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      readTime: Math.ceil(excerpt.split(' ').length / 250), // Rough estimate
      featuredImage: node.featuredImage?.node?.sourceUrl || '/images/blog-placeholder.jpg',
      featuredImageAlt: node.featuredImage?.node?.altText || node.title,
    };
  });
  const blogSchemaJson = blogSchema(blogPosts);

  return <>
    <script type="application/ld+json">{JSON.stringify(blogSchemaJson)}</script>
    <BlogClient categories={categories} blogPosts={blogPosts} />
  </>
}
