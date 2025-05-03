import React from 'react'
import { getAllResourcePage } from '@/lib/wordpress/resources/getAllResourcePage';
import { getResourceBySlug } from '@/lib/wordpress/resources/getResourceBySlug';
import ResourceContentPage from '@/components/ResourceContentPage';
import "@wordpress/block-library/build-style/common.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";
import { notFound } from 'next/navigation';
import { getFaqSchema } from '@/lib/getFaqSchema';
import { transformContentUrls } from '@/lib/wordpress/utils';
import Script from 'next/script';
export const revalidate = 3600;


export async function generateStaticParams() {
  const allResources = await getAllResourcePage();

  // Filter only spreadsheet resources
  const spreadsheetResources = allResources.spreadsheets || [];

  return spreadsheetResources.map((resource) => ({
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
  const rawUrl = resource.featuredImage?.node?.sourceUrl
  const ogImageUrl = rawUrl
    ? `${process.env.NEXT_PUBLIC_FRONT_URL}/_next/image` +
    `?url=${encodeURIComponent(rawUrl)}` +
    `&w=1200&q=85`
    : null

  return {
    title: resource.title,
    description: resource.excerpt,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}/spreadsheets/${param.slug}`,
    },
    openGraph: {
      title: resource.title,
      description: resource.excerpt,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}/spreadsheets/${param.slug}`,
      publishedTime: resource.modified,
      modifiedTime: resource.modified,
      authors: [resource.author],
      images: ogImageUrl
        ? [
          {
            url: ogImageUrl,
            alt:
              resource.featuredImage.node.altText ||
              resource.title,
          },
        ]
        : [],
    },
  };
}

async function Page({ params }) {
  const resource = await getResourceBySlug(params.slug);

  if (!resource) {
    notFound();
  }
  let faqSchema = null;
  // Transform content URLs
  if (resource?.content) {
    resource.content = transformContentUrls(resource.content);
    faqSchema = getFaqSchema(resource.content);
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
      {faqSchema && (
        <Script
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(faqSchema)}
        </Script>
      )}
      <ResourceContentPage post={resource} />
    </>
  );
}

export default Page 