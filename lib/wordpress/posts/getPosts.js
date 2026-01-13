import { fetchAPI } from "../api";

export async function GET_POSTS(perPage = 100, offset = 0) {
  const posts = [];
  let endCursor = "";
  while (true) {
    const data = await fetchAPI(/* GraphQL */ `
    {
      posts(after: "${endCursor}", first: 100) {
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
      }
    }
  `);
    posts.push(...data.posts.edges);
    endCursor = data.posts.pageInfo.endCursor;
    if (!data.posts.pageInfo.hasNextPage) break;
  }
  return posts;
}
