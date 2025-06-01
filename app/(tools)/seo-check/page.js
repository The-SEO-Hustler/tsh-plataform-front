import React from "react";
import SeoCheckHero from "@/components/seo-check-hero";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';
import { tools } from "@/lib/toolsMetaData";
import { toolSchema } from "@/lib/schemas/tool-schema";

export const metadata = getMetadata(SEO_DATA.seoCheck);

function Page() {
  const tool = tools.find(tool => tool.href === "/seo-check");
  const schema = toolSchema(tool);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <div className="hide-badge">
        <SeoCheckHero />
      </div>
    </>
  );
}

export default Page;
