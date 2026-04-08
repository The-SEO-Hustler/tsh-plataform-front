import { fetchAPI } from "../api";


export async function getAllResourcePage(
  perPage = 100,
  offset = 0,
  { includeContent = true, order = "DESC" } = {},
) {
  // NOTE: offset is currently unused (WPGraphQL cursor pagination)
  const first = perPage;

  const contentField = includeContent ? "content" : "";

  const data = await fetchAPI(/* GraphQL */ `
    query ResourcesForPages($first: Int!, $order: OrderEnum!) {
      resources(first: $first, where: { orderby: { field: DATE, order: $order } }) {
        edges {
          node {
            date
            modified
            id
            title
            excerpt
            slug
            ${contentField}
            resourceTypes {
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
      }
    }
  `, {
    variables: { first, order },
  });

  const resources = {
    playbooks: [],
    spreadsheets: [],
    ebooks: [],
  };

  const edges = data?.resources?.edges || [];
  edges.forEach(({ node }) => {
    const typeName = node?.resourceTypes?.edges?.[0]?.node?.name;
    if (typeName === "playbooks") {
      resources.playbooks.push(node);
    } else if (typeName === "spreadsheets") {
      resources.spreadsheets.push(node);
    } else if (typeName === "ebooks") {
      resources.ebooks.push(node);
    }
  });

  return resources;
}

export async function getLatestResourcesForHome(limit = 3) {
  const grouped = await getAllResourcePage(limit, 0, { includeContent: false });
  const flat = grouped.playbooks.concat(grouped.spreadsheets, grouped.ebooks);
  // Keep stable ordering by modified/date descending as delivered by the API.
  return flat.slice(0, limit);
}