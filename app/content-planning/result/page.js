import ContentPlanningPage from "@/components/ContentPlanningPage";
import React from "react";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.contentPlanningResult });


function Page() {
  return <ContentPlanningPage />;
}

export default Page;
