import React from "react";
import SeoCheckHero from "@/components/seo-check-hero";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata(SEO_DATA.seoCheck);

function Page() {
  return (
    <div className="hide-badge">
      <SeoCheckHero />
    </div>
  );
}

export default Page;
