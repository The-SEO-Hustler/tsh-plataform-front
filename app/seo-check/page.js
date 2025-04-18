import React from "react";
import SeoCheckHero from "@/components/seo-check-hero";

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
  return (
    <div className="hide-badge">
      <SeoCheckHero />
    </div>
  );
}

export default Page;
