import EvaluationPage from "@/components/EvaluationPage";
import React from "react";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.searchQualityEvaluator });


function Page() {
  return <div className="min-h-screen bg-background"><EvaluationPage /></div>;
}

export default Page;
