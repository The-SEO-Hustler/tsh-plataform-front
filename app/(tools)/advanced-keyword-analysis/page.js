import AdvancedKeywordAnalysisHero from "@/components/advanced-keyword-analysis-hero";
import React from "react";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';
import { tools } from "@/lib/toolsMetaData";
import { toolSchema } from "@/lib/schemas/tool-schema";
export const metadata = getMetadata(SEO_DATA.advancedKeywordAnalysisHero);



function Page() {
  const tool = tools.find(tool => tool.href === "/advanced-keyword-analysis");
  const schema = toolSchema(tool);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <AdvancedKeywordAnalysisHero />
    </>
  );
}

export default Page;
