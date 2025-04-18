import ContentPlanningHero from "@/components/contentPlanningHero";
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
};

function Page() {
  return <ContentPlanningHero />
}

export default Page;
