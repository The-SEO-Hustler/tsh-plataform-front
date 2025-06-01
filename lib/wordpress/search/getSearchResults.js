import { fetchAPI } from "../api";

/**
 * Search across posts, resources, spreadsheets, and guides.
 * Returns an object:
 * {
 *   posts: [{ id, title, slug, excerpt }] ,
 *   resources: [{ id, title, slug, excerpt }],
 *   spreadsheets: [{ id, title, slug, excerpt }],
 *   guides: [{ id, title, slug, excerpt }]
 * }
 */
export async function getSearchResults(keyword) {
  if (!keyword) {
    return { posts: [], resources: [], spreadsheets: [], guides: [] };
  }

  const query = `
    query SearchEverything {
      posts(where: { search: "${keyword}", status: PUBLISH }) {
        nodes {
          date
              modified
              id
              title
              excerpt
              slug
              postStatus {
                postPassword
                protected
              }
              categories {
                edges {
                  node {
                    name
                    slug
                  }
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
      resources(where: { search: "${keyword}", status: PUBLISH }) {
        nodes {
          date
              modified
              id
              title
              excerpt
              slug
              resourceTypes{
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
    
    }
  `;

  const data = await fetchAPI(query);

  const allPosts = data.posts.nodes;
  const blogPosts = allPosts.map((node) => {
    // Sanitize excerpt to ensure consistent rendering
    const excerpt = node.excerpt ? node.excerpt.replace(/<[^>]*>/g, '') : '';

    return {
      title: node.title,
      excerpt: excerpt,
      category: node.categories?.edges[0]?.node?.name || 'Uncategorized',
      categorySlug: node.categories?.edges[0]?.node?.slug || 'uncategorized',
      slug: node.slug,
      date: new Date(node.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      readTime: Math.ceil(excerpt.split(' ').length / 250), // Rough estimate
      featuredImage: node.featuredImage?.node?.sourceUrl || '/images/blog-placeholder.jpg',
      featuredImageAlt: node.featuredImage?.node?.altText || node.title,
    };
  });
  return {
    posts: blogPosts,
    resources: data.resources.nodes

  };
}