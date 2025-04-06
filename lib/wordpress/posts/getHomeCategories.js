import { fetchAPI } from "../api";

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query AllPosts {
        posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              slug
              date
              categories {
                edges {
                  node {
                    name
                    slug
                  }
                }
              }
              featuredImage {
                node {
                  sourceUrl
                }
              }
              author {
                node {
                  name
                  firstName
                  lastName
                  avatar {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.posts?.edges;
}