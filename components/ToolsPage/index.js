"use client";
import { useState } from "react";
import FeatureSection from "@/components/FeatureSection";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import Image from "next/image";
import { Book } from 'lucide-react';
export default function Tools() {
  // State for category filter
  const [activeCategory, setActiveCategory] = useState("All Tools");

  // Tool categories
  const categories = [
    { id: "all", label: "All Tools" },
    { id: "on-page-seo-checker", label: "On Page SEO Checker" },
    { id: "future-tools", label: "Future Tools" },
  ];

  // SEO Tools data
  const tools = [
    // Keyword Research Tools
    {
      title: "SEO Page Checker",
      description:
        "Check your on page SEO score and get real-time suggestions to improve your website.",
      Icon: (
        <Image
          src="/on-page-checker-logo.png"
          alt="Keyword Explorer"
          width={124}
          height={124}
          className="w-24 h-24 rounded-md"
        />
      ),
      href: "/seo-check",
      category: "On Page SEO Checker",
      featured: false,
    },
    {
      title: "Content Planning Tool",
      description:
        "Plan your content for your website with our content planning tool.",
      Icon: <Book width={56} height={56} strokeWidth={1.5} className=" rounded-md" />,
      href: "/content-planning",
      category: "Content Planning Tool",
      featured: false,
    },

    // // Future Tools
    // {
    //   title: "AI Content Generator",
    //   description:
    //     "Generate SEO-optimized content with our advanced AI technology. Coming soon!",
    //   Icon: <Brain size={48} />,
    //   href: "#",
    //   category: "Future Tools",
    //   featured: false,
    // },
    // {
    //   title: "Voice Search Optimizer",
    //   description:
    //     "Optimize your content for voice search queries. Coming soon!",
    //   Icon: <Rocket size={48} />,
    //   href: "#",
    //   category: "Future Tools",
    // },
  ];

  // Filter tools based on active category
  const filteredTools =
    activeCategory === "All Tools"
      ? tools
      : tools.filter(
        (tool) => tool.category.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#4e503a] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#FFDD00"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Free SEO Tools
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Access professional-grade SEO tools to research keywords, analyze
              competitors, optimize content, and more - completely free.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter Categories */}
      <section className="py-2 md:py-6 bg-white border-b border-gray-200 sticky top-16 z-20">
        <Container className="!px-0 md:!px-6">
          <div className="flex overflow-x-auto no-scrollbar gap-3 justify-start md:justify-center">
            {categories.map((category, idx) => (
              <Button
                key={category.id}
                variant={
                  activeCategory === category.label ? "default" : "ghost"
                }
                size="sm"
                onClick={() => setActiveCategory(category.label)}
                className={`rounded-full cursor-pointer ${idx === 0 ? "ml-4 md:ml-0" : ""
                  }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Tools Grid */}
      <section className="py-16 bg-background">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard
                key={index}
                title={tool.title}
                description={tool.description}
                Icon={tool.Icon}
                href={tool.href}
                category={tool.category}
                featured={tool.featured}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">No tools found</h3>
              <p className="text-muted-foreground mb-6">
                There are no tools in this category yet. Please check back
                later.
              </p>
              <Button onClick={() => setActiveCategory("all")}>
                View All Tools
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
