import LLMTxtResultPage from "@/components/LLMTxtResultPage";
import React from "react";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.llmtxtResult });


function Page() {
  return <div className="min-h-screen bg-background"><LLMTxtResultPage /></div>;
}

export default Page;
