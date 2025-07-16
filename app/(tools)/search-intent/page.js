import React from "react";
import SearchIntentHero from "@/components/search-intent-hero";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';
import { tools } from "@/lib/toolsMetaData";
import { toolSchema } from "@/lib/schemas/tool-schema";

export const metadata = getMetadata(SEO_DATA.searchIntent);

function Page() {
  const tool = tools.find(tool => tool.href === "/search-intent");
  const schema = toolSchema(tool);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <div className="hide-badge">
        <SearchIntentHero />
      </div>
    </>
  );
}

export default Page;
