import AdvancedKeywordAnalysisPage from "@/components/AdavancedKeywordAnalysisPage";
import React from "react";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.advancedKeywordAnalysisResult });


function Page() {
  return <div className="min-h-screen bg-background"><AdvancedKeywordAnalysisPage /></div>;
}

export default Page;
