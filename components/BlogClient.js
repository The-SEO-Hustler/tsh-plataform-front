'use client';

import { useState } from "react";
import FeatureSection from "@/components/FeatureSection";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";

export default function BlogClient({ categories, blogPosts }) {
  // State for category filter
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter blog posts based on active category
  const filteredPosts = activeCategory === "all"
    ? blogPosts
    : blogPosts.filter(post => post.categorySlug === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#4e503a] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFDD00" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-foreground mb-6 leading-tight">
              SEO Blog & Resources
            </h1>
            <p className="text-xl text-gray-300 mb-8 dark:text-foreground/80">
              Expert insights, strategies, and tips to help you improve your website's search engine rankings.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter Categories */}
      <section className="py-2 md:py-6 bg-background border-b border-foreground/10 sticky top-16 z-20">
        <Container className="!px-0 md:!px-6">
          <div className="flex overflow-x-auto no-scrollbar gap-3 justify-start md:justify-center">
            {categories.map((category, idx) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`  rounded-full ${activeCategory === category.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground"} cursor-pointer ${idx === 0 ? "ml-4 md:ml-0" : ""}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-background">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <BlogCard key={index} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">No posts found</h3>
              <p className="text-on-surface-variant mb-6">
                There are no posts in this category yet. Please check back later.
              </p>
              <Button
                className="cursor-pointer"
                onClick={() => setActiveCategory("all")}
              >
                View All Posts
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Newsletter Section */}
      <FeatureSection
        title="Get SEO Tips Delivered to Your Inbox"
        description="Subscribe to our newsletter to receive the latest SEO strategies, tips, and industry insights."
        buttonText="Subscribe Now"
        buttonLink="#"
        image="/images/newsletter.svg"
        imageAlt="Newsletter subscription"
        reverse
      />
    </>
  );
} 