import React from "react";

import getMetadata from "@/lib/getMetadata";
import SEO_DATA from "@/lib/seo-data";
import EEATCheckerHero from "@/components/EEATCheckerHero";
import { tools } from "@/lib/toolsMetaData";
import { toolSchema } from "@/lib/schemas/tool-schema";
export const metadata = getMetadata({ ...SEO_DATA.searchQualityEvaluator });

function Page() {
  const tool = tools.find(tool => tool.href === "/eeat-checker");
  const schema = toolSchema(tool);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <EEATCheckerHero />
    </>
  );
}

export default Page;
