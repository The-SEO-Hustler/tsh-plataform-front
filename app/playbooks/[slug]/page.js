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
import { resourcePostSchema } from '@/lib/schemas/resource-post-schema';
import { indexContent } from '@/lib/indexContent'
import organizeToc from '@/lib/organizeToc'
export const revalidate = 3600;


export async function generateStaticParams() {
  const allResources = await getAllResourcePage();

  // Filter only guide resources
  const playbookResources = allResources.playbooks || [];

  return playbookResources.map((resource) => ({
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
    openGraph: {
      title: resource.title,
      description: resource.excerpt,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}/playbooks/${param.slug}`,
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
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}/playbooks/${param.slug}`,
    },
  };
}

async function Page({ params }) {
  const param = await params
  const resource = await getResourceBySlug(param.slug);
  const schema = resourcePostSchema(resource, 'playbooks', 'Playbook');

  let faqSchema = null;
  // Transform content URLs

  if (!resource) {
    notFound();
  }

  if (resource?.content) {
    resource.content = transformContentUrls(resource.content);
    faqSchema = getFaqSchema(resource.content);
  }
  const { new_content, list } = indexContent(resource.content)
  const newList = organizeToc(list)
  resource.content = new_content

  const response = await fetch(String(`${process.env.BACK_SITE_URL} /blog/resources / ${param.slug}?no_redirect = true`));
  const html = await response.text();
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const styles = styleMatches ? styleMatches.map((styleTag) => styleTag.replace(/<\/?style[^>]*>/g, '')).join('\n') : '';

  return (
    <>
      {styles && (
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      )}

      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      {faqSchema && (
        <Script
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(faqSchema)}
        </Script>
      )}
      <div className="bg-background">
        <ResourceContentPage post={resource} toc={newList} />
      </div>
    </>
  );
}

export default Page