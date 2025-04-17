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
};
function Page() {
  return <SEOAuditPage />;
}

export default Page;
