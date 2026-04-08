import React from "react";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import ResourceCard from "@/components/ResourceCard";
import FeatureSection from "@/components/FeatureSection";
import Hero from "@/components/Hero";
import { getAllPostsForHome } from "@/lib/wordpress/posts/getHomeCategories";
import Image from "next/image";
import Container from "@/components/container";
import { getLatestResourcesForHome } from "@/lib/wordpress/resources/getAllResourcePage";
import Link from "next/link";
import HomeFaq from "@/components/HomeFaq";
export const revalidate = 3600;
import getMetadata from "@/lib/getMetadata";
import SEO_DATA from "@/lib/seo-data";
import { homepageSchema } from "@/lib/schemas/homepage-schema";
export const metadata = getMetadata(SEO_DATA.index);

export default async function Home({ searchParams }) {
  const latestPosts = await getAllPostsForHome();
  const latestResources = await getLatestResourcesForHome(3);
  const initialTool =
    typeof searchParams?.tool === "string" ? searchParams.tool : undefined;

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
      authorName: node.author?.node?.name || "The SEO Hustler",
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

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(homepageSchema)}
      </script>
      {/* Hero Section */}
      <Hero initialTool={initialTool} />

      {/* Bento Value Prop */}
      <section className="py-20 bg-background">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Bypass paywalls. Get enterprise data.
            </h2>
            <p className="mt-3 text-lg text-foreground/70 max-w-2xl">
              Run technical audits and E&#8209;E&#8209;A&#8209;T checks without
              a credit card, then ship fixes with confidence.
            </p>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
              <article className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-elevation-1 lg:col-span-2 lg:row-span-2">
                <div className="p-6 md:p-8">
                  <p className="text-xs font-mono text-foreground/60">
                    seo.audit
                  </p>
                  <h3 className="mt-3 text-2xl md:text-3xl font-black text-foreground">
                    Fast technical audits, zero fluff
                  </h3>
                  <p className="mt-3 text-foreground/70 max-w-2xl">
                    Diagnose crawlability, content signals, and on-page issues
                    in minutes—then get prioritized fixes.
                  </p>

                  <div className="mt-6 rounded-xl border border-border bg-background/40 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-mono text-foreground/60">
                        report.json
                      </p>
                      <span className="text-xs font-mono text-primary">ok</span>
                    </div>
                    <pre className="mt-3 text-xs md:text-sm leading-relaxed text-foreground/80 overflow-x-auto">
                      {`{
  "target_url": "https://scenic.com/",
  "health_score": 86,
  "core_web_vitals": {
    "lcp_ms": 688,
    "tbt_ms": 213,
    "status": "needs_improvement"
  },
  "critical_issues": [
    "dom_size_exceeded (1340 nodes)",
    "missing_open_graph_tags",
    "oversized_images (payload: 881KB)"
  ],
  "time_to_run": "1.2s"
}`}
                    </pre>
                  </div>
                  <Link
                    href="/seo-check"
                    className="dark:text-primary text-foreground underline underline-offset-4 mt-4 block text-sm"
                  >
                    SEO audit tool
                  </Link>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-elevation-1">
                <div className="p-6 md:p-7">
                  <p className="text-xs font-mono text-foreground/60">
                    ai.search
                  </p>
                  <h3 className="mt-3 text-xl font-black text-foreground">
                    Optimize for AI search
                  </h3>
                  <p className="mt-2 text-foreground/70">
                    Generate a clean `llms.txt` so your content is easier to
                    parse, cite, and surface.
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">
                      <Link
                        href="/llms-txt-generator"
                        className="dark:text-primary text-foreground underline underline-offset-4"
                      >
                        LLMs.txt generator
                      </Link>
                    </h4>
                  </div>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-elevation-1">
                <div className="p-6 md:p-7">
                  <p className="text-xs font-mono text-foreground/60">
                    serp.intent
                  </p>
                  <h3 className="mt-3 text-xl font-black text-foreground">
                    Reverse-engineer the SERPs
                  </h3>
                  <p className="mt-2 text-foreground/70">
                    Map intent patterns and content expectations so you stop
                    writing “maybes”.
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">
                      <Link
                        href="/search-intent"
                        className="dark:text-primary text-foreground underline underline-offset-4"
                      >
                        Search intent tool
                      </Link>
                    </h4>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </Container>
      </section>

      {/* Authority Content Hub */}
      <section className="py-20 bg-background">
        <Container>
          <div className="max-w-8xl mx-auto">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  DIY SEO playbooks &amp; technical guides
                </h2>
                <p className="mt-3 text-lg text-foreground/70">
                  Actionable, BS-free blueprints to scale your organic traffic.
                </p>
              </div>
              <Button
                variant="secondary"
                href="/blog"
                className="cursor-pointer"
              >
                Browse our Articles
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post) => (
                <article
                  key={post.slug}
                  className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-elevation-1 overflow-hidden"
                >
                  <div className="relative aspect-[16/9] bg-foreground/5">
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-mono text-foreground/60">
                      {post.category}
                    </p>
                    <h3 className="mt-3 text-xl font-black text-foreground leading-snug">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="no-underline after:content-[''] after:absolute after:inset-0"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <div
                      className="mt-3 text-foreground/70 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                    <p className="mt-5 text-sm text-foreground/60">
                      By {post.authorName}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <HomeFaq />
      </Container>

      {/* Blog Section */}
      {/* {blogPosts.length > 0 && (
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
      )} */}

      {/* Resources Section */}
      <FeatureSection
        background="darkGradient"
        title="Free Resources & Templates"
        description="Download actionable resources to streamline your SEO workflow and get results faster."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {(() => {
            const cleanExcerpt = (html) =>
              String(html || "")
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            const toHook = (html, fallbackTitle) => {
              const text = cleanExcerpt(html);
              if (!text) return "";
              // Avoid “heading + paragraph jam”: cut at first sentence-ish boundary.
              const match = text.match(/^(.{60,180}?[.!?])\s/);
              const first = match ? match[1] : text.slice(0, 160).trim();
              return first.endsWith(".") ||
                first.endsWith("!") ||
                first.endsWith("?")
                ? first
                : `${first}.`;
            };

            const getResourceType = (r) =>
              r?.resourceTypes?.edges?.[0]?.node?.name || "resource";
            const getHref = (r) => `/${getResourceType(r)}/${r?.slug}`;

            const featured = latestResources?.[0];
            const secondary = (latestResources || []).slice(1, 3);

            if (!featured) return null;

            const featuredType = getResourceType(featured);
            const featuredHref = getHref(featured);
            const featuredImage =
              featured?.featuredImage?.node?.sourceUrl || null;
            const featuredAlt =
              featured?.featuredImage?.node?.altText || featured?.title;

            return (
              <>
                <article className="relative rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-elevation-2 overflow-hidden lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-0 h-full md:h-full">
                    <div className="relative h-full md:h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent pointer-events-none h-full md:h-full" />
                      {featuredImage ? (
                        <div className="relative h-full md:h-full">
                          <Image
                            src={featuredImage}
                            alt={featuredAlt}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 40vw, 100vw"
                          />
                        </div>
                      ) : (
                        <div className="h-[220px] md:h-full bg-foreground/10" />
                      )}
                      {/* “Productized” cover treatment */}
                      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
                    </div>

                    <div className="p-6 md:p-7">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-black dark:text-primary">
                          {featuredType}
                        </span>
                        <p className="text-xs text-foreground/60">
                          By {featured?.author?.node?.name || "The SEO Hustler"}
                        </p>
                      </div>

                      <h3 className="mt-4 text-2xl md:text-3xl font-black text-foreground leading-tight">
                        <Link href={featuredHref} className="no-underline">
                          {featured?.title}
                        </Link>
                      </h3>

                      <div
                        className="mt-3 text-foreground/70 max-w-2xl"
                        dangerouslySetInnerHTML={{
                          __html: toHook(featured?.excerpt, featured?.title),
                        }}
                      />

                      <div className="mt-6 flex items-center gap-4">
                        <Link
                          href={featuredHref}
                          className="inline-flex items-center font-semibold text-primary underline underline-offset-4"
                        >
                          Access resource →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>

                <div className="flex flex-col gap-6">
                  {secondary.map((r) => {
                    const type = getResourceType(r);
                    const href = getHref(r);
                    const img = r?.featuredImage?.node?.sourceUrl || null;
                    const alt = r?.featuredImage?.node?.altText || r?.title;
                    return (
                      <article
                        key={r?.slug}
                        className="relative rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-elevation-1 overflow-hidden"
                      >
                        <div className="flex gap-4 p-5">
                          <div className="relative w-[86px] h-[86px] rounded-xl overflow-hidden bg-foreground/10 shrink-0">
                            {img ? (
                              <Image
                                src={img}
                                alt={alt}
                                fill
                                sizes="86px"
                                className="object-cover"
                              />
                            ) : null}
                            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase text-black dark:text-primary">
                                {type}
                              </span>
                              <span className="text-[11px] text-foreground/60">
                                By {r?.author?.node?.name || "The SEO Hustler"}
                              </span>
                            </div>
                            <h3 className="mt-2 text-lg font-black text-foreground leading-snug">
                              <Link href={href} className="no-underline">
                                {r?.title}
                              </Link>
                            </h3>
                            <div
                              className="mt-2 text-sm text-foreground/70 line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: toHook(r?.excerpt, r?.title),
                              }}
                            />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" href="/resources">
            Browse All Resources
          </Button>
        </div>
      </FeatureSection>

      {/* CTA Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full bg-foreground/10 blur-3xl dark:bg-foreground/5" />
        </div>

        <Container>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-elevation-2 overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border bg-foreground/[0.03]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>
                <p className="text-xs font-mono text-foreground/60">
                  toolkit.init
                </p>
              </div>

              <div className="px-6 py-10 md:px-10 md:py-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                    Stop guessing. Start auditing.
                  </h2>
                  <p className="mt-4 text-lg text-foreground/70 max-w-2xl">
                    Execute technical SEO audits, map E&#8209;E&#8209;A&#8209;T
                    signals, and reverse-engineer search intent without leaving
                    the browser.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-mono text-foreground/60">
                    <span className="text-primary">›</span>
                    <span>no paywalls</span>
                    <span className="opacity-40">/</span>
                    <span>fast results</span>
                    <span className="opacity-40">/</span>
                    <span>ship fixes</span>
                  </div>
                </div>

                <div className="flex md:justify-end">
                  <Button size="lg" href="/free-tools" className="font-mono">
                    Initialize Toolkit_
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      {/* <FeatureSection
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
                &quot;{testimonial.text}&quot;
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
      </FeatureSection> */}
    </>
  );
}
