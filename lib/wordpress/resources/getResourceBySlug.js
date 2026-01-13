import { fetchAPI } from "../api";

export async function getResourceBySlug(slug) {
  const data = await fetchAPI(/* GraphQL */ `
    {
      resource(id: "${slug}", idType: SLUG) {
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
  `);

  if (!data.resource) {
    return null;
  }

  // Format the data to match the expected structure in ResourceContentPage
  const formattedResource = {
    title: data.resource.title,
    excerpt: data.resource.excerpt,
    content: data.resource.content,
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
    readTime: Math.ceil(data.resource.content.split(' ').length / 250), // Rough estimate: 200 words per minute
    postschema: data.resource.postschema || null,
  };

  return formattedResource;
} 