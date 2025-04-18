import { fetchAPI } from "../api";


export async function GET_RESOURCES(perPage = 100, offset = 0) {
  let endCursor = "";
  const resourcesList = [];
  const resources = {
    guides: [],
    spreadsheets: [],
    ebooks: [],
  }
  while (true) {
    const data = await fetchAPI(/* GraphQL */ `
    {
      resources(after: "${endCursor}", first: 100) {
        pageInfo{
          hasNextPage
          endCursor
        }
        edges {
          node {
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
    }
  `);

    resourcesList.push(...data.resources.edges);

    endCursor = data.resources.pageInfo.endCursor;
    if (!data.resources.pageInfo.hasNextPage) break;

  }

  resourcesList.forEach(resource => {
    if (resource.node.resourceTypes.edges[0].node.name === "guides") {
      resources.guides.push(resource.node);
    } else if (resource.node.resourceTypes.edges[0].node.name === "spreadsheets") {
      resources.spreadsheets.push(resource.node);
    } else if (resource.node.resourceTypes.edges[0].node.name === "ebooks") {
      resources.ebooks.push(resource.node);
    }
  });

  return resources;
}