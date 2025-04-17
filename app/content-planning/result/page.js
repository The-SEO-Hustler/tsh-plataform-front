import ContentPlanningPage from "@/components/ContentPlanningPage";
import React from "react";

export const metadata = {
  title: "Tool | Content Planning Tool",
  description:
    "Analyze your content for SEO optimization and get insights to improve your website's search engine rankings.",
  openGraph: {
    title: "Tool | Content Planning Tool",
    description:
      "Analyze your content for SEO optimization and get insights to improve your website's search engine rankings.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

function Page() {
  return <ContentPlanningPage />;
}

export default Page;
