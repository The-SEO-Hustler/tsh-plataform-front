import { fetchAPI } from "../api";


export async function getAllResourcePage(perPage = 100, offset = 0) {
  let endCursor = "";
  let resourcesList = [];
  const resources = {
    playbooks: [],
    spreadsheets: [],
    ebooks: [],
  }
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
              modified
              content
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


  resourcesList.forEach(resource => {
    if (resource.node.resourceTypes.edges[0].node.name === "playbooks") {
      resources.playbooks.push(resource.node);
    } else if (resource.node.resourceTypes.edges[0].node.name === "spreadsheets") {
      resources.spreadsheets.push(resource.node);
    } else if (resource.node.resourceTypes.edges[0].node.name === "ebooks") {
      resources.ebooks.push(resource.node);
    }
  });

  return resources;
}