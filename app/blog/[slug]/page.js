import { notFound } from "next/navigation";
import "@wordpress/block-library/build-style/common.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";
import { getPostAndMorePosts } from "@/lib/wordpress/posts/getPostAndMorePosts";
import { getAllPostsWithSlug } from "@/lib/wordpress/posts/getAllPostsWithSlug";
import { cleanExcerpt } from "@/lib/wordpress/cleanExcerpt";
import Script from 'next/script'
import { getFaqSchema } from "@/lib/getFaqSchema";
import { indexContent } from '@/lib/indexContent'
import organizeToc from '@/lib/organizeToc'
import {
  transformContentUrls,
  createPostSchema,
} from "@/lib/wordpress/utils";
import { blogPostSchema } from "@/lib/schemas/blog-post-schema";
import { fetchWordPressStyles, loadForStaticPage } from "@/lib/wordpress/api";
// import getReactContentWithLazyBlocks from "@/lib/get-react-content-with-lazy-blocks";
import BlogContentPage from "@/components/BlogContent";
import MoveUpButton from "@/components/MoveUpButton";
export const revalidate = 3600;

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const allPosts = await getAllPostsWithSlug();
    return (allPosts || [])
      .filter(({ node }) => node?.slug)
      .map(({ node }) => ({
        slug: node.slug,
      }));
  } catch (error) {
    console.error("Failed to generate blog params:", error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const param = await params;
  if (!param?.slug) return {};

  let data = null;
  try {
    data = await getPostAndMorePosts(param.slug);
  } catch (error) {
    console.error(`Blog metadata fetch failed for ${param.slug}:`, error?.message || error);
    return { title: "Article" };
  }

  if (!data?.post) {
    return {
      title: "Article Not Found",
      description:
        "The article you're looking for doesn't exist or has been moved.",
    };
  }
  const wpSeoDescription = data.post.seo?.metaDesc;
  const excerptText = cleanExcerpt(wpSeoDescription || data.post.excerpt)
  // 1. Construct the proxied OG image URL
  const rawUrl = data.post.featuredImage?.node?.sourceUrl
  const ogImageUrl = rawUrl
    ? `${process.env.NEXT_PUBLIC_FRONT_URL}/_next/image` +
    `?url=${encodeURIComponent(rawUrl)}` +
    `&w=1200&q=85`
    : null

  return {
    title: data.post.title,
    description: excerptText,
    publisher: "The SEO Hustler",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}/blog/${param.slug}`,
    },
    openGraph: {
      title: data.post.title,
      description: excerptText,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}/blog/${param.slug}`,
      publishedTime: data.post.date,
      publisher: "The SEO Hustler",
      author: [data.post.author?.node?.name],
      modifiedTime: data.post.modified,
      authors: [data.post.author?.node?.name],
      images: ogImageUrl
        ? [
          {
            url: ogImageUrl,
            alt:
              data.post.featuredImage.node.altText ||
              data.post.title,
          },
        ]
        : [],
    },
  };
}

// Main page component
export default async function BlogPost({ params }) {
  const param = await params;

  const { value: data, failed } = await loadForStaticPage(
    `Blog ${param.slug}`,
    () => getPostAndMorePosts(param.slug),
    null
  );

  if (failed) {
    return (
      <div className="bg-background px-6 py-24 text-center text-foreground">
        <p>This article could not be generated just now. Refresh to try again.</p>
      </div>
    );
  }

  if (!data?.post) {
    notFound();
  }
  let faqSchema = null;
  // Transform content URLs
  if (data?.post?.content) {
    data.post.content = transformContentUrls(data.post.content);
    faqSchema = getFaqSchema(data.post.content);
  }


  // Transform related article URLs
  if (data?.post?.relatedArticle?.relatedArticles) {
    data.post.relatedArticle.relatedArticles =
      data.post.relatedArticle.relatedArticles.map((article) => {
        article.link = transformContentUrls(article.link);
        return article;
      });
  }


  // Create schema markup
  data.post.seo = createPostSchema(data.post);
  const schemaMarkup = blogPostSchema(data.post);
  const { new_content, list } = indexContent(data.post?.content)
  const newList = organizeToc(list)

  // Format post data for the BlogContentPage component
  const formattedPost = {
    title: data.post.title,
    content: new_content,
    toc: newList,
    excerpt: data.post.excerpt,
    featuredImage: data.post.featuredImage?.node?.sourceUrl || null,
    featuredImageAlt: data.post.featuredImage?.node?.altText || data.post.title,
    date: new Date(data.post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    publishedDate: new Date(data.post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    publishedIso: data.post.date,
    updatedDate: data.post.modified
      ? new Date(data.post.modified).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,
    modifiedIso: data.post.modified || null,
    author: data.post.author?.node?.name || "Unknown Author",
    category: data.post.categories?.edges[0]?.node?.name || "Uncategorized",
    categories:
      data.post.categories?.edges?.map((edge) => edge.node.name) || [],
    readTime: Math.ceil((data.post.content || "").split(" ").length / 250),
    authorAvatar: data.post.author?.node?.avatar?.url,
    tags: data.post.tags?.edges?.map((edge) => edge.node.name) || [],
    relatedPosts: data.post.relatedArticle?.relatedArticles || [],
    seoTerms: data.post.seoTerms,
  };

  // Format blog posts data for related posts
  const blogPostsData = (data.posts?.edges || [])
    .filter(({ node }) => node)
    .map(({ node }) => {
    return {
      ...node,
      date: new Date(node.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  });
  const styles = await fetchWordPressStyles(
    `/blog/${encodeURIComponent(param.slug)}?no_redirect=true`
  );

  return (
    <>
      {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}
      <script type="application/ld+json" id="schema-markup">{JSON.stringify(schemaMarkup)}</script>
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(faqSchema)}
        </Script>
      )}

      <BlogContentPage
        post={formattedPost}
        blogPostsData={blogPostsData}
        toc={newList}
      // content={contentWithLazyBlocks}
      />
      <MoveUpButton />
    </>
  );
}
