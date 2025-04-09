import { fetchAPI } from "../api";


export async function GET_RESOURCES(perPage = 100, offset = 0) {
  let endCursor = "";
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


    if (data.resources.edges[0].node.resourceTypes.edges[0].node.name === "guide") {
      resources.guides.push(data.resources.edges[0].node);
    } else if (data.resources.edges[0].node.resourceTypes.edges[0].node.name === "spreadsheet") {
      resources.spreadsheets.push(data.resources.edges[0].node);
    } else if (data.resources.edges[0].node.resourceTypes.edges[0].node.name === "ebook") {
      resources.ebooks.push(data.resources.edges[0].node);
    }
    endCursor = data.resources.pageInfo.endCursor;
    if (!data.resources.pageInfo.hasNextPage) break;

  }



  return resources;
}