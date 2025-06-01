import React from "react";
import Tools from "@/components/ToolsPage";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';
import { freeToolsSchema } from "@/lib/schemas/free-tools-schema";
export const metadata = getMetadata(SEO_DATA.tools);


function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(freeToolsSchema)}
      </script>
      <Tools />
    </>
  );
}

export default Page;
