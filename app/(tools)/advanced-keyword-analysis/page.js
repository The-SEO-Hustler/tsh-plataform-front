import AdvancedKeywordAnalysisHero from "@/components/advanced-keyword-analysis-hero";
import React from "react";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata(SEO_DATA.advancedKeywordAnalysisHero);



function Page() {
  return <AdvancedKeywordAnalysisHero />
}

export default Page;
