import AdvancedKeywordAnalysisPage from "@/components/AdavancedKeywordAnalysisPage";
import React from "react";

export const metadata = {
  title: "Tool | Advanced Keyword Analysis Tool",
  description:
    "Analyze your content for SEO optimization and get insights to improve your website's search engine rankings.",
  openGraph: {
    title: "Tool | Advanced Keyword Analysis Tool",
    description:
      "Analyze your content for SEO optimization and get insights to improve your website's search engine rankings.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

function Page() {
  return <AdvancedKeywordAnalysisPage />;
}

export default Page;
