// lib/schemas/blog-post-schema.js

export const blogPostSchema = (post) => {
  // Base URL (falls back if env var missing)
  const BASE = process.env.NEXT_PUBLIC_FRONT_URL || "https://theseohustler.com";
  const pageUrl = `${BASE}/blog/${post.slug}`;

  // Construct the “image” field via Next.js Image optimization
  const imageObj = {
    "@type": "ImageObject",
    url:
      `${BASE}/_next/image` +
      `?url=${encodeURIComponent(post.featuredImage.node.sourceUrl)}` +
      `&w=1200&q=85`,
    width: 1200,
    height: 800,
  };

  // Build the graph array
  const graph = [];

  // 1) WebPage object
  graph.push({
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: post.title,
    description: post.description,
    isPartOf: { "@id": `${BASE}/#website` },
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    primaryImageOfPage: imageObj,
    publisher: { "@id": `${BASE}/#organization` },
    mainEntity: { "@id": `${pageUrl}#article` },
  });

  // 2) BreadcrumbList
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: { "@id": BASE, name: "Home" },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: { "@id": `${BASE}/blog`, name: "Blog" },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: { "@id": pageUrl, name: post.title },
      },
    ],
  });

  // 3) Article object (with conditional keywords and additionalSchema)
  const articleNode = {
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: post.title,
    description: post.description,
    image: imageObj,
    author: {
      "@type": "Person",
      name: "Zac Almeida",
      url: `${BASE}/about`,
      sameAs: [
        "https://www.linkedin.com/in/zacalmeida/",
        "https://zacalmeida.com/",
      ],
    },
    publisher: { "@id": `${BASE}/#organization` },
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: { "@id": pageUrl },
  };

  // Only add `keywords` if it’s a non-empty array of objects with `keyword` property
  if (
    post.postschema &&
    Array.isArray(post.postschema.keywords) &&
    post.postschema.keywords.length > 0
  ) {
    articleNode.keywords = post.postschema.keywords.map(
      (k) => k.keyword
    );
  }

  // Only attempt to parse `additionalSchema` if it’s a non-empty string
  if (
    post.postschema &&
    typeof post.postschema.additionalSchema === "string" &&
    post.postschema.additionalSchema.trim() !== ""
  ) {
    try {
      const extraObj = JSON.parse(post.postschema.additionalSchema);
      if (extraObj && typeof extraObj === "object") {
        Object.assign(articleNode, extraObj);
      }
    } catch (err) {
      console.warn(
        "blogPostSchema: failed to parse additionalSchema:",
        err
      );
    }
  }

  graph.push(articleNode);

  // 4) Organization object (static)
  graph.push({
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "The SEO Hustler",
    url: BASE,
    logo: {
      "@type": "ImageObject",
      url: `${BASE}/the-seo-hustler-horizontal-full-black.png`,
      width: 1117,
      height: 256,
    },
    sameAs: [
      "https://www.linkedin.com/company/theseohustler/",
      "https://www.crunchbase.com/organization/the-seo-hustler",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Contact",
      email: "hello@theseohustler.com",
    },
    founder: {
      "@type": "Person",
      name: "Zac Almeida",
      url: `${BASE}/about`,
      sameAs: [
        "https://www.linkedin.com/in/zacalmeida/",
        "https://zacalmeida.com/",
      ],
    },
  });

  // 5) WebSite object (static)
  graph.push({
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: "The SEO Hustler",
    description:
      "SEO guides, actionable playbooks, and tools for SEOs and small businesses to boost organic visibility in traditional and AI search.",
    publisher: { "@id": `${BASE}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });

  // Return the full JSON‐LD schema
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};
