import { fetchAPI } from "../api";

export async function getAllPostsWithSlug() {
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
            slug
            modified
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