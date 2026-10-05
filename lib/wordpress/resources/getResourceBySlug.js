import { cache } from "react";
import { fetchAPI } from "../api";

export const getResourceBySlug = cache(async function getResourceBySlug(slug) {
  if (!slug || typeof slug !== "string") return null;

  const data = await fetchAPI(/* GraphQL */ `
    query ResourceBySlug($slug: ID!) {
      resource(id: $slug, idType: SLUG) {
        date
        modified
        id
        title
        excerpt
        slug
        content
        resourceTypes {
          edges {
            node {
              name
              slug
            }
          }
        }
        resourceTags {
          nodes {
            name
          }
        }
        author {
          node {
            avatar {
              url
            }
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `, {
    variables: { slug },
  });

  if (!data?.resource) {
    return null;
  }

  const content = data.resource.content || "";

  // Format the data to match the expected structure in ResourceContentPage
  const formattedResource = {
    title: data.resource.title,
    excerpt: data.resource.excerpt,
    slug: data.resource.slug,
    content,
    date: new Date(data.resource.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    rawDate: data.resource.date,
    modified: data.resource.modified,
    author: data.resource.author?.node?.name || 'Unknown Author',
    authorAvatar: data.resource.author?.node?.avatar?.url || null,
    authorSlug: data.resource.author?.node?.slug || '',
    category: data.resource.resourceTypes?.edges?.[0]?.node?.name || 'Resource',
    categories: data.resource.resourceTags?.nodes?.map(tag => tag.name) || [],
    featuredImage: data.resource.featuredImage?.node?.sourceUrl || null,
    featuredImageAlt: data.resource.featuredImage?.node?.altText || data.resource.title,
    readTime: Math.ceil(content.split(/\s+/).filter(Boolean).length / 250) || 1,
    postschema: data.resource.postschema || null,
  };

  return formattedResource;
}); 