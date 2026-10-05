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
import { fetchWordPressStyles } from '@/lib/wordpress/api';
export const revalidate = 3600;


export async function generateStaticParams() {
  try {
    const allResources = await getAllResourcePage();
    const playbookResources = allResources?.playbooks || [];

    return playbookResources
      .filter((resource) => resource?.slug)
      .map((resource) => ({
        slug: resource.slug,
      }));
  } catch (error) {
    console.error("Failed to generate playbook params:", error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const param = await params;
  if (!param?.slug) return {};

  let resource = null;
  try {
    resource = await getResourceBySlug(param.slug);
  } catch (error) {
    console.error(`Playbook metadata fetch failed for ${param.slug}:`, error);
    return { title: "Playbook" };
  }

  if (!resource) {
    return {
      title: 'Resource Not Found',
      description: 'The resource you\'re looking for doesn\'t exist or has been moved.',
    };
  }
  const rawUrl = resource.featuredImage || null
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
            alt: resource.featuredImageAlt || resource.title,
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
  if (!param?.slug) notFound();

  const resource = await getResourceBySlug(param.slug);

  if (!resource?.slug) {
    notFound();
  }

  let faqSchema = null;
  // Transform content URLs

  if (resource?.content) {
    resource.content = transformContentUrls(resource.content);
    faqSchema = getFaqSchema(resource.content);
  }
  const { new_content, list } = indexContent(resource.content)
  const newList = organizeToc(list || [])
  resource.content = new_content

  const schema = resourcePostSchema(resource, 'playbooks', 'Playbook');
  const styles = await fetchWordPressStyles(
    `/blog/resources/${encodeURIComponent(param.slug)}?no_redirect=true`
  );

  return (
    <>
      {styles && (
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      )}

      {schema && (
        <script type="application/ld+json" id="schema-markup">{JSON.stringify(schema)}</script>
      )}

      {faqSchema && (
        <Script
          id="faq-schema"
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