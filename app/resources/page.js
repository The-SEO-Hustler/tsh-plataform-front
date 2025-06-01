import React from "react";
import Resources from "@/components/ResourcesPage";
import { GET_RESOURCES } from "@/lib/wordpress/resources/getAllResources";
import RecaptchaProvider from "@/components/RecaptchaProvider";
export const revalidate = 3600;
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';
import { resourcesSchema } from '@/lib/schemas/resources-schema';
export const metadata = getMetadata(SEO_DATA.resources);

async function Page() {
  const resources = await GET_RESOURCES();
  const resourcesSchemaJson = resourcesSchema(resources);
  return (
    <RecaptchaProvider>
      <script type="application/ld+json">{JSON.stringify(resourcesSchemaJson)}</script>
      <Resources resources={resources} />
    </RecaptchaProvider>
  )
}

export default Page;
