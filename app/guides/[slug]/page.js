import React from 'react'
import { getAllResourcePage } from '@/lib/wordpress/resources/getAllResourcePage';
import { getResourceBySlug } from '@/lib/wordpress/resources/getResourceBySlug';
import ResourceContentPage from '@/components/ResourceContentPage';
import "@wordpress/block-library/build-style/common.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";
export const revalidate = 3600;


export async function generateStaticParams() {
  const allResources = await getAllResourcePage();

  // Filter only guide resources
  const guideResources = allResources.guides || [];

  return guideResources.map((resource) => ({
    slug: resource.slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const param = await params;
  if (!param?.slug) return {};

  const resource = await getResourceBySlug(param.slug);

  if (!resource) {
    return {
      title: 'Resource Not Found',
      description: 'The resource you\'re looking for doesn\'t exist or has been moved.',
    };
  }

  return {
    title: resource.title,
    description: resource.excerpt,
    openGraph: {
      title: resource.title,
      description: resource.excerpt,
      type: 'article',
      publishedTime: resource.modified,
      modifiedTime: resource.modified,
      authors: [resource.author],
      images: resource.featuredImage ? [
        {
          url: resource.featuredImage,
          alt: resource.featuredImageAlt,
        }
      ] : [],
    },
  };
}

async function Page({ params }) {
  const param = await params
  const resource = await getResourceBySlug(param.slug);

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Resource Not Found</h1>
        <p className="text-muted-foreground mb-8">The resource you're looking for doesn't exist or has been moved.</p>
        <a href="/guides" className="text-primary hover:underline">Back to Guides</a>
      </div>
    );
  }
  const response = await fetch(String(`${process.env.BACK_SITE_URL}/blog/resources/${param.slug}?no_redirect=true`));
  const html = await response.text();
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const styles = styleMatches ? styleMatches.map((styleTag) => styleTag.replace(/<\/?style[^>]*>/g, '')).join('\n') : '';

  return (
    <>
      {styles && (
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      )}
      <ResourceContentPage post={resource} />
    </>
  );
}

export default Page