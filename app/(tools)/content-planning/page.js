import ContentPlanningHero from "@/components/contentPlanningHero";
import React from "react";

import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.contentPlanning });


function Page() {
  return <ContentPlanningHero />
}

export default Page;
