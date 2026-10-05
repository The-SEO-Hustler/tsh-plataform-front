import EvaluationPage from "@/components/EvaluationPage";
import React from "react";
import getMetadata from "@/lib/getMetadata";
import SEO_DATA from "@/lib/seo-data";
import { getAllPostsForHome } from "@/lib/wordpress/posts/getHomeCategories";

export const metadata = getMetadata({
  ...SEO_DATA.searchQualityEvaluatorResult,
});

async function Page() {
  let latestPosts = [];
  try {
    latestPosts = (await getAllPostsForHome()) || [];
  } catch (error) {
    console.error("E-E-A-T related posts unavailable:", error?.message || error);
  }
  const blogPosts = latestPosts.filter((edge) => edge?.node).map(({ node }) => {
    // Sanitize excerpt to ensure consistent rendering
    const excerpt = node.excerpt ? node.excerpt.replace(/<[^>]*>/g, "") : "";

    return {
      title: node.title,
      excerpt: excerpt,
      category: node.categories?.edges[0]?.node?.name || "Uncategorized",
      categorySlug: node.categories?.edges[0]?.node?.slug || "uncategorized",
      slug: node.slug,
      date: new Date(node.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: Math.ceil(excerpt.split(" ").length / 250), // Rough estimate
      featuredImage:
        node.featuredImage?.node?.sourceUrl || "/images/blog-placeholder.jpg",
      featuredImageAlt: node.featuredImage?.node?.altText || node.title,
    };
  });
  return (
    <div className="min-h-screen bg-background">
      <EvaluationPage blogPosts={blogPosts} />
    </div>
  );
}

export default Page;
