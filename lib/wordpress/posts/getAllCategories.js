import { fetchAPI } from "../api";

export async function getAllCategories() {
  const data = await fetchAPI(/* GraphQL */ `
    {
      categories(first: 100) {
        edges {
          node {
            id
            name
            slug
            description
            count
          }
        }
      }
    }
  `);

  return data.categories.edges.map(({ node }) => node);
} 