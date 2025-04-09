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
  const resource = await getResourceBySlug(params.slug);

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Resource Not Found</h1>
        <p className="text-muted-foreground mb-8">The resource you're looking for doesn't exist or has been moved.</p>
        <a href="/guides" className="text-primary hover:underline">Back to Guides</a>
      </div>
    );
  }

  return (
    <ResourceContentPage post={resource} />
  );
}

export default Page