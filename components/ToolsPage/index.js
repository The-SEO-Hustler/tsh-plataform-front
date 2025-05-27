"use client";
import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import { ChartArea, NotebookPen, FileCode } from 'lucide-react';
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
    {
      title: "SEO Page Checker",
      description:
        "Check your on page SEO score and get real-time suggestions to improve your website.",
      Icon: (
        <svg width="56" height="56" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 17.5V12.25L26.25 3.5H10.5C9.57174 3.5 8.6815 3.86875 8.02513 4.52513C7.36875 5.1815 7 6.07174 7 7V35C7 35.9283 7.36875 36.8185 8.02513 37.4749C8.6815 38.1313 9.57174 38.5 10.5 38.5H17.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24.5 3.5V10.5C24.5 11.4283 24.8687 12.3185 25.5251 12.9749C26.1815 13.6313 27.0717 14 28 14H35" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 29L28 31L32 27" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 37C33.4183 37 37 33.4183 37 29C37 24.5817 33.4183 21 29 21C24.5817 21 21 24.5817 21 29C21 33.4183 24.5817 37 29 37Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M39 39.0002L34.7 34.7002" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: "/seo-check",
      category: "On Page SEO Checker",
      featured: false,
    },

    {
      title: "Advanced Keyword Analysis",
      description:
        "Analyze your keyword data with our advanced keyword analysis tool.",
      Icon: <ChartArea width={56} height={56} strokeWidth={1.5} className=" rounded-md" />,
      href: "/advanced-keyword-analysis",
      category: "Advanced Keyword Analysis",
      featured: false,
    },
    {
      title: "Content Planning Tool",
      description:
        "Plan your content for your website with our content planning tool.",
      Icon: <NotebookPen width={56} height={56} strokeWidth={1.5} className=" rounded-md" />,
      href: "/content-planning",
      category: "Content Planning Tool",
      featured: false,
    },
    {
      title: "LLMs.txt Generator",
      description:
        "Create optimized LLMs.txt files in minutes, not hours. Control how AI sees and represents your business.",
      Icon: <FileCode width={56} height={56} strokeWidth={1.5} className=" rounded-md" />,
      href: "/llms-txt-generator",
      category: "LLMs.txt Generator",
      featured: false,
    },
  ]

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-foreground mb-6 leading-tight">
              Free SEO Tools
            </h1>
            <p className="text-xl text-white/80 dark:text-foreground/70 mb-8">
              Access professional-grade SEO tools to research keywords, analyze
              competitors, optimize content, and more - completely free.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter Categories */}
      <section className="py-2 md:py-6 bg-background border-b  border-foreground/10 sticky top-16 z-20">
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
                  } ${activeCategory === category.label ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
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
