import React from "react";
import Resources from "@/components/ResourcesPage";
import { GET_RESOURCES } from "@/lib/wordpress/resources/getAllResources";

export const revalidate = 3600;


async function Page() {
  const resources = await GET_RESOURCES();
  console.log(resources);
  return <Resources resources={resources} />;
}

export default Page;
