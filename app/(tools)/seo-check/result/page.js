import React from "react";
import SEOAuditPage from "@/components/SeoCheck";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.seoCheckResult });

function Page() {
  return <div className="min-h-screen"><SEOAuditPage /></div>;
}

export default Page;
