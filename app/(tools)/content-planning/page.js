import ContentPlanningHero from "@/components/contentPlanningHero";
import React from "react";

import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';
import { tools } from "@/lib/toolsMetaData";
import { toolSchema } from "@/lib/schemas/tool-schema";
export const metadata = getMetadata({ ...SEO_DATA.contentPlanning });


function Page() {
  const tool = tools.find(tool => tool.href === "/content-planning");
  const schema = toolSchema(tool);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <ContentPlanningHero />
    </>
  );
}

export default Page;
