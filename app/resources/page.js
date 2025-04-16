import React from "react";
import Resources from "@/components/ResourcesPage";
import { GET_RESOURCES } from "@/lib/wordpress/resources/getAllResources";
import RecaptchaProvider from "@/components/RecaptchaProvider";
export const revalidate = 3600;


async function Page() {
  const resources = await GET_RESOURCES();
  return (
    <RecaptchaProvider>
      <Resources resources={resources} />
    </RecaptchaProvider>
  )
}

export default Page;
