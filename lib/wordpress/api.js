const API_URL = process.env.WORDPRESS_API_URL;
import { isEmpty } from "lodash";
export async function fetchAPI(
  query = "",
  { variables } = {},
  authToken = ""
) {
  const headers = { "Content-Type": "application/json" };

  //if has authToken it will send a POST with admin authorization, used to get post previews for example
  if (!isEmpty(authToken)) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  // WPGraphQL Plugin must be enabled
  const res = await fetch(API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}