import React from "react";
import Tools from "@/components/ToolsPage";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata(SEO_DATA.tools);


function Page() {
  return <Tools />;
}

export default Page;
