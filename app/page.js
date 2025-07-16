import React from "react";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ToolCard";
import BlogCard from "@/components/BlogCard";
import ResourceCard from "@/components/ResourceCard";
import FeatureSection from "@/components/FeatureSection";
import Hero from "@/components/Hero";
import { getAllPostsForHome } from "@/lib/wordpress/posts/getHomeCategories";
import Image from "next/image";
import Container from "@/components/container";
import { getAllResourcePage } from "@/lib/wordpress/resources/getAllResourcePage";
import Link from "next/link";
export const revalidate = 3600;
import getMetadata from "@/lib/getMetadata";
import SEO_DATA from "@/lib/seo-data";
import { tools } from "@/lib/toolsMetaData";
import { homepageSchema } from "@/lib/schemas/homepage-schema";
export const metadata = getMetadata(SEO_DATA.index);

export default async function Home() {
  const latestPosts = await getAllPostsForHome();
  let latestResources = await getAllResourcePage();
  latestResources = latestResources.playbooks.concat(
    latestResources.spreadsheets,
    latestResources.ebooks
  );

  // console.log('latestResources', latestResources);
  // const latestPosts = [];

  const blogPosts = latestPosts.map(({ node }) => {
    // Sanitize excerpt to ensure consistent rendering
    const excerpt = node.excerpt ? node.excerpt.replace(/<[^>]*>/g, "") : "";

    return {
      title: node.title,
      excerpt: excerpt,
      category: node.categories?.edges[0]?.node?.name || "Uncategorized",
      categorySlug: node.categories?.edges[0]?.node?.slug || "uncategorized",
      slug: node.slug,
      date: new Date(node.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: Math.ceil(excerpt.split(" ").length / 250), // Rough estimate
      featuredImage:
        node.featuredImage?.node?.sourceUrl || "/images/blog-placeholder.jpg",
      featuredImageAlt: node.featuredImage?.node?.altText || node.title,
    };
  });



  // Features list
  const features = [
    {
      title: "Free SEO Tools",
      description:
        "Access powerful tools to research keywords, analyze competitors, optimize content, and more.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
      href: "/free-tools",
    },
    {
      title: "In-Depth Guides",
      description:
        "Learn SEO from the ground up with comprehensive guides covering every aspect of search optimization.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      href: "/resources",
    },
    {
      title: "Actionable Resources",
      description:
        "Download templates, checklists, and cheatsheets to streamline your SEO workflow.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      href: false,
    },
    {
      title: "Expert Courses",
      description:
        "Take your skills to the next level with our premium courses taught by industry professionals.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
      ),
      href: false,
    },
  ];

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(homepageSchema)}
      </script>
      {/* Hero Section */}
      <Hero />

      {/* Features Overview */}
      <FeatureSection
        centered={true}
        background="light"
        title="Everything You Need to Dominate SEO"
        description="The SEO Hustler provides all the tools and resources you need to grow your organic traffic, without the fluff or technical jargon."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, idx) => {
            const content = (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-shape-large bg-card shadow-lg m3-transition rounded-lg relative"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-on-surface">
                  {feature.title}
                </h3>
                <p className="text-foreground">{feature.description}</p>

                {!feature.href && (
                  <span className="absolute top-3 right-3 bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
              </div>
            );

            return feature.href ? (
              <Link
                key={idx}
                href={feature.href}
                className="no-underline hover:outline outline-foreground rounded-lg overflow-hidden block"
              >
                {content}
              </Link>
            ) : (
              content
            );
          })}
        </div>
      </FeatureSection>

      {/* SEO Tools Section */}
      <FeatureSection
        background="dark"
        title="Powerful SEO Tools, Completely Free"
        description="Access professional-grade SEO tools that help you research, analyze, and optimize without spending a dime."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.filter(tool => tool.featured).map((tool, index) => (
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

        <div className="mt-10 text-center">
          <Button
            variant="secondary"
            size="lg"
            href="/free-tools"
            className="cursor-pointer"
          >
            View All Tools
          </Button>
        </div>
      </FeatureSection>

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <FeatureSection
          background="light"
          title="Latest from Our Blog"
          description="Learn actionable SEO strategies and stay up-to-date with the latest industry trends."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <BlogCard key={index} post={post} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" href="/blog">
              Read More Articles
            </Button>
          </div>
        </FeatureSection>
      )}

      {/* Resources Section */}
      <FeatureSection
        background="darkGradient"
        title="Free Resources & Templates"
        description="Download actionable resources to streamline your SEO workflow and get results faster."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestResources.slice(0, 3).map((resource, index) => (
            <ResourceCard key={index} {...resource} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" href="/resources">
            Browse All Resources
          </Button>
        </div>
      </FeatureSection>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-[#ecefc7] dark:to-[#48483c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="smallGrid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>

        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Ready to Take Your SEO to the Next Level?
            </h2>
            <p className="text-xl mb-8 text-black">
              Join thousands of website owners who are growing their traffic
              with The SEO Hustler's free tools and resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" href="/free-tools">
                Start with Free Tools
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <FeatureSection
        background="light"
        centered={true}
        title="What Our Members Say"
        description="Join thousands of SEO professionals and website owners who grow their businesses with The SEO Hustler."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              id: 1,
              rating: 5,
              text: "The tools and resources from The SEO Hustler have been a game-changer for my business. I was able to increase my organic traffic by 237% in just 3 months following their step-by-step guides.",
              name: "Sarah Johnson",
              role: "E-commerce Website Owner",
            },
            {
              id: 2,
              rating: 5,
              text: "As a small business owner, I struggled with SEO until I found these resources. The spreadsheets helped me track my progress, and the guides provided actionable steps that actually worked. My local search rankings improved significantly!",
              name: "Michael Chen",
              role: "Local Business Owner",
            },
            {
              id: 3,
              rating: 5,
              text: "The SEO ebooks were exactly what I needed to understand the fundamentals. I implemented the strategies in my content marketing plan and saw a 45% increase in conversions. Highly recommend for anyone serious about SEO.",
              name: "Emily Rodriguez",
              role: "Content Marketing Manager",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card p-6 rounded-shape-large shadow-elevation-1"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-on-surface-variant mb-4">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-on-surface-variant"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-bold text-on-surface">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FeatureSection>
    </>
  );
}
