import { notFound } from 'next/navigation';
import "@wordpress/block-library/build-style/common.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";
import { getPostAndMorePosts } from '@/lib/wordpress/posts/getPostAndMorePosts';
import { getAllPostsWithSlug } from '@/lib/wordpress/posts/getAllPostsWithSlug';
import { getAllCategories } from '@/lib/wordpress/posts/getAllCategories';
import { transformContentUrls, getSeoTerm, createPostSchema } from '@/lib/wordpress/utils';
import BlogContentPage from '@/components/BlogContent';

export const revalidate = 3600;

// Generate static params for all blog posts
export async function generateStaticParams() {
  const allPosts = await getAllPostsWithSlug();
  // console.log('allPosts', allPosts);

  return allPosts.map(({ node }) => ({
    slug: node.slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const param = await params
  if (!param?.slug) return {};

  const data = await getPostAndMorePosts(param.slug);

  if (!data?.post) {
    return {
      title: 'Article Not Found',
      description: 'The article you\'re looking for doesn\'t exist or has been moved.',
    };
  }

  return {
    title: data.post.title,
    description: data.post.excerpt,
    openGraph: {
      title: data.post.title,
      description: data.post.excerpt,
      type: 'article',
      publishedTime: data.post.date,
      modifiedTime: data.post.modified,
      authors: [data.post.author?.node?.name],
      images: data.post.featuredImage?.node?.sourceUrl ? [
        {
          url: data.post.featuredImage.node.sourceUrl,
          alt: data.post.featuredImage.node.altText || data.post.title,
        }
      ] : [],
    },
  };
}

// Main page component
export default async function BlogPost({ params }) {

  const param = await params

  const data = await getPostAndMorePosts(param.slug);

  if (!data?.post) {
    notFound();
  }

  // Transform content URLs
  if (data?.post?.content) {
    data.post.content = transformContentUrls(data.post.content);
  }

  // Transform related article URLs
  if (data?.post?.relatedArticle?.relatedArticles) {
    data.post.relatedArticle.relatedArticles = data.post.relatedArticle.relatedArticles.map((article) => {
      article.link = transformContentUrls(article.link);
      return article;
    });
  }

  // Get all categories
  const allCategories = await getAllCategories();

  // Create schema markup
  data.post.seo = createPostSchema(data.post);

  // Format post data for the BlogContentPage component
  const formattedPost = {
    title: data.post.title,
    content: data.post.content,
    excerpt: data.post.excerpt,
    date: new Date(data.post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    author: data.post.author?.node?.name || 'Unknown Author',
    category: data.post.categories?.edges[0]?.node?.name || 'Uncategorized',
    categories: data.post.categories?.edges?.map(edge => edge.node.name) || [],
    readTime: Math.ceil(data.post.content.split(' ').length / 250), // Rough estimate: 200 words per minute
    author: data.post.author?.node?.name,
    authorAvatar: data.post.author?.node?.avatar?.url,
    tags: data.post.tags?.edges?.map(edge => edge.node.name) || [],
    relatedPosts: data.post.relatedArticle?.relatedArticles || [],
    seoTerms: data.post.seoTerms,
  };

  // Format blog posts data for related posts
  const blogPostsData = data.posts.edges.map(({ node }) => {
    return {
      ...node,
      date: new Date(node.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  });
  const response = await fetch(String(`${process.env.BACK_SITE_URL}/blog/${param.slug}?no_redirect=true`));
  const html = await response.text();
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const styles = styleMatches ? styleMatches.map((styleTag) => styleTag.replace(/<\/?style[^>]*>/g, '')).join('\n') : '';

  return (
    <>
      {styles && (
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      )}
      <BlogContentPage post={formattedPost} blogPostsData={blogPostsData} />
    </>
  );
}