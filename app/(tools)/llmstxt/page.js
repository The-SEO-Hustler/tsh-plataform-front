import LLMTxtHero from "@/components/llmtxtHero";
import React from "react";

import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.llmtxt });


function Page() {
  return <LLMTxtHero />
}

export default Page;
