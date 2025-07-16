import React from "react";
import SearchIntentResult from "@/components/SearchIntentResult";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.searchIntentResult });

function Page() {
  return <div className="min-h-screen bg-background text-foreground"><SearchIntentResult /></div>;
}

export default Page;