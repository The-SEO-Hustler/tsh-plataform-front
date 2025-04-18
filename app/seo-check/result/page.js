import React from "react";
import SEOAuditPage from "@/components/SeoCheck";

export const metadata = {
  title: "Tool | SEO Check Tool",
  description: "Check your website's SEO score and get insights to improve your website's search engine rankings. ",
  openGraph: {
    title: "Tool | SEO Check Tool",
    description:
      "Check your website's SEO score and get insights to improve your website's search engine rankings.",
  },
  robots: {
    index: false,
    follow: false,
  },
};
function Page() {
  return <div className="min-h-screen"><SEOAuditPage /></div>;
}

export default Page;
